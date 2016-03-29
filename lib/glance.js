'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webdriverio = require('webdriverio');

var wdio = _interopRequireWildcard(_webdriverio);

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

var _glanceSelector3 = require('@quasimatic/glance-selector');

require('./promise-array');

var _cast = require('./cast');

var _cast2 = _interopRequireDefault(_cast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
}

var customGets = [];
var customSets = [];

var Glance = function () {
    function Glance(config) {
        var _this = this;

        _classCallCheck(this, Glance);

        this.promise = new Promise(function (resolve, reject) {
            if (config.logLevel) {
                _this.setLogLevel(config.logLevel);
            }

            if (config.webdriverio) {
                _this.customLabels = config.customLabels;
                _this.webdriverio = config.webdriverio;
                resolve();
            } else if (config.options) {
                _this.customLabels = {};
                _this.webdriverio = config;
                resolve();
            } else {
                _this.customLabels = {};
                _this.webdriverio = wdio.remote(config);
                _this.webdriverio.init().then(resolve);
            }
        });
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
            return this._waitForThen(function () {
                return this._retryingPromise(func, 1);
            });
        }
    }, {
        key: 'url',
        value: function url(address) {
            var _this2 = this;

            return this.wrapPromise(function () {
                return _this2.webdriverio.url(address);
            });
        }
    }, {
        key: 'end',
        value: function end() {
            var _this3 = this;

            return this.wrapPromise(function () {
                return _this3.webdriverio.end();
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
                return _this5.webdriverio.keys(text);
            });
        }
    }, {
        key: 'click',
        value: function click(selector) {
            var _this6 = this;

            return this.wrapPromise(function () {
                return _this6.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this6.webdriverio.click(wdioSelector);
                });
            });
        }
    }, {
        key: 'doubleClick',
        value: function doubleClick(selector) {
            var _this7 = this;

            return this.wrapPromise(function () {
                return _this7.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this7.webdriverio.doubleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'middleClick',
        value: function middleClick(selector) {
            var _this8 = this;

            return this.wrapPromise(function () {
                return _this8.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this8.webdriverio.middleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'rightClick',
        value: function rightClick(selector) {
            var _this9 = this;

            return this.wrapPromise(function () {
                return _this9.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this9.webdriverio.rightClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'moveMouseTo',
        value: function moveMouseTo(selector, xOffset, yOffset) {
            var _this10 = this;

            return this.wrapPromise(function () {
                return _this10.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this10.webdriverio.moveToObject(wdioSelector, xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown() {
            var _this11 = this;

            return this.wrapPromise(function () {
                return _this11.webdriverio.buttonDown(0);
            });
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp() {
            var _this12 = this;

            return this.wrapPromise(function () {
                return _this12.webdriverio.buttonUp(0);
            });
        }
    }, {
        key: 'dragAndDrop',
        value: function dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
            var _this13 = this;

            return this.wrapPromise(function () {
                return Promise.all([_this13.convertGlanceSelector(sourceSelector), _this13.convertGlanceSelector(targetSelector)]).then(function (result) {
                    if (_this13.webdriverio.isMobile) {
                        return _this13.webdriverio.getLocation(sourceElem).then(function (location) {
                            return _this13.webdriverio.touchDown(location.x, location.y);
                        }).getLocation(destinationElem).then(function (location) {
                            return _this13.webdriverio.touchMove(location.x, location.y).touchUp(location.x, location.y);
                        });
                    }

                    return _this13.webdriverio.moveToObject(result[0]).buttonDown().moveToObject(result[1], xOffset, yOffset).buttonUp();
                });
            });
        }
    }, {
        key: 'pause',
        value: function pause(delay) {
            var _this14 = this;

            return this.wrapPromise(function () {
                return _this14.webdriverio.pause(delay);
            });
        }

        //
        // Wait for change
        //

    }, {
        key: 'watchForChange',
        value: function watchForChange(selector) {
            var _this15 = this;

            return this.wrapPromise(function () {
                return _this15.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this15.webdriverio.selectorExecute(wdioSelector, function (elements) {
                        elements[0].setAttribute("data-glance-wait-for-change", "true");
                    });
                });
            });
        }
    }, {
        key: 'waitForChange',
        value: function waitForChange(selector) {
            var _this16 = this;

            return this.wrapPromise(function () {
                return _this16.convertGlanceSelector(selector).then(function (wdioSelector) {
                    return _this16.webdriverio.getAttribute(wdioSelector, "data-glance-wait-for-change").then(function (res) {
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
            var _this17 = this;

            return this.wrapPromise(function () {
                _this17.customLabels[label] = func;
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
            var _this18 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return this.wrapPromise(function () {
                return _this18.webdriverio.execute(func, args);
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

            return this.webdriverio.execute(_glanceSelector2.default).then(function () {
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

            // },
            // function(){
            //     console.log("CAUGHT")
            // });
        }
    }, {
        key: 'getCustomLabeledElements',
        value: function getCustomLabeledElements(reference) {
            var _this19 = this;

            return new Promise(function (resolve, reject) {

                var data = _this19.parse(reference);
                var labels = data.map(function (r) {
                    return r.label;
                });

                var foundLabels = labels.filter(function (label) {
                    return _this19.customLabels[label] && typeof _this19.customLabels[label] == 'function';
                });

                var resolvedCustomLabels = {};
                foundLabels.resolveSeries(function (key) {
                    var g = new Glance(_this19);

                    return Promise.resolve(_this19.customLabels[key](g, key)).then(function (element) {
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
            var _this20 = this;

            return this.getCustomLabeledElements(reference).then(function (labels) {
                return _this20.glanceElement(reference, labels).then(function (cssIds) {
                    return _this20.webdriverio.getAttribute(cssIds, "data-glance-wait-for-change").then(function (res) {
                        if (res == null) {
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
            var _this21 = this;

            return new Promise(function (resolve, reject) {
                return _this21.getCustomLabeledElements(reference).then(function (labels) {
                    return _this21.glanceElement(reference, labels, true).then(function (cssIds) {
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
            return this._waitForThen(function (value) {
                g.promise = Promise.resolve();
                return Promise.resolve(onFulfilled(value));
            }, function (reason) {
                g.promise = Promise.resolve();
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
            return this._waitForCatch(function (reason) {
                g.promise = Promise.resolve();
                return Promise.resolve(onRejected(reason));
            });
        }
    }, {
        key: '_waitForThen',
        value: function _waitForThen(resolve, reject) {
            var _this22 = this;

            reject = reject || function (reason) {
                return Promise.reject(reason);
            };

            this.promise = this.promise.then(function (value) {
                return resolve.call(new Glance(_this22), value);
            }, function (reason) {
                return reject.call(new Glance(_this22), reason);
            });

            return this;
        }
    }, {
        key: '_waitForCatch',
        value: function _waitForCatch(reject) {
            var _this23 = this;

            this.promise = this.promise.catch(function (reason) {
                return reject.call(new Glance(_this23), reason);
            });
            return this;
        }
    }, {
        key: '_retryingPromise',
        value: function _retryingPromise(func, retryCount) {
            var _this24 = this;

            return func().catch(function (reason) {
                if (retryCount <= 3) {
                    var delayAmount = retryCount * 500;
                    _loglevel2.default.debug("Retrying with delay:", delayAmount);
                    return delay(delayAmount).then(function () {
                        return _this24._retryingPromise(func, ++retryCount);
                    });
                } else {
                    _loglevel2.default.debug("Retries failed:", reason);
                    throw new Error(reason);
                }
            });
        }
    }]);

    return Glance;
}();

exports.Cast = _cast2.default;
exports.default = Glance;