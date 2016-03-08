import wdio from 'webdriverio';
import log from "loglevel";

import glanceFunc from './client';
import GetStrategies from './get-strategies'
import SetStrategies from './set-strategies'
import parser from '../lib/glance-parser'
import './promise-array'

var customLabels = [];
var customGets = [];
var customSets = [];

import _ from 'lodash';

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

class Glance {
    constructor(config) {
        this.promise = new Promise((resolve, reject)=> {
            if (config.logLevel) {
                this.setLogLevel(config.logLevel);
            }

            if (config.webdriverio) {
                this.webdriverio = config.webdriverio
                resolve();
            }
            else if (config.options) {
                this.webdriverio = config;
                resolve();
            }
            else {
                this.webdriverio = wdio.remote(config).init(resolve);
            }
        });
    }

    parse(reference) {
        return parser.parse(reference);
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
        return this.wrapPromise(()=> this.webdriverio.url(address));
    }

    //
    // Interactions
    //
    type(text) {
        return this.wrapPromise(()=> this.webdriverio.keys(text));
    }

    click(selector) {
        return this.wrapPromise(() => {
            return this.convertGlanceSelector(selector).then((wdioSelector) => {
                return this.webdriverio.click(wdioSelector)
            })
        });
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
            customLabels[label] = func;
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
    glanceElement(selector, customLabels, multiple) {
        return this.webdriverio.execute(glanceFunc, selector, customLabels, multiple, this.logLevel).then(function (res) {
            var val = res.value;

            return this.log("browser").then( function(logs) {
                log.debug("CLIENT:", logs.value.map(l => l.message).join("\n").replace(/ \(undefined:undefined\)/g, ''))

                if (val.notFound) {
                    throw new Error("Element not found: " + selector);
                }

                if (multiple) {
                    return val.ids;
                }
                else {
                    if (val.ids.length > 1) {
                        throw new Error("Found " + val.ids.length + " duplicates for: " + selector)
                    }
                    else {
                        return val.ids[0]
                    }
                }
            });
        });
    }

    getCustomLabeledElements(reference) {
        return new Promise((resolve, reject)=> {
            var data = this.parse(reference);
            var labels = data.containers.map((r)=> r.label);

            var foundLabels = _.filter(labels, function (label) {
                return customLabels[label];
            });

            var labelLookup = {};
            if (foundLabels.length > 0) {
                var g = new Glance(this);
                return customLabels[foundLabels[0]].apply(g).then((element) => {
                    return g.getCustomElementIDs(element).then((xpath) => {
                        labelLookup[foundLabels[0]] = xpath;
                        return resolve(labelLookup);
                    });
                });
            }

            return resolve(labelLookup);
        });

    }

    getCustomElementIDs(e) {
        var element = e.value || e;

        return this.webdriverio.execute(function (s) {
            var result = [];

            var elements = s;

            if (!s.length)
                elements = [s];

            for (var a = 0; a < elements.length; ++a) {
                var element = elements[a];
                result.push("//*[@data-glance-id='" + element.getAttribute('data-glance-id') + "']")
            }

            return result.join("|");
        }, element).then(function (res) {
            return res.value
        });
    }

    convertGlanceSelector(reference) {
        return new Promise((resolve, reject)=> {
            return this.getCustomLabeledElements(reference).then((labels)=> {
                return this.glanceElement(reference, labels).then((id)=> {
                        var idSelector = "[data-glance-id='" + id + "']";
                        this.webdriverio.getAttribute(idSelector, "data-glance-wait-for-change").then((res)=> {
                            if (res == null)
                                resolve(idSelector)
                            else
                                reject("Waiting for element to change: " + reference)
                        }, ()=> resolve(idSelector));
                    })
                    .catch(function (reason) {
                        reject(reason.message);
                    });
            });
        })
    }

    convertGlanceSelectors(reference) {
        return new Promise((resolve, reject)=> {
            return this.getCustomLabeledElements(reference).then((labels)=> {
                return this.glanceElement(reference, labels, true).then((ids)=> {
                        var result = ids.map(function (id) {
                            return "//*[@data-glance-id='" + id + "']"
                        }).join("|");
                        resolve(result);
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

export default Glance