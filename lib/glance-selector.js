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
            function _classCallCheck(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
                    }
                }return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t;
                };
            }(),
                DiscoverParentContainer = function () {
                function e(t) {
                    _classCallCheck(this, e), this.findElement = t, this.customLabels = {};
                }return _createClass(e, [{ key: "search", value: function value(e, t, n, r) {
                        n = n || 0;for (var i = e[n], a = i.position - 1, o = [], l = t; l && 0 == o.length;) {
                            o = this.findElement(i.label, l, r), l = l.parentNode;
                        }o = this._limitToVisible(o), o = this._limitToScope(o, t), o = this._limitToNextSibling(o, t);var u = n + 1 === e.length;if (u) return a >= 0 ? o[a] ? [].concat(o[a]) : [] : o;var s = [];if (a >= 0) {
                            var c = o[a],
                                f = this.search(e, c, n + 1, r);s = s.concat(f);
                        } else for (var h = 0; h < o.length; h++) {
                            var c = o[h],
                                f = this.search(e, c, n + 1, r);s = s.concat(f);
                        }return this._unique(s);
                    } }, { key: "_limitToVisible", value: function value(e) {
                        return e.filter(function (e) {
                            return "option" == e.tagName.toLowerCase() || e.offsetParent;
                        });
                    } }, { key: "_limitToScope", value: function value(e, t) {
                        for (var n = !1, r = [], i = 0; i < e.length; ++i) {
                            this._isDescendant(e[i], t) && (n = !0, r.push(e[i]));
                        }return n ? r : e;
                    } }, { key: "_limitToNextSibling", value: function value(e, t) {
                        var n = e.filter(function (e) {
                            return t && t.nextElementSibling == e;
                        });return 0 == n.length ? e : n;
                    } }, { key: "_unique", value: function value(e) {
                        return e.filter(function (t, n) {
                            return e.indexOf(t) === n;
                        });
                    } }, { key: "_isDescendant", value: function value(e, t) {
                        for (var n = t.parentNode; null != n;) {
                            if (n == e) return !0;n = n.parentNode;
                        }return !1;
                    } }]), e;
            }();exports["default"] = DiscoverParentContainer;
        }, {}], 2: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                try {
                    return (0, _css2["default"])("." + e, t);
                } catch (r) {
                    return [];
                }
            };var _css = require("./css"),
                _css2 = _interopRequireDefault(_css);
        }, { "./css": 4 }], 3: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(t) {
                return t && t.__esModule ? t : { "default": t };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (t, e) {
                return (0, _xpath2["default"])(".//*[not(self::script) and not(self::noscript) and not(self::style) and text()[contains(translate(., 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + t + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]]", e);
            };var _xpath = require("./xpath"),
                _xpath2 = _interopRequireDefault(_xpath);
        }, { "./xpath": 12 }], 4: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, r) {
                try {
                    var t = r.querySelectorAll(e);return Array.prototype.slice.apply(t);
                } catch (l) {
                    return [];
                }
            };
        }, {}], 5: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, r, t) {
                t = t || {};var n = t[e],
                    u = n;if ("function" == typeof u && (u = n()), !u) return [];u = [].concat(u);try {
                    var o = [];return u.forEach(function (e) {
                        isDescendant(r, e) && o.push(e);
                    }), o;
                } catch (a) {
                    return [];
                }
            };var isDescendant = function isDescendant(e, r) {
                for (var t = r.parentNode; null != t;) {
                    if (t == e) return !0;t = t.parentNode;
                }return !1;
            };
        }, {}], 6: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, l, a) {
                _logger2["default"].debug("Searching by custom label:", e);var t = (0, _customLabel2["default"])(e, l, a || {});return t.length > 0 ? (_logger2["default"].info("Matched using custom label:", e), t) : (_logger2["default"].debug("Searching for text that contains:", e), t = (0, _containsText2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using contains text:", e), t) : (_logger2["default"].debug("Searching by id:", e), t = (0, _id2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using ID:", e), t) : (_logger2["default"].debug("Searching for css class:", e), t = (0, _className2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using css class:", e), t) : (_logger2["default"].debug("Searching in name:", e), t = (0, _name2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using name:", e), t) : (_logger2["default"].debug("Searching in value:", e), t = (0, _value2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using value:", e), t) : (_logger2["default"].debug("Searching in placeholder:", e), t = (0, _placeholder2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using placeholder:", e), t) : (_logger2["default"].debug("Searching by node type:", e), t = (0, _nodeType2["default"])(e, l), t.length > 0 ? (_logger2["default"].info("Matched using node type:", e), t) : t)))))));
            };var _logger = require("../logger"),
                _logger2 = _interopRequireDefault(_logger),
                _customLabel = require("./custom-label"),
                _customLabel2 = _interopRequireDefault(_customLabel),
                _containsText = require("./contains-text"),
                _containsText2 = _interopRequireDefault(_containsText),
                _id = require("./id"),
                _id2 = _interopRequireDefault(_id),
                _className = require("./class-name"),
                _className2 = _interopRequireDefault(_className),
                _name = require("./name"),
                _name2 = _interopRequireDefault(_name),
                _value = require("./value"),
                _value2 = _interopRequireDefault(_value),
                _placeholder = require("./placeholder"),
                _placeholder2 = _interopRequireDefault(_placeholder),
                _nodeType = require("./node-type"),
                _nodeType2 = _interopRequireDefault(_nodeType);
        }, { "../logger": 14, "./class-name": 2, "./contains-text": 3, "./custom-label": 5, "./id": 7, "./name": 8, "./node-type": 9, "./placeholder": 10, "./value": 11 }], 7: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                try {
                    return (0, _css2["default"])("#" + e, t);
                } catch (r) {
                    return [];
                }
            };var _css = require("./css"),
                _css2 = _interopRequireDefault(_css);
        }, { "./css": 4 }], 8: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                return (0, _xpath2["default"])(".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + e + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", t);
            };var _xpath = require("./xpath"),
                _xpath2 = _interopRequireDefault(_xpath);
        }, { "./xpath": 12 }], 9: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                try {
                    return (0, _css2["default"])("" + e, t);
                } catch (r) {
                    return [];
                }
            };var _css = require("./css"),
                _css2 = _interopRequireDefault(_css);
        }, { "./css": 4 }], 10: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                return (0, _xpath2["default"])(".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + e + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", t);
            };var _xpath = require("./xpath"),
                _xpath2 = _interopRequireDefault(_xpath);
        }, { "./xpath": 12 }], 11: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (e, t) {
                return (0, _css2["default"])("button,input,option,param", t).filter(function (t) {
                    return t.value && -1 != t.value.toLowerCase().indexOf(e.toLowerCase());
                });
            };var _css = require("../../src/find-strategies/css"),
                _css2 = _interopRequireDefault(_css);
        }, { "../../src/find-strategies/css": 4 }], 12: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: !0 }), exports["default"] = function (t, e) {
                try {
                    for (var u = [], r = document.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), n = 0; n < r.snapshotLength; n++) {
                        u.push(r.snapshotItem(n));
                    }return u;
                } catch (s) {
                    return [];
                }
            };
        }, {}], 13: [function (require, module, exports) {
            "use strict";
            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }var _selector = require("./selector"),
                _selector2 = _interopRequireDefault(_selector);window.glanceSelector = _selector2["default"];
        }, { "./selector": 16 }], 14: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: !0 });var LogLevels = { error: 0, warn: 1, info: 2, debug: 3, trace: 4 };exports["default"] = { level: LogLevels.error, setLogLevel: function setLogLevel(r) {
                    this.level = LogLevels[r];
                }, error: function error() {
                    for (var r = arguments.length, e = Array(r), o = 0; r > o; o++) {
                        e[o] = arguments[o];
                    }this._log("error", e);
                }, warn: function warn() {
                    for (var r = arguments.length, e = Array(r), o = 0; r > o; o++) {
                        e[o] = arguments[o];
                    }this._log("warn", e);
                }, info: function info() {
                    for (var r = arguments.length, e = Array(r), o = 0; r > o; o++) {
                        e[o] = arguments[o];
                    }this._log("info", e);
                }, debug: function debug() {
                    for (var r = arguments.length, e = Array(r), o = 0; r > o; o++) {
                        e[o] = arguments[o];
                    }this._log("debug", e);
                }, trace: function trace() {
                    for (var r = arguments.length, e = Array(r), o = 0; r > o; o++) {
                        e[o] = arguments[o];
                    }this._log("trace", e);
                }, _log: function _log(r, e) {
                    var o = LogLevels[r];o <= this.level && console.log(e.join(" "));
                } };
        }, {}], 15: [function (require, module, exports) {
            "use strict";
            module.exports = function () {
                function n(n, r) {
                    function t() {
                        this.constructor = n;
                    }t.prototype = r.prototype, n.prototype = new t();
                }function r(n, t, e, u) {
                    this.message = n, this.expected = t, this.found = e, this.location = u, this.name = "SyntaxError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, r);
                }function t(n) {
                    function t() {
                        return n.substring(un, en);
                    }function e(r) {
                        var t,
                            e,
                            u = on[r];if (u) return u;for (t = r - 1; !on[t];) {
                            t--;
                        }for (u = on[t], u = { line: u.line, column: u.column, seenCR: u.seenCR }; r > t;) {
                            e = n.charAt(t), "\n" === e ? (u.seenCR || u.line++, u.column = 1, u.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (u.line++, u.column = 1, u.seenCR = !0) : (u.column++, u.seenCR = !1), t++;
                        }return on[r] = u, u;
                    }function u(n, r) {
                        var t = e(n),
                            u = e(r);return { start: { offset: n, line: t.line, column: t.column }, end: { offset: r, line: u.line, column: u.column } };
                    }function i(n) {
                        cn > en || (en > cn && (cn = en, an = []), an.push(n));
                    }function o(n, t, e, u) {
                        function i(n) {
                            var r = 1;for (n.sort(function (n, r) {
                                return n.description < r.description ? -1 : n.description > r.description ? 1 : 0;
                            }); r < n.length;) {
                                n[r - 1] === n[r] ? n.splice(r, 1) : r++;
                            }
                        }function o(n, r) {
                            function t(n) {
                                function r(n) {
                                    return n.charCodeAt(0).toString(16).toUpperCase();
                                }return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (n) {
                                    return "\\x0" + r(n);
                                }).replace(/[\x10-\x1F\x80-\xFF]/g, function (n) {
                                    return "\\x" + r(n);
                                }).replace(/[\u0100-\u0FFF]/g, function (n) {
                                    return "\\u0" + r(n);
                                }).replace(/[\u1000-\uFFFF]/g, function (n) {
                                    return "\\u" + r(n);
                                });
                            }var e,
                                u,
                                i,
                                o = new Array(n.length);for (i = 0; i < n.length; i++) {
                                o[i] = n[i].description;
                            }return e = n.length > 1 ? o.slice(0, -1).join(", ") + " or " + o[n.length - 1] : o[0], u = r ? '"' + t(r) + '"' : "end of input", "Expected " + e + " but " + u + " found.";
                        }return null !== t && i(t), new r(null !== n ? n : o(t, e), t, e, u);
                    }function c() {
                        var n, r, t;for (n = en, r = [], t = h(); t !== j;) {
                            r.push(t), t = h();
                        }return r !== j && (un = n, r = B(r)), n = r;
                    }function a() {
                        var r;return 62 === n.charCodeAt(en) ? (r = I, en++) : (r = j, 0 === ln && i(U)), r;
                    }function l() {
                        var r;return 58 === n.charCodeAt(en) ? (r = q, en++) : (r = j, 0 === ln && i(z)), r;
                    }function f() {
                        var r;return 44 === n.charCodeAt(en) ? (r = D, en++) : (r = j, 0 === ln && i(G)), r;
                    }function s() {
                        var r;return 35 === n.charCodeAt(en) ? (r = H, en++) : (r = j, 0 === ln && i(J)), r;
                    }function p() {
                        var r;return 92 === n.charCodeAt(en) ? (r = K, en++) : (r = j, 0 === ln && i(L)), r;
                    }function h() {
                        var n, r, t;return n = en, r = v(), r !== j ? (t = a(), t === j && (t = null), t !== j ? (un = n, r = M(r), n = r) : (en = n, n = j)) : (en = n, n = j), n;
                    }function v() {
                        var n, r, t, e, u;return n = en, r = d(), r !== j ? (t = x(), t === j && (t = null), t !== j ? (e = F(), e === j && (e = null), e !== j ? (u = A(), u === j && (u = null), u !== j ? (un = n, r = N(r, t, e), n = r) : (en = n, n = j)) : (en = n, n = j)) : (en = n, n = j)) : (en = n, n = j), n;
                    }function d() {
                        var n, r, t;if (n = en, r = [], t = g(), t !== j) for (; t !== j;) {
                            r.push(t), t = g();
                        } else r = j;return r !== j && (un = n, r = O(r)), n = r;
                    }function g() {
                        var n, r, t;return n = en, r = en, ln++, t = p(), t === j && (t = a(), t === j && (t = s(), t === j && (t = l()))), ln--, t === j ? r = void 0 : (en = r, r = j), r !== j ? (t = y(), t !== j ? (un = n, r = P(t), n = r) : (en = n, n = j)) : (en = n, n = j), n === j && (n = en, r = m(), r !== j && (un = n, r = P(r)), n = r), n;
                    }function y() {
                        var r;return n.length > en ? (r = n.charAt(en), en++) : (r = j, 0 === ln && i(Q)), r;
                    }function A() {
                        var r, t;if (r = [], V.test(n.charAt(en)) ? (t = n.charAt(en), en++) : (t = j, 0 === ln && i(W)), t !== j) for (; t !== j;) {
                            r.push(t), V.test(n.charAt(en)) ? (t = n.charAt(en), en++) : (t = j, 0 === ln && i(W));
                        } else r = j;return r;
                    }function m() {
                        var n, r, t;return n = en, r = p(), r !== j ? (t = p(), t === j && (t = s(), t === j && (t = a(), t === j && (t = l()))), t !== j ? (un = n, r = X(t), n = r) : (en = n, n = j)) : (en = n, n = j), n;
                    }function x() {
                        var n, r, t;return n = en, r = s(), r !== j ? (t = C(), t !== j ? (un = n, r = Y(t), n = r) : (en = n, n = j)) : (en = n, n = j), n;
                    }function C() {
                        var r, t, e;if (r = en, t = [], Z.test(n.charAt(en)) ? (e = n.charAt(en), en++) : (e = j, 0 === ln && i($)), e !== j) for (; e !== j;) {
                            t.push(e), Z.test(n.charAt(en)) ? (e = n.charAt(en), en++) : (e = j, 0 === ln && i($));
                        } else t = j;return t !== j && (un = r, t = _()), r = t;
                    }function F() {
                        var n, r, t, e;if (n = en, r = l(), r !== j) {
                            for (t = [], e = R(); e !== j;) {
                                t.push(e), e = R();
                            }t !== j ? (un = n, r = nn(t), n = r) : (en = n, n = j);
                        } else en = n, n = j;return n;
                    }function R() {
                        var n, r, t;return n = en, r = E(), r !== j ? (t = f(), t === j && (t = null), t !== j ? (un = n, r = rn(r), n = r) : (en = n, n = j)) : (en = n, n = j), n;
                    }function E() {
                        var n, r, t;if (n = en, r = [], t = w(), t !== j) for (; t !== j;) {
                            r.push(t), t = w();
                        } else r = j;return r !== j && (un = n, r = tn(r)), n = r;
                    }function w() {
                        var n, r, t;return n = en, r = en, ln++, t = a(), t === j && (t = f()), ln--, t === j ? r = void 0 : (en = r, r = j), r !== j ? (t = y(), t !== j ? (un = n, r = P(t), n = r) : (en = n, n = j)) : (en = n, n = j), n;
                    }var S,
                        b = arguments.length > 1 ? arguments[1] : {},
                        j = {},
                        k = { Start: c },
                        T = c,
                        B = function B(n) {
                        return n;
                    },
                        I = ">",
                        U = { type: "literal", value: ">", description: '">"' },
                        q = ":",
                        z = { type: "literal", value: ":", description: '":"' },
                        D = ",",
                        G = { type: "literal", value: ",", description: '","' },
                        H = "#",
                        J = { type: "literal", value: "#", description: '"#"' },
                        K = "\\",
                        L = { type: "literal", value: "\\", description: '"\\\\"' },
                        M = function M(n) {
                        return n;
                    },
                        N = function N(n, r, t) {
                        return { label: n.trim(), position: r, modifiers: t };
                    },
                        O = function O(n) {
                        return n.join("");
                    },
                        P = function P(n) {
                        return n;
                    },
                        Q = { type: "any", description: "any character" },
                        V = /^[ \t\r\n]/,
                        W = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },
                        X = function X(n) {
                        return n;
                    },
                        Y = function Y(n) {
                        return n;
                    },
                        Z = /^[0-9]/,
                        $ = { type: "class", value: "[0-9]", description: "[0-9]" },
                        _ = function _() {
                        return parseInt(t(), 10);
                    },
                        nn = function nn(n) {
                        return n;
                    },
                        rn = function rn(n) {
                        return n.trim();
                    },
                        tn = function tn(n) {
                        return n.join("");
                    },
                        en = 0,
                        un = 0,
                        on = [{ line: 1, column: 1, seenCR: !1 }],
                        cn = 0,
                        an = [],
                        ln = 0;if ("startRule" in b) {
                        if (!(b.startRule in k)) throw new Error("Can't start parsing from rule \"" + b.startRule + '".');T = k[b.startRule];
                    }if (S = T(), S !== j && en === n.length) return S;throw S !== j && en < n.length && i({ type: "end", description: "end of input" }), o(null, an, cn < n.length ? n.charAt(cn) : null, cn < n.length ? u(cn, cn + 1) : u(cn, cn));
                }return n(r, Error), { SyntaxError: r, parse: t };
            }();
        }, {}], 16: [function (require, module, exports) {
            "use strict";
            function _interopRequireWildcard(e) {
                if (e && e.__esModule) return e;var r = {};if (null != e) for (var t in e) {
                    Object.prototype.hasOwnProperty.call(e, t) && (r[t] = e[t]);
                }return r["default"] = e, r;
            }function _interopRequireDefault(e) {
                return e && e.__esModule ? e : { "default": e };
            }function mergeOptions(e, r) {
                var t = {};for (var a in e) {
                    t[a] = e[a];
                }for (var a in r) {
                    t[a] = r[a];
                }return t;
            }function GlanceSelector(e) {
                var r = {};r.customLabels = e.customLabels || {}, r.containerStrategy = e.containerStrategy;var t = function t(e) {
                    var t = Parser.parse(e),
                        a = resolveCustomLabels(t, r.customLabels, r),
                        n = r.containerStrategy.search(t, document, 0, a);return 1 === n.length ? n[0] : n;
                };return t.addCustomLabels = function (e) {
                    r.customLabels = mergeOptions(r.customLabels, e);
                }, t.setLogLevel = function (e) {
                    _logger2["default"].setLogLevel(e);
                }, t;
            }function resolveCustomLabels(e, r, t) {
                var a = {};return e.forEach(function (e) {
                    var n = r[e.label];"function" == typeof n ? a[e.label] = n(GlanceSelector({ containerStrategy: t.containerStrategy, customLabels: mergeOptions(r, a) }), e) : a[e.label] = r[e.label];
                }), a;
            }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.Parser = void 0;var _discoverParent = require("./container-strategies/discover-parent"),
                _discoverParent2 = _interopRequireDefault(_discoverParent),
                _default = require("./find-strategies/default"),
                _default2 = _interopRequireDefault(_default),
                _parser = require("./parser"),
                Parser = _interopRequireWildcard(_parser),
                _logger = require("./logger"),
                _logger2 = _interopRequireDefault(_logger),
                defaultContainerStrategy = new _discoverParent2["default"](_default2["default"]);exports.Parser = Parser, exports["default"] = GlanceSelector({ containerStrategy: defaultContainerStrategy });
        }, { "./container-strategies/discover-parent": 1, "./find-strategies/default": 6, "./logger": 14, "./parser": 15 }] }, {}, [13]);
};