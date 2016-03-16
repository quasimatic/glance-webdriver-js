"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    })({ 1: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var DiscoverParentContainer = function () {
                function DiscoverParentContainer(searcher) {
                    _classCallCheck(this, DiscoverParentContainer);

                    this.findElement = searcher;
                    this.customLabels = {};
                }

                _createClass(DiscoverParentContainer, [{
                    key: "search",
                    value: function search(targets, context, labelIndex, customLabels) {
                        labelIndex = labelIndex || 0;
                        var target = targets[labelIndex];
                        var i = target.position - 1;

                        var elements = [];

                        var parent = context;

                        while (parent && elements.length == 0) {
                            elements = this.findElement(target.label, parent, customLabels);
                            parent = parent.parentNode;
                        }

                        elements = this._limitToReferences(elements, context);

                        var lastItem = labelIndex + 1 === targets.length;
                        if (lastItem) {
                            if (i >= 0) {
                                if (!elements[i]) return [];

                                return [].concat(elements[i]);
                            }

                            return elements;
                        } else {
                            // IS a container
                            var newTargets = [];

                            if (i >= 0) {
                                var childContainer = elements[i];
                                var foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                                newTargets = newTargets.concat(foundItems);
                            } else {
                                for (var c = 0; c < elements.length; c++) {
                                    var childContainer = elements[c];
                                    var foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                                    newTargets = newTargets.concat(foundItems);
                                }
                            }

                            return this._unique(newTargets);
                        }
                    }
                }, {
                    key: "_limitToReferences",
                    value: function _limitToReferences(elements, container) {
                        var elementContainsContainer = false;
                        var parentsContainingReference = [];
                        for (var e = 0; e < elements.length; ++e) {
                            if (this._isDescendant(elements[e], container)) {
                                elementContainsContainer = true;
                                parentsContainingReference.push(elements[e]);
                            }
                        }

                        if (elementContainsContainer) return parentsContainingReference;

                        return elements;
                    }
                }, {
                    key: "_unique",
                    value: function _unique(array) {
                        return array.filter(function (x, i) {
                            return array.indexOf(x) === i;
                        });
                    }
                }, {
                    key: "_isDescendant",
                    value: function _isDescendant(parent, child) {
                        var node = child.parentNode;
                        while (node != null) {
                            if (node == parent) {
                                return true;
                            }
                            node = node.parentNode;
                        }
                        return false;
                    }
                }]);

                return DiscoverParentContainer;
            }();

            exports.default = DiscoverParentContainer;
        }, {}], 2: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                try {
                    return (0, _css2.default)("." + label, container);
                } catch (e) {
                    return [];
                }
            };

            var _css = require("./css");

            var _css2 = _interopRequireDefault(_css);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./css": 4 }], 3: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                return (0, _xpath2.default)(".//*[not(self::script) and not(self::noscript) and not(self::style) and text()[contains(translate(., 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]]", container);
            };

            var _xpath = require("./xpath");

            var _xpath2 = _interopRequireDefault(_xpath);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./xpath": 12 }], 4: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                try {
                    var results = container.querySelectorAll(label);

                    return Array.prototype.slice.apply(results);
                } catch (e) {
                    return [];
                }
            };
        }, {}], 5: [function (require, module, exports) {
            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container, customLabels) {
                customLabels = customLabels || {};
                var resolver = customLabels[label];

                var elements = resolver;
                if (typeof elements == 'function') {
                    elements = resolver();
                }

                if (!elements) return [];

                elements = [].concat(elements);

                try {
                    var r = [];
                    elements.forEach(function (e) {
                        if (isDescendant(container, e)) {
                            r.push(e);
                        }
                    });

                    return r;
                } catch (e) {
                    return [];
                }
            };

            var isDescendant = function isDescendant(parent, child) {
                var node = child.parentNode;
                while (node != null) {
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            };
        }, {}], 6: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container, customLabels) {
                _logger2.default.debug("Searching by custom label:", label);
                var e = (0, _customLabel2.default)(label, container, customLabels || {});
                if (e.length > 0) {
                    _logger2.default.info("Matched using custom label:", label);
                    return e;
                }

                _logger2.default.debug("Searching for text that contains:", label);
                e = (0, _containsText2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using contains text:", label);
                    return e;
                }

                _logger2.default.debug("Searching by id:", label);
                e = (0, _id2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using ID:", label);
                    return e;
                }

                _logger2.default.debug("Searching for css class:", label);
                e = (0, _className2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using css class:", label);
                    return e;
                }

                _logger2.default.debug("Searching in name:", label);
                e = (0, _name2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using name:", label);
                    return e;
                }

                _logger2.default.debug("Searching in value:", label);
                e = (0, _value2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using value:", label);
                    return e;
                }

                _logger2.default.debug("Searching in placeholder:", label);
                e = (0, _placeholder2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using placeholder:", label);
                    return e;
                }

                _logger2.default.debug("Searching by node type:", label);
                e = (0, _nodeType2.default)(label, container);
                if (e.length > 0) {
                    _logger2.default.info("Matched using node type:", label);
                    return e;
                }

                return e;
            };

            var _logger = require("../logger");

            var _logger2 = _interopRequireDefault(_logger);

            var _customLabel = require("./custom-label");

            var _customLabel2 = _interopRequireDefault(_customLabel);

            var _containsText = require("./contains-text");

            var _containsText2 = _interopRequireDefault(_containsText);

            var _id = require("./id");

            var _id2 = _interopRequireDefault(_id);

            var _className = require("./class-name");

            var _className2 = _interopRequireDefault(_className);

            var _name = require("./name");

            var _name2 = _interopRequireDefault(_name);

            var _value = require("./value");

            var _value2 = _interopRequireDefault(_value);

            var _placeholder = require("./placeholder");

            var _placeholder2 = _interopRequireDefault(_placeholder);

            var _nodeType = require("./node-type");

            var _nodeType2 = _interopRequireDefault(_nodeType);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "../logger": 14, "./class-name": 2, "./contains-text": 3, "./custom-label": 5, "./id": 7, "./name": 8, "./node-type": 9, "./placeholder": 10, "./value": 11 }], 7: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                try {
                    return (0, _css2.default)("#" + label, container);
                } catch (e) {
                    return [];
                }
            };

            var _css = require("./css");

            var _css2 = _interopRequireDefault(_css);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./css": 4 }], 8: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                return (0, _xpath2.default)(".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container);
            };

            var _xpath = require("./xpath");

            var _xpath2 = _interopRequireDefault(_xpath);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./xpath": 12 }], 9: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                try {
                    return (0, _css2.default)("" + label, container);
                } catch (e) {
                    return [];
                }
            };

            var _css = require("./css");

            var _css2 = _interopRequireDefault(_css);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./css": 4 }], 10: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                return (0, _xpath2.default)(".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container);
            };

            var _xpath = require("./xpath");

            var _xpath2 = _interopRequireDefault(_xpath);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "./xpath": 12 }], 11: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                return (0, _css2.default)("button,input,option,param", container).filter(function (input) {
                    return input.value && input.value.toLowerCase().indexOf(label.toLowerCase()) != -1;
                });
            };

            var _css = require("../../src/find-strategies/css");

            var _css2 = _interopRequireDefault(_css);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
        }, { "../../src/find-strategies/css": 4 }], 12: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function (label, container) {
                try {
                    var results = [];

                    var xpathResult = document.evaluate(label, container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    for (var i = 0; i < xpathResult.snapshotLength; i++) {
                        results.push(xpathResult.snapshotItem(i));
                    }

                    return results;
                } catch (err) {
                    return [];
                }
            };
        }, {}], 13: [function (require, module, exports) {
            "use strict";

            var _selector = require("./selector");

            var _selector2 = _interopRequireDefault(_selector);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            window.glanceSelector = _selector2.default;
        }, { "./selector": 16 }], 14: [function (require, module, exports) {
            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var LogLevels = {
                error: 0,
                warn: 1,
                info: 2,
                debug: 3,
                trace: 4
            };

            exports.default = {
                level: LogLevels['error'],

                setLogLevel: function setLogLevel(level) {
                    this.level = LogLevels[level];
                },
                error: function error() {
                    for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                        messages[_key] = arguments[_key];
                    }

                    this._log('error', messages);
                },
                warn: function warn() {
                    for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        messages[_key2] = arguments[_key2];
                    }

                    this._log('warn', messages);
                },
                info: function info() {
                    for (var _len3 = arguments.length, messages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        messages[_key3] = arguments[_key3];
                    }

                    this._log('info', messages);
                },
                debug: function debug() {
                    for (var _len4 = arguments.length, messages = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        messages[_key4] = arguments[_key4];
                    }

                    this._log('debug', messages);
                },
                trace: function trace() {
                    for (var _len5 = arguments.length, messages = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        messages[_key5] = arguments[_key5];
                    }

                    this._log('trace', messages);
                },
                _log: function _log(level, messages) {
                    var l = LogLevels[level];

                    if (l <= this.level) {
                        console.log(messages.join(" "));
                    }
                }
            };
        }, {}], 15: [function (require, module, exports) {
            "use strict";

            module.exports = function () {
                "use strict";

                /*
                 * Generated by PEG.js 0.9.0.
                 *
                 * http://pegjs.org/
                 */

                function peg$subclass(child, parent) {
                    function ctor() {
                        this.constructor = child;
                    }
                    ctor.prototype = parent.prototype;
                    child.prototype = new ctor();
                }

                function peg$SyntaxError(message, expected, found, location) {
                    this.message = message;
                    this.expected = expected;
                    this.found = found;
                    this.location = location;
                    this.name = "SyntaxError";

                    if (typeof Error.captureStackTrace === "function") {
                        Error.captureStackTrace(this, peg$SyntaxError);
                    }
                }

                peg$subclass(peg$SyntaxError, Error);

                function peg$parse(input) {
                    var options = arguments.length > 1 ? arguments[1] : {},
                        parser = this,
                        peg$FAILED = {},
                        peg$startRuleFunctions = { Start: peg$parseStart },
                        peg$startRuleFunction = peg$parseStart,
                        peg$c0 = function peg$c0(containers) {
                        return { containers: containers };
                    },
                        peg$c1 = function peg$c1(section) {
                        return section;
                    },
                        peg$c2 = function peg$c2(label, position, modifier) {
                        return { label: label, position: position, modifier: modifier };
                    },
                        peg$c3 = ">",
                        peg$c4 = { type: "literal", value: ">", description: "\">\"" },
                        peg$c5 = function peg$c5(chars) {
                        return chars.join('');
                    },
                        peg$c6 = function peg$c6(c) {
                        return c;
                    },
                        peg$c7 = { type: "any", description: "any character" },
                        peg$c8 = function peg$c8(c) {
                        return c;
                    },
                        peg$c9 = "\\",
                        peg$c10 = { type: "literal", value: "\\", description: "\"\\\\\"" },
                        peg$c11 = function peg$c11(position) {
                        return position;
                    },
                        peg$c12 = "#",
                        peg$c13 = { type: "literal", value: "#", description: "\"#\"" },
                        peg$c14 = /^[0-9]/,
                        peg$c15 = { type: "class", value: "[0-9]", description: "[0-9]" },
                        peg$c16 = function peg$c16() {
                        return parseInt(text(), 10);
                    },
                        peg$c17 = function peg$c17(name) {
                        return name.join('');
                    },
                        peg$c18 = ":",
                        peg$c19 = { type: "literal", value: ":", description: "\":\"" },
                        peg$currPos = 0,
                        peg$savedPos = 0,
                        peg$posDetailsCache = [{ line: 1, column: 1, seenCR: false }],
                        peg$maxFailPos = 0,
                        peg$maxFailExpected = [],
                        peg$silentFails = 0,
                        peg$result;

                    if ("startRule" in options) {
                        if (!(options.startRule in peg$startRuleFunctions)) {
                            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
                        }

                        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
                    }

                    function text() {
                        return input.substring(peg$savedPos, peg$currPos);
                    }

                    function location() {
                        return peg$computeLocation(peg$savedPos, peg$currPos);
                    }

                    function expected(description) {
                        throw peg$buildException(null, [{ type: "other", description: description }], input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
                    }

                    function error(message) {
                        throw peg$buildException(message, null, input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
                    }

                    function peg$computePosDetails(pos) {
                        var details = peg$posDetailsCache[pos],
                            p,
                            ch;

                        if (details) {
                            return details;
                        } else {
                            p = pos - 1;
                            while (!peg$posDetailsCache[p]) {
                                p--;
                            }

                            details = peg$posDetailsCache[p];
                            details = {
                                line: details.line,
                                column: details.column,
                                seenCR: details.seenCR
                            };

                            while (p < pos) {
                                ch = input.charAt(p);
                                if (ch === "\n") {
                                    if (!details.seenCR) {
                                        details.line++;
                                    }
                                    details.column = 1;
                                    details.seenCR = false;
                                } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                                    details.line++;
                                    details.column = 1;
                                    details.seenCR = true;
                                } else {
                                    details.column++;
                                    details.seenCR = false;
                                }

                                p++;
                            }

                            peg$posDetailsCache[pos] = details;
                            return details;
                        }
                    }

                    function peg$computeLocation(startPos, endPos) {
                        var startPosDetails = peg$computePosDetails(startPos),
                            endPosDetails = peg$computePosDetails(endPos);

                        return {
                            start: {
                                offset: startPos,
                                line: startPosDetails.line,
                                column: startPosDetails.column
                            },
                            end: {
                                offset: endPos,
                                line: endPosDetails.line,
                                column: endPosDetails.column
                            }
                        };
                    }

                    function peg$fail(expected) {
                        if (peg$currPos < peg$maxFailPos) {
                            return;
                        }

                        if (peg$currPos > peg$maxFailPos) {
                            peg$maxFailPos = peg$currPos;
                            peg$maxFailExpected = [];
                        }

                        peg$maxFailExpected.push(expected);
                    }

                    function peg$buildException(message, expected, found, location) {
                        function cleanupExpected(expected) {
                            var i = 1;

                            expected.sort(function (a, b) {
                                if (a.description < b.description) {
                                    return -1;
                                } else if (a.description > b.description) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            });

                            while (i < expected.length) {
                                if (expected[i - 1] === expected[i]) {
                                    expected.splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                        }

                        function buildMessage(expected, found) {
                            function stringEscape(s) {
                                function hex(ch) {
                                    return ch.charCodeAt(0).toString(16).toUpperCase();
                                }

                                return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
                                    return '\\x0' + hex(ch);
                                }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
                                    return '\\x' + hex(ch);
                                }).replace(/[\u0100-\u0FFF]/g, function (ch) {
                                    return "\\u0" + hex(ch);
                                }).replace(/[\u1000-\uFFFF]/g, function (ch) {
                                    return "\\u" + hex(ch);
                                });
                            }

                            var expectedDescs = new Array(expected.length),
                                expectedDesc,
                                foundDesc,
                                i;

                            for (i = 0; i < expected.length; i++) {
                                expectedDescs[i] = expected[i].description;
                            }

                            expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];

                            foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

                            return "Expected " + expectedDesc + " but " + foundDesc + " found.";
                        }

                        if (expected !== null) {
                            cleanupExpected(expected);
                        }

                        return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
                    }

                    function peg$parseStart() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = [];
                        s2 = peg$parseContainer();
                        while (s2 !== peg$FAILED) {
                            s1.push(s2);
                            s2 = peg$parseContainer();
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c0(s1);
                        }
                        s0 = s1;

                        return s0;
                    }

                    function peg$parseContainer() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = peg$parseSection();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseContainerChar();
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c1(s1);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }

                        return s0;
                    }

                    function peg$parseSection() {
                        var s0, s1, s2, s3;

                        s0 = peg$currPos;
                        s1 = peg$parseLabel();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseIndex();
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseModifier();
                                if (s3 === peg$FAILED) {
                                    s3 = null;
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c2(s1, s2, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }

                        return s0;
                    }

                    function peg$parseContainerChar() {
                        var s0;

                        if (input.charCodeAt(peg$currPos) === 62) {
                            s0 = peg$c3;
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c4);
                            }
                        }

                        return s0;
                    }

                    function peg$parseLabel() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = [];
                        s2 = peg$parseLabelCharacter();
                        if (s2 !== peg$FAILED) {
                            while (s2 !== peg$FAILED) {
                                s1.push(s2);
                                s2 = peg$parseLabelCharacter();
                            }
                        } else {
                            s1 = peg$FAILED;
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c5(s1);
                        }
                        s0 = s1;

                        return s0;
                    }

                    function peg$parseLabelCharacter() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = peg$currPos;
                        peg$silentFails++;
                        s2 = peg$parseEscapeChar();
                        if (s2 === peg$FAILED) {
                            s2 = peg$parseContainerChar();
                            if (s2 === peg$FAILED) {
                                s2 = peg$parseIndexChar();
                                if (s2 === peg$FAILED) {
                                    s2 = peg$parseModifierChar();
                                }
                            }
                        }
                        peg$silentFails--;
                        if (s2 === peg$FAILED) {
                            s1 = void 0;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseCharacter();
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c6(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseEscapedSequence();
                            if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c6(s1);
                            }
                            s0 = s1;
                        }

                        return s0;
                    }

                    function peg$parseCharacter() {
                        var s0;

                        if (input.length > peg$currPos) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c7);
                            }
                        }

                        return s0;
                    }

                    function peg$parseEscapedSequence() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = peg$parseEscapeChar();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseEscapeChar();
                            if (s2 === peg$FAILED) {
                                s2 = peg$parseIndexChar();
                                if (s2 === peg$FAILED) {
                                    s2 = peg$parseContainerChar();
                                    if (s2 === peg$FAILED) {
                                        s2 = peg$parseModifierChar();
                                    }
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c8(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }

                        return s0;
                    }

                    function peg$parseEscapeChar() {
                        var s0;

                        if (input.charCodeAt(peg$currPos) === 92) {
                            s0 = peg$c9;
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c10);
                            }
                        }

                        return s0;
                    }

                    function peg$parseIndex() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = peg$parseIndexChar();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parsePosition();
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c11(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }

                        return s0;
                    }

                    function peg$parseIndexChar() {
                        var s0;

                        if (input.charCodeAt(peg$currPos) === 35) {
                            s0 = peg$c12;
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c13);
                            }
                        }

                        return s0;
                    }

                    function peg$parsePosition() {
                        var s0, s1, s2;

                        s0 = peg$currPos;
                        s1 = [];
                        if (peg$c14.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c15);
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            while (s2 !== peg$FAILED) {
                                s1.push(s2);
                                if (peg$c14.test(input.charAt(peg$currPos))) {
                                    s2 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c15);
                                    }
                                }
                            }
                        } else {
                            s1 = peg$FAILED;
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c16();
                        }
                        s0 = s1;

                        return s0;
                    }

                    function peg$parseModifier() {
                        var s0, s1, s2, s3;

                        s0 = peg$currPos;
                        s1 = peg$parseModifierChar();
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            s3 = peg$parseCharacter();
                            if (s3 !== peg$FAILED) {
                                while (s3 !== peg$FAILED) {
                                    s2.push(s3);
                                    s3 = peg$parseCharacter();
                                }
                            } else {
                                s2 = peg$FAILED;
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c17(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }

                        return s0;
                    }

                    function peg$parseModifierChar() {
                        var s0;

                        if (input.charCodeAt(peg$currPos) === 58) {
                            s0 = peg$c18;
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c19);
                            }
                        }

                        return s0;
                    }

                    peg$result = peg$startRuleFunction();

                    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
                        return peg$result;
                    } else {
                        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                            peg$fail({ type: "end", description: "end of input" });
                        }

                        throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
                    }
                }

                return {
                    SyntaxError: peg$SyntaxError,
                    parse: peg$parse
                };
            }();
        }, {}], 16: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _discoverParent = require("./container-strategies/discover-parent");

            var _discoverParent2 = _interopRequireDefault(_discoverParent);

            var _default = require("./find-strategies/default");

            var _default2 = _interopRequireDefault(_default);

            var _parser = require("./parser");

            var _parser2 = _interopRequireDefault(_parser);

            var _logger = require("./logger");

            var _logger2 = _interopRequireDefault(_logger);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            function mergeOptions(obj1, obj2) {
                var obj3 = {};
                for (var attrname in obj1) {
                    obj3[attrname] = obj1[attrname];
                }
                for (var attrname in obj2) {
                    obj3[attrname] = obj2[attrname];
                }
                return obj3;
            }

            function GlanceSelector(options) {
                var _selector = {};
                _selector.customLabels = options.customLabels || {};
                _selector.containerStrategy = options.containerStrategy;

                var selector = function selector(reference) {
                    var data = _parser2.default.parse(reference);

                    var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
                    var elements = _selector.containerStrategy.search(data.containers, document, 0, resolvedLabels);

                    if (elements.length === 1) return elements[0];else return elements;
                };

                selector.addCustomLabels = function (customLabels) {
                    _selector.customLabels = mergeOptions(_selector.customLabels, customLabels);
                };

                selector.setLogLevel = function (level) {
                    _logger2.default.setLogLevel(level);
                };

                return selector;
            }

            function resolveCustomLabels(data, customLabels, selector) {
                var newCustomLabels = {};
                data.containers.forEach(function (reference) {
                    var customLabel = customLabels[reference.label];
                    if (typeof customLabel == 'function') {

                        newCustomLabels[reference.label] = customLabel(GlanceSelector({
                            containerStrategy: selector.containerStrategy,
                            customLabels: mergeOptions(customLabels, newCustomLabels)
                        }), reference);
                    } else {
                        newCustomLabels[reference.label] = customLabels[reference.label];
                    }
                });

                return newCustomLabels;
            }

            var defaultContainerStrategy = new _discoverParent2.default(_default2.default);

            exports.default = GlanceSelector({ containerStrategy: defaultContainerStrategy });
        }, { "./container-strategies/discover-parent": 1, "./find-strategies/default": 6, "./logger": 14, "./parser": 15 }] }, {}, [13]);
};