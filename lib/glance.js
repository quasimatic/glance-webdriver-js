'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glanceSelector = require('./glance-selector');

var _glanceSelector2 = _interopRequireDefault(_glanceSelector);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _getStrategies = require('./get-strategies');

var _getStrategies2 = _interopRequireDefault(_getStrategies);

var _setStrategies = require('./set-strategies');

var _setStrategies2 = _interopRequireDefault(_setStrategies);

var _webdriverioDriver = require('./drivers/webdriverio-driver');

var _webdriverioDriver2 = _interopRequireDefault(_webdriverioDriver);

var _glanceSelector3 = require('@quasimatic/glance-selector');

var _promiseUtils = require('./promise-utils');

var _promiseUtils2 = _interopRequireDefault(_promiseUtils);

var _cast = require('./cast');

var _cast2 = _interopRequireDefault(_cast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var customGets = [];
var customSets = [];

var Glance = function () {
    function Glance(config) {
        var _this = this;

        _classCallCheck(this, Glance);

        this.promiseUtils = new _promiseUtils2.default(new Promise(function (resolve, reject) {
            if (config.logLevel) {
                _this.setLogLevel(config.logLevel);
            }

            if (config.browser) {
                _this.customLabels = config.customLabels || {};
                _this.browser = config.browser;
                resolve();
            } else if (config.driverConfig) {
                _this.customLabels = {};
                _this.browser = new _webdriverioDriver2.default(config.driverConfig);
                _this.browser.init().then(resolve);
            } else {
                console.log("A driver or driverConfig must be provided.");
                reject();
            }
        }), config);
    }

    _createClass(Glance, [{
        key: 'parse',
        value: function parse(reference) {
            return _glanceSelector3.Parser.parse(reference);
        }
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            _loglevel2.default.setLevel(level);
            this.logLevel = level;
            return this;
        }
    }, {
        key: 'wrapPromise',
        value: function wrapPromise(func) {
            return this.promiseUtils.waitForThen(this, function () {
                return this.promiseUtils.retryingPromise(func);
            });
        }
    }, {
        key: 'url',
        value: function url(address) {
            var _this2 = this;

            return this.wrapPromise(function () {
                return _this2.browser.url(address);
            });
        }
    }, {
        key: 'end',
        value: function end() {
            var _this3 = this;

            return this.wrapPromise(function () {
                return _this3.browser.end();
            });
        }

        //
        // Cast
        //

    }, {
        key: 'cast',
        value: function cast(state) {
            var _this4 = this;

            return this.wrapPromise(function () {
                return new _cast2.default(new Glance(_this4)).apply(state);
            });
        }

        //
        // Interactions
        //

    }, {
        key: 'type',
        value: function type(text) {
            var _this5 = this;

            return this.wrapPromise(function () {
                return _this5.browser.keys(text);
            });
        }
    }, {
        key: 'click',
        value: function click(selector) {
            var _this6 = this;

            return this.wrapPromise(function () {
                return _this6.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this6.browser.click(wdioSelector);
                });
            });
        }
    }, {
        key: 'doubleClick',
        value: function doubleClick(selector) {
            var _this7 = this;

            return this.wrapPromise(function () {
                return _this7.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this7.browser.doubleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'middleClick',
        value: function middleClick(selector) {
            var _this8 = this;

            return this.wrapPromise(function () {
                return _this8.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this8.browser.middleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'rightClick',
        value: function rightClick(selector) {
            var _this9 = this;

            return this.wrapPromise(function () {
                return _this9.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this9.browser.rightClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'moveMouseTo',
        value: function moveMouseTo(selector, xOffset, yOffset) {
            var _this10 = this;

            return this.wrapPromise(function () {
                return _this10.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this10.browser.moveToObject(wdioSelector, xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown() {
            var _this11 = this;

            return this.wrapPromise(function () {
                return _this11.browser.buttonDown(0);
            });
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp() {
            var _this12 = this;

            return this.wrapPromise(function () {
                return _this12.browser.buttonUp(0);
            });
        }
    }, {
        key: 'dragAndDrop',
        value: function dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
            var _this13 = this;

            return this.wrapPromise(function () {
                return Promise.all([_this13.convertGlanceSelector(sourceSelector), _this13.convertGlanceSelector(targetSelector)]).then(function (result) {
                    return _this13.browser.dragAndDrop(result[0], result[1], xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'pause',
        value: function pause(delay) {
            var _this14 = this;

            return this.wrapPromise(function () {
                return _this14.browser.pause(delay);
            });
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

    }, {
        key: 'addLabel',
        value: function addLabel(label, func) {
            var _this15 = this;

            return this.wrapPromise(function () {
                _this15.customLabels[label] = func;
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
                return _getStrategies2.default.firstResolved(function (getStrategy) {
                    return getStrategy(g, selector, customGets);
                });
            });
        }
    }, {
        key: 'set',
        value: function set(selector, value) {
            var g = new Glance(this);
            return this.wrapPromise(function () {
                return _setStrategies2.default.firstResolved(function (setStrategy) {
                    return setStrategy(g, selector, value, customSets);
                });
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
            var _this16 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return this.wrapPromise(function () {
                return _this16.browser.execute(func, args);
            });
        }

        //
        // Glance selector
        //

    }, {
        key: 'glanceElement',
        value: function glanceElement(selector, resolvedLabels, multiple) {
            var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels);
            var logLevel = this.logLevel;

            return this.browser.execute(_glanceSelector2.default).then(function () {
                return this.execute(_client2.default, selector, mergedLabels, multiple, logLevel).then(function (res) {
                    var val = [].concat(res.value);

                    var ids = val.map(function (e) {
                        return _shortid2.default.generate();
                    });
                    return this.execute(function (elements, ids) {
                        for (var i = 0; i < elements.length; ++i) {
                            elements[i].setAttribute("data-glance-id", ids[i]);
                        }
                    }, val, ids).then(function () {
                        var idsAsCss = ids.map(function (id) {
                            return '[data-glance-id="' + id + '"]';
                        });

                        return this.log("browser").then(function (logs) {
                            _loglevel2.default.debug("CLIENT:", logs.value.map(function (l) {
                                return l.message;
                            }).join("\n").replace(/ \(undefined:undefined\)/g, ''));

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
                                throw new Error("Found " + idsAsCss.length + " duplicates for: " + selector);
                            }
                        });
                    });
                });
            });
        }
    }, {
        key: 'getCustomLabeledElements',
        value: function getCustomLabeledElements(reference) {
            var _this17 = this;

            return new Promise(function (resolve, reject) {

                var data = _this17.parse(reference);
                var labels = data.map(function (r) {
                    return r.label;
                });

                var foundLabels = labels.filter(function (label) {
                    return _this17.customLabels[label] && typeof _this17.customLabels[label] == 'function';
                });

                var resolvedCustomLabels = {};
                foundLabels.resolveSeries(function (key) {
                    var g = new Glance(_this17);

                    return Promise.resolve(_this17.customLabels[key](g, key)).then(function (element) {
                        resolvedCustomLabels[key] = element.value;
                    });
                }).then(function () {
                    resolve(resolvedCustomLabels);
                });
            });
        }
    }, {
        key: 'convertGlanceSelector',
        value: function convertGlanceSelector(reference) {
            var _this18 = this;

            return this.getCustomLabeledElements(reference).then(function (labels) {
                return _this18.glanceElement(reference, labels).then(function (cssIds) {
                    return _this18.browser.element(cssIds).then(function (res) {
                        return _this18.browser.execute(function (element, name) {
                            return element.getAttribute(name);
                        }, res.value, "data-glance-wait-for-change");
                    }).then(function (res) {
                        if (res.value == null) {
                            return Promise.resolve(cssIds);
                        } else {
                            return Promise.reject("Waiting for element to change: " + reference);
                        }
                    }, function () {
                        return Promise.resolve(cssIds);
                    });
                }).catch(function (reason) {
                    return Promise.reject(reason.message);
                });
            });
        }
    }, {
        key: 'convertGlanceSelectors',
        value: function convertGlanceSelectors(reference) {
            var _this19 = this;

            return new Promise(function (resolve, reject) {
                return _this19.getCustomLabeledElements(reference).then(function (labels) {
                    return _this19.glanceElement(reference, labels, true).then(function (cssIds) {
                        resolve(cssIds);
                    }).catch(function (reason) {
                        reject(reason.message);
                    });
                });
            });
        }
    }, {
        key: 'then',
        value: function then(onFulfilled, onRejected) {
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
            }, function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
        }
    }, {
        key: 'catch',
        value: function _catch(onRejected) {
            onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

            var g = this;
            return this.promiseUtils.waitForCatch(g, function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
        }
    }]);

    return Glance;
}();

exports.Cast = _cast2.default;
exports.default = Glance;