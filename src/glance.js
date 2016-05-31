import shortid from 'shortid'
import log from 'loglevel'

import loadGlanceSelector from '../lib/glance-selector'
import WebdriverIOAdapter from './adapters/webdriverio-adapter'

import {tagElementWithID, GlanceSelector, addPropertiesToBrowser, serializeBrowserSideProperties} from './utils/client'
import GetStrategies from './getters/get-strategies'
import SetStrategies from './setters/set-strategies'

import {Parser} from 'glance-selector'
import PromiseUtils from './utils/promise-utils'

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

            if (config.browser) {
                this.extensions = config.extensions || [];
                this.browser = config.browser;
                this.driver = this.browser.driver;
                resolve();
            } else if (config.driverConfig) {
                this.extensions = config.extensions || [];
                this.browser = new WebdriverIOAdapter(config.driverConfig);
                this.browser.init().then(resolve);
                this.driver = this.browser.driver;
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
    
    url(address) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.url(address));
    }

    end() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.end());
    }

    //
    // Cast
    //
    cast(state) {
        return this.promiseUtils.wrapPromise(this, () => new Cast(new Glance(this)).apply(state));
    }

    //
    // Interactions
    //
    type(text) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.keys(text));
    }

    click(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.find(selector).then((wdioSelector) => {
            log.info('Clicking:', selector);
            return this.browser.click(wdioSelector);
        }));
    }

    doubleClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.find(selector).then((wdioSelector) => this.browser.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.find(selector).then((wdioSelector) => this.browser.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.find(selector).then((wdioSelector) => this.browser.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.promiseUtils.wrapPromise(this, () => this.find(selector).then((wdioSelector) => this.browser.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonDown(0));
    }

    mouseUp() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.promiseUtils.wrapPromise(this, () => {
            return Promise.all([
                this.find(sourceSelector),
                this.find(targetSelector)
            ])
                .then(result => this.browser.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.pause(delay));
    }

    saveScreenshot(filename) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.saveScreenshot(filename));
    }

    //
    // Extensions
    //
    addExtension(extension) {
        return this.promiseUtils.wrapPromise(this, () => {
            this.extensions.push(extension);
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
        var properties = lastLabel.properties.filter(name => defaultModifiers[name] && defaultModifiers[name].getter).map(name => defaultModifiers[name]);

        return this.promiseUtils.wrapPromise(this, () => {
            let customLabels = this.extensions.filter(e => e.labels).reduce((o, e) => Object.assign({}, o, e.labels), {});
            if (customLabels[selector] && customLabels[selector].get) {
                return Promise.resolve(customLabels[selector].get(g));
            }

            if (properties.length > 0) {
                return properties[0].getter(g, selector);
            } else {
                return GetStrategies.firstResolved((getStrategy) => getStrategy(g, selector, customGets));
            }
        });
    }

    set(selector, ...values) {
        var g = new Glance(this);
        return this.promiseUtils.wrapPromise(this, () => {
            let customLabels = this.extensions.filter(e => e.labels).reduce((o, e) => Object.assign({}, o, e.labels), {});
            if (customLabels[selector] && customLabels[selector].set) {
                return Promise.resolve(customLabels[selector].set.apply(this, [].concat(g, values)));
            } else {
                return SetStrategies.firstResolved((setStrategy) => setStrategy(g, selector, values[0], customSets));
            }
        });
    }

    //
    // Script excecution
    //
    execute(func, ...args) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.execute(func, args));
    }

    //
    // Glance selector
    //
    glanceElement(selector, resolvedLabels, multiple) {
        var mergedLabels = Object.assign({}, resolvedLabels);
        var logLevel = this.logLevel;

        return this.browser
            .execute(loadGlanceSelector)
            .then(() => {
                var resolvedCustomLabels = Object.keys(mergedLabels).reduce(function (previous, current) {
                    previous[current] = mergedLabels[current];
                    return previous;
                }, {});

                var configuredModifiers = this.extensions.filter(e => e.properties).reduce((o, e) => Object.assign({}, o, e.properties), {});

                return this.browser.execute(addPropertiesToBrowser, serializeBrowserSideProperties(configuredModifiers)).then(() => {
                    return this.browser.execute(GlanceSelector, selector, resolvedCustomLabels, multiple, logLevel)
                        .then(res => {
                            var val = [].concat(res.value);

                            var ids = val.map(function () {
                                return shortid.generate();
                            });

                            return {val, ids};
                        })
                        .then(({val, ids}) => {
                            return this.browser.execute(tagElementWithID, val, ids)
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
                                            console.log('Found ' + idsAsCss.length + ' duplicates for: ' + selector);
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
