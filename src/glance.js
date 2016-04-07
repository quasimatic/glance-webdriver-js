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

                if (config.webdriver) {
                    this.customLabels = config.customLabels || {}
                    this.webdriver = config.webdriver;
                    resolve();
                }
                else if (config.driverConfig) {
                    this.customLabels = {};
                    this.webdriver = new WebdriverIODriver(config.driverConfig);
                    this.webdriver.init().then(resolve);

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
        return this.wrapPromise(()=> this.webdriver.url(address))
    }

    end() {
        return this.wrapPromise(()=> this.webdriver.end())
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
        return this.wrapPromise(()=> this.webdriver.keys(text));
    }

    click(selector) {
        return this.wrapPromise(() => this.find(selector).then((wdioSelector) => this.webdriver.click(wdioSelector)));
    }

    doubleClick(selector) {
        return this.wrapPromise(()=> this.find(selector).then((wdioSelector)=> this.webdriver.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.wrapPromise(()=> this.find(selector).then((wdioSelector)=>this.webdriver.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.wrapPromise(()=> this.find(selector).then((wdioSelector)=>this.webdriver.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.wrapPromise(()=> this.find(selector).then((wdioSelector)=>this.webdriver.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.wrapPromise(()=> this.webdriver.buttonDown(0));
    }

    mouseUp() {
        return this.wrapPromise(()=> this.webdriver.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.wrapPromise(()=> {
            return Promise.all([
                    this.find(sourceSelector),
                    this.find(targetSelector)
                ])
                .then(result => this.webdriver.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.wrapPromise(()=> this.webdriver.pause(delay));
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
        return this.wrapPromise(()=> this.webdriver.execute(func, args));
    }

    //
    // Glance selector
    //
    glanceElement(selector, resolvedLabels, multiple) {
        var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels)
        var logLevel = this.logLevel;

        return this.webdriver
            .execute(loadGlanceSelector)
            .then(() => {
                return this.webdriver.execute(GlanceSelector, selector, mergedLabels, multiple, logLevel)
                    .then(res => {
                        var val = [].concat(res.value);

                        var ids = val.map(function (e) {
                            return shortid.generate();
                        });

                        return {val, ids}
                    })
                    .then(({val, ids}) => {
                        return this.webdriver.execute(tagElementWithID, val, ids)
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

    find(selector) {
        return this.getCustomLabeledElements(selector).then((labels)=> {
            return this.glanceElement(selector, labels).then((cssIds)=> {


                return this.webdriver.element(cssIds)
                        .then(res => {
                            return this.webdriver.execute(waitForChange, res.value, "data-glance-wait-for-change")
                        })
                        .then((res)=> {
                            if (res.value == null) {
                                return Promise.resolve(cssIds);
                            }
                            else {
                                return Promise.reject("Waiting for element to change: " + selector)
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