'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webdriverio = require('webdriverio');

var _webdriverio2 = _interopRequireDefault(_webdriverio);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _getStrategies = require('./get-strategies');

var _getStrategies2 = _interopRequireDefault(_getStrategies);

var _setStrategies = require('./set-strategies');

var _setStrategies2 = _interopRequireDefault(_setStrategies);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var customLabels = [];
var customGets = [];
var customSets = [];

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
}

function retryingPromise(func, retryCount) {
    return func().catch(function (reason) {
        if (retryCount <= 3) {
            var delayAmount = retryCount * 500;
            _loglevel2.default.debug("Retrying with delay:", delayAmount);
            return delay(delayAmount).then(function () {
                return retryingPromise(func, ++retryCount);
            });
        } else {
            _loglevel2.default.debug("Retries failed:", reason);
            throw new Error(reason);
        }
    });
}

var Glance = function () {
    function Glance(config) {
        var _this = this;

        _classCallCheck(this, Glance);

        this.promise = new Promise(function (resolve, reject) {
            if (config.logLevel) {
                _this.setLogLevel(config.logLevel);
            }

            if (config.webdriverio) {
                _this.webdriverio = config.webdriverio;
                resolve();
            } else if (config.options) {
                _this.webdriverio = config;
                resolve();
            } else {
                _this.webdriverio = _webdriverio2.default.remote(config).init(resolve);
            }
        });
    }

    _createClass(Glance, [{
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            _loglevel2.default.setLevel(level);
            return this;
        }
    }, {
        key: 'wrapPromise',
        value: function wrapPromise(func) {
            var nextFunc = function nextFunc() {
                return new Promise(function (resolve, reject) {
                    retryingPromise(func, 1).then(resolve, reject);
                });
            };

            this.promise = this.promise.then(nextFunc);
            return this;
        }
    }, {
        key: 'url',
        value: function url(address) {
            var _this2 = this;

            return this.wrapPromise(function () {
                return _this2.webdriverio.url(address);
            });
        }

        //
        // Interactions
        //

    }, {
        key: 'type',
        value: function type(text) {
            var _this3 = this;

            return this.wrapPromise(function () {
                return _this3.webdriverio.keys(text);
            });
        }
    }, {
        key: 'click',
        value: function click(selector) {
            var _this4 = this;

            return this.wrapPromise(function () {
                return _this4.convertGlanceSelector(selector).then(function (wdioSelector) {
                    _loglevel2.default.info("Clicking: " + selector);
                    return _this4.webdriverio.click(wdioSelector);
                });
            });
        }
    }, {
        key: 'doubleClick',
        value: function doubleClick(selector) {
            var _this5 = this;

            return this.wrapPromise(function () {
                return _this5.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this5.webdriverio.doubleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'middleClick',
        value: function middleClick(selector) {
            var _this6 = this;

            return this.wrapPromise(function () {
                return _this6.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this6.webdriverio.middleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'rightClick',
        value: function rightClick(selector) {
            var _this7 = this;

            return this.wrapPromise(function () {
                return _this7.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this7.webdriverio.rightClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'moveMouseTo',
        value: function moveMouseTo(selector, xOffset, yOffset) {
            var _this8 = this;

            return this.wrapPromise(function () {
                return _this8.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this8.webdriverio.moveToObject(wdioSelector, xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown() {
            var _this9 = this;

            return this.wrapPromise(function () {
                return _this9.webdriverio.buttonDown(0);
            });
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp() {
            var _this10 = this;

            return this.wrapPromise(function () {
                return _this10.webdriverio.buttonUp(0);
            });
        }
    }, {
        key: 'dragAndDrop',
        value: function dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
            var _this11 = this;

            return this.wrapPromise(function () {
                return Promise.all([_this11.convertGlanceSelector(sourceSelector), _this11.convertGlanceSelector(targetSelector)]).then(function (result) {

                    if (_this11.webdriverio.isMobile) {
                        return _this11.webdriverio.getLocation(sourceElem).then(function (location) {
                            return _this11.webdriverio.touchDown(location.x, location.y);
                        }).getLocation(destinationElem).then(function (location) {
                            return _this11.webdriverio.touchMove(location.x, location.y).touchUp(location.x, location.y);
                        });
                    }

                    return _this11.webdriverio.moveToObject(result[0]).buttonDown().moveToObject(result[1], xOffset, yOffset).buttonUp();
                });
            });
        }
    }, {
        key: 'pause',
        value: function pause(delay) {
            var _this12 = this;

            return this.wrapPromise(function () {
                return _this12.webdriverio.pause(delay);
            });
        }

        //
        // Wait for change
        //

    }, {
        key: 'watchForChange',
        value: function watchForChange(selector) {
            var _this13 = this;

            return this.wrapPromise(function () {
                return _this13.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this13.webdriverio.selectorExecute(wdioSelector, function (elements) {
                        elements[0].setAttribute("data-glance-wait-for-change", "true");
                    });
                });
            });
        }
    }, {
        key: 'waitForChange',
        value: function waitForChange(selector) {
            var _this14 = this;

            return this.wrapPromise(function () {
                return _this14.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this14.webdriverio.getAttribute(wdioSelector, "data-glance-wait-for-change").then(function (res) {
                        if (res == null) return Promise.resolve();else return Promise.reject("Waiting for element to change: " + reference);
                    }, function () {
                        return Promise.resolve();
                    });
                });
            });
        }

        //
        // Labels
        //

    }, {
        key: 'addLabel',
        value: function addLabel(label, func) {
            return this.wrapPromise(function () {
                customLabels[label] = func;
                return Promise.resolve();
            });
        }

        //
        // Getters and Setters
        //

    }, {
        key: 'get',
        value: function get(selector) {
            var g = new Glance(this);
            return this.wrapPromise(function () {
                return _getStrategies2.default.reduce(function (s1, s2) {
                    return s1.catch(function (reason) {
                        return s2(g, selector, customGets);
                    });
                }, Promise.reject());
            });
        }
    }, {
        key: 'set',
        value: function set(selector, value) {
            var g = new Glance(this);
            return this.wrapPromise(function () {
                return _setStrategies2.default.reduce(function (s1, s2) {
                    return s1.catch(function () {
                        return s2(g, selector, value, customSets);
                    });
                }, Promise.reject());
            });
        }
    }, {
        key: 'addGetter',
        value: function addGetter(label, lookup) {
            return this.wrapPromise(function () {
                customGets[label] = lookup;
                return Promise.resolve();
            });
        }
    }, {
        key: 'addSetter',
        value: function addSetter(label, lookup) {
            return this.wrapPromise(function () {
                customSets[label] = lookup;
                return Promise.resolve();
            });
        }

        //
        // Script excecution
        //

    }, {
        key: 'execute',
        value: function execute(func) {
            var _this15 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return this.wrapPromise(function () {
                return _this15.webdriverio.execute(func, args);
            });
        }

        //
        // Glance selector
        //

    }, {
        key: 'glanceElement',
        value: function glanceElement(selector, customLabels, multiple) {
            return this.webdriverio.execute(_client2.default, selector, customLabels, multiple).then(function (res) {
                var val = res.value;

                //return client.log("browser").then(function(logs){
                //	console.log(logs.value.map(function(l){ return l.message}).join("\n"))

                if (val.notFound) {
                    throw new Error("Element not found: " + selector);
                }

                if (multiple) {
                    return val.ids;
                } else {
                    if (val.ids.length > 1) {
                        throw new Error("Found " + val.ids.length + " duplicates for: " + selector);
                    } else {
                        return val.ids[0];
                    }
                }
                //});
            });
        }
    }, {
        key: 'getCustomLabeledElements',
        value: function getCustomLabeledElements(reference) {
            var _this16 = this;

            return new Promise(function (resolve, reject) {
                var labels = reference.split(">");

                var foundLabels = _lodash2.default.filter(labels, function (label) {
                    return customLabels[label];
                });

                var labelLookup = {};
                if (foundLabels.length > 0) {
                    var g = new Glance(_this16);
                    return customLabels[foundLabels[0]].apply(g).then(function (element) {
                        return g.getCustomElementIDs(element).then(function (xpath) {
                            labelLookup[foundLabels[0]] = xpath;
                            return resolve(labelLookup);
                        });
                    });
                }

                return resolve(labelLookup);
            });
        }
    }, {
        key: 'getCustomElementIDs',
        value: function getCustomElementIDs(e) {
            var element = e.value || e;

            return this.webdriverio.execute(function (s) {
                var result = [];

                var elements = s;

                if (!s.length) elements = [s];

                for (var a = 0; a < elements.length; ++a) {
                    var element = elements[a];
                    result.push("//*[@data-glance-id='" + element.getAttribute('data-glance-id') + "']");
                }

                return result.join("|");
            }, element).then(function (res) {
                return res.value;
            });
        }
    }, {
        key: 'convertGlanceSelector',
        value: function convertGlanceSelector(reference) {
            var _this17 = this;

            return new Promise(function (resolve, reject) {
                return _this17.getCustomLabeledElements(reference).then(function (labels) {
                    return _this17.glanceElement(reference, labels).then(function (id) {
                        var idSelector = "[data-glance-id='" + id + "']";
                        _this17.webdriverio.getAttribute(idSelector, "data-glance-wait-for-change").then(function (res) {
                            if (res == null) resolve(idSelector);else reject("Waiting for element to change: " + reference);
                        }, function () {
                            return resolve(idSelector);
                        });
                    }).catch(function () {
                        reject("Element not found: " + reference);
                    });
                });
            });
        }
    }, {
        key: 'convertGlanceSelectors',
        value: function convertGlanceSelectors(reference) {
            var _this18 = this;

            return new Promise(function (resolve, reject) {
                return _this18.getCustomLabeledElements(reference).then(function (labels) {
                    return _this18.glanceElement(reference, labels, true).then(function (ids) {
                        var result = ids.map(function (id) {
                            return "//*[@data-glance-id='" + id + "']";
                        }).join("|");
                        resolve(result);
                    }).catch(function () {
                        reject("Element not found: " + reference);
                    });
                });
            });
        }
    }, {
        key: 'then',
        value: function then(onFulfilled, onRejected) {
            var _this19 = this;

            onFulfilled = onFulfilled || Promise.resolve;
            onRejected = onRejected || Promise.reject;
            this.promise = this.promise.then(function (value) {
                return Promise.resolve(onFulfilled.call(new Glance(_this19), value));
            }, function (reason) {
                return Promise.reject(onRejected.call(new Glance(_this19), reason));
            });

            return this;
        }
    }, {
        key: 'catch',
        value: function _catch(onRejected) {
            var _this20 = this;

            onRejected = onRejected || Promise.reject;

            this.promise = this.promise.catch(function (reason) {
                return Promise.resolve(onRejected.call(new Glance(_this20), reason));
            });

            return this;
        }
    }]);

    return Glance;
}();

exports.default = Glance;