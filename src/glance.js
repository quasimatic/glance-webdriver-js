import * as wdio from 'webdriverio';
import shortid from 'shortid';
import log from "loglevel";

import loadGlanceSelector from './glance-selector';
import glanceFunc from './client';
import GetStrategies from './get-strategies';
import SetStrategies from './set-strategies';
import {Parser} from '@quasimatic/glance-selector'
import './promise-array';

import Cast from "./cast";

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

var customGets = [];
var customSets = [];

class Glance {
    constructor(config) {
        this.promise = new Promise((resolve, reject)=> {
            if (config.logLevel) {
                this.setLogLevel(config.logLevel);
            }

            if (config.webdriverio) {
                this.customLabels = config.customLabels;
                this.webdriverio = config.webdriverio;
                resolve();
            }
            else if (config.options) {
                this.customLabels = {};
                this.webdriverio = config;
                resolve();
            }
            else {
                this.customLabels = {};
                this.webdriverio = wdio.remote(config);
                this.webdriverio.init().then(resolve);
            }
        });
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
        return this._waitForThen(function () {
            return this._retryingPromise(func, 1)
        });
    }

    url(address) {
        return this.wrapPromise(()=> this.webdriverio.url(address))
    }

    end() {
        return this.wrapPromise(()=> this.webdriverio.end())
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
        return this.wrapPromise(()=> this.webdriverio.keys(text));
    }

    click(selector) {
        return this.wrapPromise(() => this.convertGlanceSelector(selector).then((wdioSelector) => this.webdriverio.click(wdioSelector)));
    }

    doubleClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> this.webdriverio.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.webdriverio.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.webdriverio.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=>this.webdriverio.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.wrapPromise(()=> this.webdriverio.buttonDown(0));
    }

    mouseUp() {
        return this.wrapPromise(()=> this.webdriverio.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.wrapPromise(()=> {
            return Promise.all([
                    this.convertGlanceSelector(sourceSelector),
                    this.convertGlanceSelector(targetSelector)
                ])
                .then((result)=> {
                    if (this.webdriverio.isMobile) {
                        return this.webdriverio.getLocation(sourceElem).then(
                            (location) => this.webdriverio.touchDown(location.x, location.y)
                        ).getLocation(destinationElem).then(
                            (location) => this.webdriverio.touchMove(location.x, location.y).touchUp(location.x, location.y)
                        )
                    }

                    return this.webdriverio.moveToObject(result[0]).buttonDown().moveToObject(result[1], xOffset, yOffset).buttonUp()
                });
        });
    }

    pause(delay) {
        return this.wrapPromise(()=> this.webdriverio.pause(delay));
    }

    //
    // Wait for change
    //
    watchForChange(selector) {
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> this.webdriverio.selectorExecute(wdioSelector, function (elements) {
            elements[0].setAttribute("data-glance-wait-for-change", "true")
        })));
    }

    waitForChange(selector) {
        return this.wrapPromise(()=> {
            return this.convertGlanceSelector(selector).then((wdioSelector)=> {
                return this.webdriverio.getAttribute(wdioSelector, "data-glance-wait-for-change").then((res)=> {
                    if (res == null)
                        return Promise.resolve();
                    else
                        return Promise.reject("Waiting for element to change: " + reference)
                }, () => Promise.resolve())

            })
        });
    }

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
        return this.wrapPromise(()=> this.webdriverio.execute(func, args));
    }

    //
    // Glance selector
    //
    glanceElement(selector, resolvedLabels, multiple) {
        var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels)
        var logLevel = this.logLevel;

        return this.webdriverio
            .execute(loadGlanceSelector)
            .then(function () {
                return this.execute(glanceFunc, selector, mergedLabels, multiple, logLevel)
                    .then(function (res) {
                        var val = [].concat(res.value);

                        var ids = val.map(function (e) {
                            return shortid.generate();
                        });
                        return this.execute(function (elements, ids) {
                            for (var i = 0; i < elements.length; ++i) {
                                elements[i].setAttribute("data-glance-id", ids[i]);
                            }
                        }, val, ids).then(function () {
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

        // },
        // function(){
        //     console.log("CAUGHT")
        // });
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
                    return this.webdriverio.getAttribute(cssIds, "data-glance-wait-for-change").then((res)=> {
                        if (res == null) {
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
        return this._waitForThen(function (value) {
                g.promise = Promise.resolve();
                return Promise.resolve(onFulfilled(value));
            },
            function (reason) {
                g.promise = Promise.resolve();
                return Promise.resolve(onRejected(reason));
            }
        );
    }

    catch(onRejected) {
        onRejected = onRejected || function (reason) {
                return Promise.reject(reason)
            };

        var g = this;
        return this._waitForCatch(function (reason) {
            g.promise = Promise.resolve();
            return Promise.resolve(onRejected(reason));
        });
    }

    _waitForThen(resolve, reject) {
        reject = reject || function (reason) {
                return Promise.reject(reason)
            };

        this.promise = this.promise.then((value)=> resolve.call(new Glance(this), value), (reason)=>reject.call(new Glance(this), reason));

        return this;
    }

    _waitForCatch(reject) {
        this.promise = this.promise.catch((reason)=> reject.call(new Glance(this), reason));
        return this;
    }

    _retryingPromise(func, retryCount) {
        return func().catch((reason) => {
            if (retryCount <= 3) {
                let delayAmount = retryCount * 500;
                log.debug("Retrying with delay:", delayAmount)
                return delay(delayAmount).then(() => this._retryingPromise(func, ++retryCount))
            }
            else {
                log.debug("Retries failed:", reason)
                throw new Error(reason);
            }
        });
    }
}

export {Cast}

export default Glance