"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (selector, customLabels, multiple, logLevel) {

	!function (e) {
		"use strict";
		var n = {};n.VERSION = "1.2.0";var t,
		    o = {},
		    r = function r(e, n) {
			return function () {
				return n.apply(e, arguments);
			};
		},
		    i = function i() {
			var e,
			    n,
			    t = arguments,
			    o = t[0];for (n = 1; n < t.length; n++) {
				for (e in t[n]) {
					e in o || !t[n].hasOwnProperty(e) || (o[e] = t[n][e]);
				}
			}return o;
		},
		    l = function l(e, n) {
			return { value: e, name: n };
		};n.DEBUG = l(1, "DEBUG"), n.INFO = l(2, "INFO"), n.TIME = l(3, "TIME"), n.WARN = l(4, "WARN"), n.ERROR = l(8, "ERROR"), n.OFF = l(99, "OFF");var f = function f(e) {
			this.context = e, this.setLevel(e.filterLevel), this.log = this.info;
		};f.prototype = { setLevel: function setLevel(e) {
				e && "value" in e && (this.context.filterLevel = e);
			}, enabledFor: function enabledFor(e) {
				var n = this.context.filterLevel;return e.value >= n.value;
			}, debug: function debug() {
				this.invoke(n.DEBUG, arguments);
			}, info: function info() {
				this.invoke(n.INFO, arguments);
			}, warn: function warn() {
				this.invoke(n.WARN, arguments);
			}, error: function error() {
				this.invoke(n.ERROR, arguments);
			}, time: function time(e) {
				"string" == typeof e && e.length > 0 && this.invoke(n.TIME, [e, "start"]);
			}, timeEnd: function timeEnd(e) {
				"string" == typeof e && e.length > 0 && this.invoke(n.TIME, [e, "end"]);
			}, invoke: function invoke(e, n) {
				t && this.enabledFor(e) && t(n, i({ level: e }, this.context));
			} };var s = new f({ filterLevel: n.OFF });!function () {
			var e = n;e.enabledFor = r(s, s.enabledFor), e.debug = r(s, s.debug), e.time = r(s, s.time), e.timeEnd = r(s, s.timeEnd), e.info = r(s, s.info), e.warn = r(s, s.warn), e.error = r(s, s.error), e.log = e.info;
		}(), n.setHandler = function (e) {
			t = e;
		}, n.setLevel = function (e) {
			s.setLevel(e);for (var n in o) {
				o.hasOwnProperty(n) && o[n].setLevel(e);
			}
		}, n.get = function (e) {
			return o[e] || (o[e] = new f(i({ name: e }, s.context)));
		}, n.useDefaults = function (e) {
			if (e = e || {}, e.formatter = e.formatter || function (e, n) {
				n.name && e.unshift("[" + n.name + "]");
			}, "undefined" != typeof console) {
				var t = {},
				    o = function o(e, n) {
					Function.prototype.apply.call(e, console, n);
				};n.setLevel(e.defaultLevel || n.DEBUG), n.setHandler(function (r, i) {
					r = Array.prototype.slice.call(r);var l,
					    f = console.log;i.level === n.TIME ? (l = (i.name ? "[" + i.name + "] " : "") + r[0], "start" === r[1] ? console.time ? console.time(l) : t[l] = new Date().getTime() : console.timeEnd ? console.timeEnd(l) : o(f, [l + ": " + (new Date().getTime() - t[l]) + "ms"])) : (i.level === n.WARN && console.warn ? f = console.warn : i.level === n.ERROR && console.error ? f = console.error : i.level === n.INFO && console.info && (f = console.info), e.formatter(r, i), o(f, r));
				});
			}
		}, "function" == typeof define && define.amd ? define(n) : "undefined" != typeof module && module.exports ? module.exports = n : (n._prevLogger = e.Logger, n.noConflict = function () {
			return e.Logger = n._prevLogger, n;
		}, e.Logger = n);
	}(this);

	var log = Logger;

	Logger.useDefaults({
		logLevel: Logger.ERROR
	});

	switch (logLevel) {
		case 'trace':
		case 'info':
			log.setLevel(Logger.INFO);
			break;

		case 'debug':
			log.setLevel(Logger.DEBUG);
			break;

		case 'warn':
			log.setLevel(Logger.WARN);
			break;

		case 'error':
			log.setLevel(Logger.ERROR);
			break;
	}

	log.useDefaults();

	// log = {
	// 	debug: function() {
	//
	// 	}
	// }

	//log.setLevel(logLevel || "error");

	customLabels = customLabels || {};

	var unique = function unique(array) {
		var o = {},
		    i,
		    l = array.length,
		    r = [];
		for (i = 0; i < l; i += 1) {
			o[xpath(array[i]).xpath] = array[i];
		}for (i in o) {
			r.push(o[i]);
		}return r;
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

	var contentMatch = function contentMatch(origin, target) {
		try {
			//
			// Exact match
			//
			log.debug("Searching for exact text:", target);
			var xpathResult = document.evaluate(".//*[not(self::script) and text()='" + target + "']", origin, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var results = [];
			for (var i = 0; i < xpathResult.snapshotLength; i++) {
				results.push(xpathResult.snapshotItem(i));
			}

			if (results.length == 0) {
				//
				// Contains match
				//
				log.debug("Searching for text that contains:", target);
				var xpathResult = document.evaluate(".//*[not(self::script) and contains(text(),'" + target + "')]", origin, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

				for (var i = 0; i < xpathResult.snapshotLength; i++) {
					results.push(xpathResult.snapshotItem(i));
				}

				if (results.length == 0) {
					return false;
				}
			}

			return results;
		} catch (e) {
			return false;
		}
	};

	var cssQuery = function cssQuery(origin, target) {
		log.debug("Searching with css selector:", target);
		try {
			var results = origin.querySelectorAll(target);
			if (results.length == 0) {
				return false;
			}

			return results;
		} catch (e) {
			return false;
		}
	};

	function customLabelMatch(container, customLabel) {
		log.debug("Searching by custom label:", customLabel);
		try {
			var r = [];
			var xpathResult = document.evaluate(customLabel, document.querySelector("body"), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			if (xpathResult.snapshotLength > 0) {
				for (var i = 0; i < xpathResult.snapshotLength; ++i) {
					var e = xpathResult.snapshotItem(i);

					if (isDescendant(container, e)) {
						r.push(e);
					}
				}
			}

			if (r.length != 0) {
				return r;
			}

			return false;
		} catch (e) {
			return false;
		}
	}

	var Strategies = {
		getByCustomLabel: function getByCustomLabel(container, text) {
			var elementsXPath = customLabels[text];
			if (!elementsXPath) return false;

			return customLabelMatch(container, elementsXPath);
		},
		searchTextExactMatch: function searchTextExactMatch(container, text) {
			return contentMatch(container, text);
		},
		searchID: function searchID(container, text) {
			log.debug("Searching by id:", text);
			return cssQuery(container, "#" + text);
		},
		searchClass: function searchClass(container, text) {
			log.debug("Searching by css class:", text);
			return cssQuery(container, "." + text);
		},
		searchType: function searchType(container, text) {
			log.debug("Searching by node type:", text);
			return cssQuery(container, text);
		}
	};

	var findElement = function findElement(container, label) {
		var l = label.split("#")[0];

		var parent = container;

		while (parent) {
			var e = Strategies.getByCustomLabel(parent, l);
			if (e && e.length > 0) return e;

			e = Strategies.searchTextExactMatch(parent, l);
			if (e && e.length > 0) return e;

			e = Strategies.searchID(parent, l);
			if (e && e.length > 0) return e;

			e = Strategies.searchClass(parent, l);
			if (e && e.length > 0) return e;

			e = Strategies.searchType(parent, l);
			if (e && e.length > 0) return e;

			parent = parent.parentNode;
		}
	};

	var indexOf = function indexOf(label) {
		var index = label.split("#")[1];
		return index ? index - 1 : -1;
	};

	var drillDown = function drillDown(label) {
		var body = document.querySelector("body");
		var labels = label.split(">");
		var lastIndex = label.match(/#(\d*)$/);

		var targets = searchContainer(body, labels, 0);

		if (!targets) {
			return false;
		} else {

			if (lastIndex) {
				//
				// Assume last index is for all targets found
				//
				return [targets[lastIndex[1] - 1]];
			} else {
				return targets;
			}
		}
	};

	var limitToReferences = function limitToReferences(elements, container) {
		var elementContainsContainer = false;
		var parentsContainingReference = [];
		for (var e = 0; e < elements.length; ++e) {
			if (isDescendant(elements[e], container)) {
				elementContainsContainer = true;
				parentsContainingReference.push(elements[e]);
			}
		}

		if (elementContainsContainer) return parentsContainingReference;

		return elements;
	};

	var searchContainer = function searchContainer(container, labels, labelIndex) {
		var l = labels[labelIndex];
		var i = indexOf(l);

		var elements = findElement(container, l);

		if (!elements) return false;

		elements = limitToReferences(elements, container);

		var lastItem = labelIndex + 1 === labels.length;
		if (lastItem) {
			return elements;
		} else {
			// IS a container
			var targets = [];

			if (i >= 0) {
				var childContainer = elements[i];
				targets = targets.concat(Array.prototype.slice.call(searchContainer(childContainer, labels, labelIndex + 1)));
			} else {
				for (var c = 0; c < elements.length; c++) {
					var childContainer = elements[c];
					var foundItems = Array.prototype.slice.call(searchContainer(childContainer, labels, labelIndex + 1));
					targets = targets.concat(foundItems);
				}
			}

			return unique(targets);
		}
	};

	var xpath = function xpath(element) {
		var originalElement = element;
		var path = "";
		var nodeCount = 1;
		var tagsInsideSVG = 0;
		var xname;
		while (element && element.nodeType == 1) {
			if (element.tagName.toLowerCase() === "svg") {
				tagsInsideSVG = nodeCount;
			}
			++nodeCount;
			element = element.parentNode;
		}

		element = originalElement;

		while (element && element.nodeType == 1) {
			var i = index(element);

			if (tagsInsideSVG > 0) {
				xname = "*[name()='" + element.tagName + "']";
				--tagsInsideSVG;
			} else {
				xname = element.tagName;
			}
			xname += "[" + i + "]";
			path = "/" + xname + path;

			element = element.parentNode;
		}

		return { xpath: path };
	};

	var index = function index(element) {
		var i = 1;
		var sibling = element;
		while (sibling = sibling.previousSibling) {
			if (sibling.nodeType == 1 && sibling.tagName == element.tagName) i++;
		}

		return i;
	};

	function IDGenerator() {
		this.length = 8;
		this.timestamp = +new Date();

		var _getRandomInt = function _getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		this.generate = function () {
			var ts = this.timestamp.toString();
			var parts = ts.split("").reverse();
			var id = "";

			for (var i = 0; i < this.length; ++i) {
				var index = _getRandomInt(0, parts.length - 1);
				id += parts[index];
			}

			return id;
		};
	}

	var search = function search() {
		var targetElements = drillDown(selector);

		if (!targetElements || targetElements.length == 0) return { notFound: true };
		var elementIDs = [];
		var generator = new IDGenerator();

		for (var i = 0; i < targetElements.length; i++) {
			var id = targetElements[i].getAttribute("data-glance-id");

			if (!id) {
				id = generator.generate();
				targetElements[i].setAttribute("data-glance-id", id);
			}

			elementIDs.push(id);
		}

		return { ids: elementIDs };
	};

	return search();
};