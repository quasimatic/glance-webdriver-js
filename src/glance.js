import shortid from 'shortid'
import log from 'loglevel'

import loadGlanceSelector from '../lib/glance-selector'

import {tagElementWithID, GlanceSelector, addModifiersToBrowser, serializeModifiers} from './client'
import GetStrategies from './get-strategies'
import SetStrategies from './set-strategies'
import WebdriverIODriver from './drivers/webdriverio-driver'
import {Parser} from 'glance-selector'
import PromiseUtils from './promise-utils'

import getHTML from './getters/html'
import getValue from './getters/value';

import Cast from './cast'

const customGets = [];
const customSets = [];

const defaultModifiers = {
    'html': {
        getter: getHTML
    },

    'value': {
        getter: getValue
    }
};

class Glance {
    constructor(config) {
        this.config = config.config || config;
        this.promiseUtils = new PromiseUtils(new Promise((resolve, reject) => {
            if (config.logLevel) {
                this.setLogLevel(config.logLevel);
            }

            if (config.webdriver) {
                this.customLabels = config.customLabels || {};
                this.modifiers = config.modifiers || {};
                this.extensions = config.extensions || [];
                this.webdriver = config.webdriver;
                resolve();
            } else if (config.driverConfig) {
                this.customLabels = {};
                this.modifiers = {};
                this.extensions = config.extensions || [];
                this.webdriver = new WebdriverIODriver(config.driverConfig);
                this.webdriver.init().then(resolve);
            } else {
                console.log('A driver or driverConfig must be provided.');
                reject();
            }
        }), this.config);
    }

    parse(reference) {
        return Parser.parse(reference);
    }

    setLogLevel(level) {
        log.setLevel(level);
        this.logLevel = level;
        return this;
    }

    wrapPromise(func) {
        return this.promiseUtils.waitForThen(this, function () {
            return this.promiseUtils.retryingPromise(func);
        });
    }

    url(address) {
        return this.wrapPromise(() => this.webdriver.url(address));
    }

    end() {
        return this.wrapPromise(() => this.webdriver.end());
    }

    //
    // Cast
    //
    cast(state) {
        return this.wrapPromise(() => new Cast(new Glance(this)).apply(state));
    }

    //
    // Interactions
    //
    type(text) {
        return this.wrapPromise(() => this.webdriver.keys(text));
    }

    click(selector) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => {
            log.info('Clicking:', selector);
            return this.webdriver.click(wdioSelector);
        }));
    }

    doubleClick(selector) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => this.webdriver.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => this.webdriver.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => this.webdriver.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => this.webdriver.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.wrapPromise(() => this.webdriver.buttonDown(0));
    }

    mouseUp() {
        return this.wrapPromise(() => this.webdriver.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.wrapPromise(() => {
            return Promise.all([
                this.find(sourceSelector),
                this.find(targetSelector)
            ])
                .then(result => this.webdriver.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.wrapPromise(() => this.webdriver.pause(delay));
    }

    saveScreenshot(filename) {
        return this.wrapPromise(() => this.webdriver.saveScreenshot(filename));
    }

    setCustomLabels(labels) {
        Object.assign(this.customLabels, labels);
    }

    //
    // Extensions
    //
    addExtension(extension) {
        return this.wrapPromise(() => {
            this.extensions.push(extension);
            return Promise.resolve();
        });
    }

    //
    // Modifiers
    //
    addModifiers(modifiers) {
        return this.wrapPromise(() => {
            Object.assign(this.modifiers, modifiers);
            return Promise.resolve();
        });
    }

    //
    // Getters and Setters
    //
    get(selector) {
        let g = new Glance(this);
        let data = Parser.parse(selector);
        let lastLabel = data[data.length - 1];
        var modifiers = lastLabel.modifiers.filter(name => defaultModifiers[name] && defaultModifiers[name].getter).map(name => defaultModifiers[name]);

        return this.wrapPromise(() => {
            if (this.customLabels[selector] && this.customLabels[selector].get) {
                return Promise.resolve(this.customLabels[selector].get(g));
            }

            if (modifiers.length > 0) {
                return modifiers[0].getter(g, selector);
            } else {
                return GetStrategies.firstResolved((getStrategy) => getStrategy(g, selector, customGets));
            }
        });
    }

    set(selector, ...values) {
        var g = new Glance(this);
        return this.wrapPromise(() => {
            if (this.customLabels[selector] && this.customLabels[selector].set) {
                return Promise.resolve(this.customLabels[selector].set.apply(this, [].concat(g, values)));
            } else {
                return SetStrategies.firstResolved((setStrategy) => setStrategy(g, selector, values[0], customSets));
            }
        });
    }

    addGetter(label, lookup) {
        return this.wrapPromise(() => {
            if (this.customLabels[label]) {
                this.customLabels[label].get = lookup;
            } else {
                this.customLabels[label] = {get: lookup};
            }

            return Promise.resolve();
        });
    }

    addSetter(label, lookup) {
        return this.wrapPromise(() => {
            if (this.customLabels[label]) {
                this.customLabels[label].set = lookup;
            } else {
                this.customLabels[label] = {set: lookup};
            }

            customSets[label] = lookup;
            return Promise.resolve();
        });
    }

    //
    // Script excecution
    //
    execute(func, ...args) {
        return this.wrapPromise(() => this.webdriver.execute(func, args));
    }

    //
    // Glance selector
    //
    glanceElement(selector, resolvedLabels, multiple) {
        var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels);
        var logLevel = this.logLevel;

        return this.webdriver
            .execute(loadGlanceSelector)
            .then(() => {
                var resolvedCustomLabels = Object.keys(mergedLabels).reduce(function (previous, current) {
                    previous[current] = mergedLabels[current];
                    return previous;
                }, {});

                return this.webdriver.execute(addModifiersToBrowser, serializeModifiers(this.modifiers)).then(() => {
                    return this.webdriver.execute(GlanceSelector, selector, resolvedCustomLabels, multiple, logLevel)
                        .then(res => {
                            var val = [].concat(res.value);

                            var ids = val.map(function () {
                                return shortid.generate();
                            });

                            return {val, ids};
                        })
                        .then(({val, ids}) => {
                            return this.webdriver.execute(tagElementWithID, val, ids)
                                .then(function () {
                                    var idsAsCss = ids.map(function (id) {
                                        return `[data-glance-id="${id}"]`;
                                    });

                                    return this.log('browser').then(function (logs) {
                                        log.debug('CLIENT:', logs.value.map(l => l.message).join('\n').replace(/ \(undefined:undefined\)/g, ''));

                                        if (idsAsCss.length === 0) {
                                            throw new Error('Element not found: ' + selector);
                                        }

                                        if (idsAsCss.length === 1) {
                                            return idsAsCss[0];
                                        }

                                        if (multiple) {
                                            return idsAsCss.join(',');
                                        }

                                        if (idsAsCss.length > 1) {
                                            throw new Error('Found ' + idsAsCss.length + ' duplicates for: ' + selector);
                                        }
                                    });
                                });
                        });
                });
            });
    }

    getCustomLabeledElements(reference) {
        return new Promise((resolve) => {
            var data = this.parse(reference);
            var labels = data.map((r) => r.label);

            var customLabels = this.extensions.filter(e => e.labels).reduce((o, e) => Object.assign({}, o, e.labels), {});

            var foundLabels = labels.filter((label) => {
                return customLabels[label] && typeof (customLabels[label].locate) === 'function';
            });

            var resolvedCustomLabels = {};
            foundLabels.resolveSeries((key) => {
                var g = new Glance(this);

                return Promise.resolve(customLabels[key].locate(key, {glance: g})).then((element) => {
                    resolvedCustomLabels[key] = element.value;
                    // resolvedCustomLabels[key] = {locate: element.value}
                });
            }).then(() => {
                resolve(resolvedCustomLabels);
            });
        });
    }

    find(selector) {
        return this.getCustomLabeledElements(selector).then((labels) => {
            return this.glanceElement(selector, labels);
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = onFulfilled || function (value) {
                return Promise.resolve(value);
            };

        onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

        var g = this;
        return this.promiseUtils.waitForThen(g, function (value) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onFulfilled(value));
            },
            function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
    }

    catch(onRejected) {
        onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

        var g = this;
        return this.promiseUtils.waitForCatch(g, function (reason) {
            g.promiseUtils.setPromise(Promise.resolve());
            return Promise.resolve(onRejected(reason));
        });
    }
}

export {Cast}

export default Glance
