import wdio from 'webdriverio';
import log from "loglevel";

import glanceFunc from './client';
import GetStrategies from './get-strategies'
import SetStrategies from './set-strategies'

var customLabels = [];
var customGets = [];
var customSets = [];

import _ from 'lodash';

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

function retryingPromise(func, retryCount) {
    return func().catch((reason)=> {
        if (retryCount <= 3) {
            let delayAmount = retryCount * 500;
            log.debug("Retrying with delay:", delayAmount)
            return delay(delayAmount).then(()=> retryingPromise(func, ++retryCount))
        }
        else {
            log.debug("Retries failed:", reason)
            throw new Error(reason);
        }
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

    setLogLevel(level) {
        log.setLevel(level);
        return this;
    }

    wrapPromise(func) {
        let nextFunc = ()=> {
            return new Promise((resolve, reject) => {
                retryingPromise(func, 1).then(resolve, reject)
            })
        };

        this.promise = this.promise.then(nextFunc);
        return this;
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
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> {
            log.info("Clicking: " + selector);
            return this.webdriverio.click(wdioSelector)
        }));
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

    dragAndDrop(sourceSelector, targetSelector) {
        return this.wrapPromise(()=> {
            return Promise.all([
                    this.convertGlanceSelector(sourceSelector),
                    this.convertGlanceSelector(targetSelector)
                ])
                .then((result)=> {
                    return this.webdriverio.dragAndDrop(result[0], result[1]);
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
        return this.wrapPromise(()=> this.convertGlanceSelector(selector).then((wdioSelector)=> this.webdriverio.selectorExecute(wdioSelector, function(elements) {
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
            customLabels[label] = func
            return Promise.resolve();
        })
    }

    //
    // Getters and Setters
    //
    get(selector) {
        var g = new Glance(this);
        return this.wrapPromise(()=> {
            return GetStrategies.reduce((s1, s2) => s1.catch((reason)=> s2(g, selector, customGets)), Promise.reject())
        });
    }

    set(selector, value) {
        var g = new Glance(this);
        return this.wrapPromise(()=> {
            return SetStrategies.reduce((s1, s2) => s1.catch(()=> s2(g, selector, value, customSets)), Promise.reject())
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
        return this.webdriverio.execute(glanceFunc, selector, customLabels, multiple).then(function(res) {
            var val = res.value;

            //return client.log("browser").then(function(logs){
            //	console.log(logs.value.map(function(l){ return l.message}).join("\n"))

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
            //});
        });
    }

    getCustomLabeledElements(reference) {
        return new Promise((resolve, reject)=> {
            var labels = reference.split(">");

            var foundLabels = _.filter(labels, function(label) {
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

        return this.webdriverio.execute(function(s) {
            var result = [];

            var elements = s;

            if (!s.length)
                elements = [s];

            for (var a = 0; a < elements.length; ++a) {
                var element = elements[a];
                result.push("//*[@data-glance-id='" + element.getAttribute('data-glance-id') + "']")
            }

            return result.join("|");
        }, element).then(function(res) {
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
                    .catch(function() {
                        reject("Element not found: " + reference)
                    });
            });
        })
    }

    convertGlanceSelectors(reference) {
        return new Promise((resolve, reject)=> {
            return this.getCustomLabeledElements(reference).then((labels)=> {
                return this.glanceElement(reference, labels, true).then((ids)=> {
                        var result = ids.map(function(id) {
                            return "//*[@data-glance-id='" + id + "']"
                        }).join("|");
                        resolve(result);
                    })
                    .catch(function() {
                        reject("Element not found: " + reference)
                    });
            });
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = onFulfilled || Promise.resolve;
        onRejected = onRejected || Promise.reject;
        this.promise = this.promise.then((value)=> {
                return Promise.resolve(onFulfilled.call(new Glance(this), value));
            },
            (reason)=> {
                return Promise.reject(onRejected.call(new Glance(this), reason));
            }
        );

        return this;
    }

    catch(onRejected) {
        onRejected = onRejected || Promise.reject;

        this.promise = this.promise.catch((reason)=> {
            return Promise.resolve(onRejected.call(new Glance(this), reason));
        })

        return this;
    }
}

export default Glance