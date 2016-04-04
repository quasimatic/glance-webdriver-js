import shortid from 'shortid';
import log from "loglevel";

import loadGlanceSelector from '../lib/glance-selector';

import {tagElementWithID, GlanceSelector, waitForChange} from './client';
import GetStrategies from './get-strategies';
import SetStrategies from './set-strategies';
import WebdriverIODriver from './drivers/webdriverio-driver';
import {Parser} from '@quasimatic/glance-selector'
import PromiseUtils from './promise-utils';

import Cast from "./cast";

var customGets = [];
var customSets = [];

class Glance {
    constructor(config) {
        this.promiseUtils = new PromiseUtils(new Promise((resolve, reject)=> {
                if (config.logLevel) {
                    this.setLogLevel(config.logLevel);
                }

                if (config.browser) {
                    this.customLabels = config.customLabels || {}
                    this.browser = config.browser;
                    resolve();
                }
                else if (config.driverConfig) {
                    this.customLabels = {};
                    this.browser = new WebdriverIODriver(config.driverConfig);
                    this.browser.init().then(resolve);

                }
                else {
                    console.log("A driver or driverConfig must be provided.");
                    reject();
                }
            }), config);
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
            return this.promiseUtils.retryingPromise(func)
        });
    }

    url(address) {
        return this.wrapPromise(()=> this.browser.url(address))
    }

    end() {
        return this.wrapPromise(()=> this.browser.end())
    }

    //
    // Cast
    //
    cast(state) {
        return this.wrapPromise(()=>new Cast(new Glance(this)).apply(state));
    }

    //
    // Interactions
    //
    type(text) {
        return this.wrapPromise(()=> this.browser.keys(text));
    }

    click(selector) {
        return this.wrapPromise(() => this.convertGlanceSelector(selector).then((wdioSelector) => this.browser.click(wdioSelector)));
    }

    doubleClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> this.browser.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.browser.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.browser.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.browser.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.wrapPromise(()=> this.browser.buttonDown(0));
    }

    mouseUp() {
        return this.wrapPromise(()=> this.browser.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.wrapPromise(()=> {
            return Promise.all([
                    this.convertGlanceSelector(sourceSelector),
                    this.convertGlanceSelector(targetSelector)
                ])
                .then(result => this.browser.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.wrapPromise(()=> this.browser.pause(delay));
    }

    //
    // Wait for change
    //
    // watchForChange(selector) {
    //     return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> this.driver.selectorExecute(wdioSelector, function (elements) {
    //         elements[0].setAttribute("data-glance-wait-for-change", "true")
    //     })));
    // }
    //
    // waitForChange(selector) {
    //     return this.wrapPromise(()=> {
    //         return this.convertGlanceSelector(selector).then((wdioSelector)=> {
    //             return this.driver.getAttribute(wdioSelector, "data-glance-wait-for-change").then((res)=> {
    //                 if (res == null)
    //                     return Promise.resolve();
    //                 else
    //                     return Promise.reject("Waiting for element to change: " + reference)
    //             }, () => Promise.resolve())
    //
    //         })
    //     });
    // }

    //
    // Labels
    //
    addLabel(label, func) {
        return this.wrapPromise(()=> {
            this.customLabels[label] = func;
            return Promise.resolve();
        });
    }

    //
    // Getters and Setters
    //
    get(selector) {
        var g = new Glance(this);
        return this.wrapPromise(()=> {
            return GetStrategies.firstResolved((getStrategy)=> getStrategy(g, selector, customGets))
        });
    }

    set(selector, value) {
        var g = new Glance(this);
        return this.wrapPromise(()=> {
            return SetStrategies.firstResolved((setStrategy)=> setStrategy(g, selector, value, customSets))
        });
    }

    addGetter(label, lookup) {
        return this.wrapPromise(()=> {
            customGets[label] = lookup
            return Promise.resolve();
        })
    }

    addSetter(label, lookup) {
        return this.wrapPromise(()=> {
            customSets[label] = lookup
            return Promise.resolve();
        });
    }

    //
    // Script excecution
    //
    execute(func, ...args) {
        return this.wrapPromise(()=> this.browser.execute(func, args));
    }

    //
    // Glance selector
    //
    glanceElement(selector, resolvedLabels, multiple) {
        var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels)
        var logLevel = this.logLevel;

        return this.browser
            .execute(loadGlanceSelector)
            .then(() => {
                return this.browser.execute(GlanceSelector, selector, mergedLabels, multiple, logLevel)
                    .then(res => {
                        var val = [].concat(res.value);

                        var ids = val.map(function (e) {
                            return shortid.generate();
                        });

                        return {val, ids}
                    })
                    .then(({val, ids}) => {
                        return this.browser.execute(tagElementWithID, val, ids)
                        //return Promise.resolve()
                            .then(function () {
                            var idsAsCss = ids.map(function (id) {
                                return `[data-glance-id="${id}"]`;
                            });

                            return this.log("browser").then(function (logs) {
                                log.debug("CLIENT:", logs.value.map(l => l.message).join("\n").replace(/ \(undefined:undefined\)/g, ''))

                                if (idsAsCss.length == 0) {
                                    throw new Error("Element not found: " + selector);
                                }

                                if (idsAsCss.length == 1) {
                                    return idsAsCss[0];
                                }

                                if (multiple) {
                                    return idsAsCss.join(",");
                                }

                                if (idsAsCss.length > 1) {
                                    throw new Error("Found " + idsAsCss.length + " duplicates for: " + selector)
                                }
                            });
                        })
                    })

            })
    }

    getCustomLabeledElements(reference) {
        return new Promise((resolve, reject)=> {

            var data = this.parse(reference);
            var labels = data.map((r)=> r.label);

            var foundLabels = labels.filter((label)=> {
                return this.customLabels[label] && typeof(this.customLabels[label]) == 'function';
            });

            var resolvedCustomLabels = {};
            foundLabels.resolveSeries((key) => {
                var g = new Glance(this);

                return Promise.resolve(this.customLabels[key](g, key)).then((element) => {
                    resolvedCustomLabels[key] = element.value;
                })
            }).then(() => {
                resolve(resolvedCustomLabels);
            })
        })

    }

    convertGlanceSelector(reference) {
        return this.getCustomLabeledElements(reference).then((labels)=> {
            return this.glanceElement(reference, labels).then((cssIds)=> {
                    return this.browser.element(cssIds)
                        .then(res => {
                            return this.browser.execute(waitForChange, res.value, "data-glance-wait-for-change")
                        })
                        .then((res)=> {
                            if (res.value == null) {
                                return Promise.resolve(cssIds);
                            }
                            else {
                                return Promise.reject("Waiting for element to change: " + reference)
                            }
                        }, ()=> {
                            return Promise.resolve(cssIds)
                        });

                })
                .catch(function (reason) {
                    return Promise.reject(reason.message);
                });
        });
    }

    convertGlanceSelectors(reference) {
        return new Promise((resolve, reject)=> {
            return this.getCustomLabeledElements(reference).then((labels)=> {
                return this.glanceElement(reference, labels, true).then((cssIds)=> {
                        resolve(cssIds);
                    })
                    .catch(function (reason) {
                        reject(reason.message);
                    });
            });
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = onFulfilled || function (value) {
                return Promise.resolve(value)
            };
        onRejected = onRejected || function (reason) {
                return Promise.reject(reason)
            };

        var g = this;
        return this.promiseUtils.waitForThen(g, function (value) {
                g.promiseUtils.setPromise(Promise.resolve())
                return Promise.resolve(onFulfilled(value));
            },
            function (reason) {
                g.promiseUtils.setPromise(Promise.resolve())
                return Promise.resolve(onRejected(reason));
            }
        );
    }

    catch(onRejected) {
        onRejected = onRejected || function (reason) {
                return Promise.reject(reason)
            };

        var g = this;
        return this.promiseUtils.waitForCatch(g, function (reason) {
            g.promiseUtils.setPromise(Promise.resolve())
            return Promise.resolve(onRejected(reason));
        });
    }
}

export {Cast}

export default Glance