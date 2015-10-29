module.exports = function(selector, customLabels, multiple) {
	customLabels = customLabels || {};

	var unique = function(array) {
		var o = {}, i, l = array.length, r = [];
		for (i = 0; i < l; i += 1) o[xpath(array[i]).xpath] = array[i];
		for (i in o) r.push(o[i]);
		return r;
	};

	var isDescendant = function(parent, child) {
		var node = child.parentNode;
		while (node != null) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	var contentMatch = function(origin, target) {
		try {
			//
			// Exact match
			//
			var xpathResult = document.evaluate(".//*[not(self::script) and text()='" + target + "']", origin, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var results = [];
			for (var i = 0; i < xpathResult.snapshotLength; i++) {
				results.push(xpathResult.snapshotItem(i));
			}

			if (results.length == 0) {
				//
				// Contains match
				//
				var xpathResult = document.evaluate(".//*[not(self::script) and contains(text(),'" + target + "')]", origin, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

				for (var i = 0; i < xpathResult.snapshotLength; i++) {
					results.push(xpathResult.snapshotItem(i));
				}

				if (results.length == 0) {
					return false;
				}
			}

			return results;
		}
		catch (e) {
			return false;
		}
	};

	var cssQuery = function(origin, target) {
		try {
			var results = origin.querySelectorAll(target);
			if (results.length == 0) {
				return false;
			}

			return results;
		}
		catch (e) {
			return false;
		}
	};

	function customLabelMatch(container, customLabel) {
		try {
			var r = [];
			var xpathResult = document.evaluate(customLabel, document.querySelector("body"), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			if (xpathResult.snapshotLength > 0) {
				for (var i = 0; i < xpathResult.snapshotLength; ++i) {
					var e = xpathResult.snapshotItem(i);

					if (isDescendant(container, e)) {
						r.push(e)
					}
				}
			}

			if (r.length != 0) {
				return r;
			}

			return false;
		}
		catch (e) {
			return false;
		}
	}

	var Strategies = {
		getByCustomLabel: function(container, text) {
			var elementsXPath = customLabels[text];
			if (!elementsXPath) return false;

			return customLabelMatch(container, elementsXPath);
		},
		searchTextExactMatch: function(container, text) {
			return contentMatch(container, text)
		},
		searchID: function(container, text) {
			return cssQuery(container, "#" + text);
		},
		searchClass: function(container, text) {
			return cssQuery(container, "." + text);
		},
		searchType: function(container, text) {
			return cssQuery(container, text);
		}
	};

	var findElement = function(container, label) {
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

	var indexOf = function(label) {
		var index = label.split("#")[1];
		return index ? index - 1 : -1;
	};

	var drillDown = function(label) {
		var body = document.querySelector("body");
		var labels = label.split(">");
		var lastIndex = label.match(/#(\d*)$/);

		var targets = searchContainer(body, labels, 0)

		if (!targets) {
			return false;
		}
		else {

			if (lastIndex) {
				//
				// Assume last index is for all targets found
				//
				return [targets[lastIndex[1] - 1]];
			}
			else {
				return targets;
			}
		}
	};

	var limitToReferences = function(elements, container) {
		var elementContainsContainer = false;
		var parentsContainingReference = [];
		for (var e = 0; e < elements.length; ++e) {
			if (isDescendant(elements[e], container)) {
				elementContainsContainer = true;
				parentsContainingReference.push(elements[e]);
			}
		}

		if (elementContainsContainer)
			return parentsContainingReference;

		return elements;
	}

	var searchContainer = function(container, labels, labelIndex) {
		var l = labels[labelIndex];
		var i = indexOf(l);

		var elements = findElement(container, l);

		if (!elements) return false;

		elements = limitToReferences(elements, container);

		var lastItem = labelIndex + 1 === labels.length;
		if (lastItem) {
			return elements;
		}
		else {
			// IS a container
			var targets = [];

			if (i >= 0) {
				var childContainer = elements[i];
				targets = targets.concat(Array.prototype.slice.call(searchContainer(childContainer, labels, labelIndex + 1)));
			}
			else {
				for (var c = 0; c < elements.length; c++) {
					var childContainer = elements[c];
					var foundItems = Array.prototype.slice.call(searchContainer(childContainer, labels, labelIndex + 1));
					targets = targets.concat(foundItems);
				}
			}

			return unique(targets);
		}
	};

	var xpath = function(element) {
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
			element = element.parentNode
		}

		element = originalElement;

		while (element && element.nodeType == 1) {
			var i = index(element);

			if (tagsInsideSVG > 0) {
				xname = "*[name()='" + element.tagName + "']";
				--tagsInsideSVG;
			}
			else {
				xname = element.tagName
			}
			xname += "[" + i + "]";
			path = "/" + xname + path;

			element = element.parentNode
		}

		return {xpath: path};
	};

	var index = function(element) {
		var i = 1;
		var sibling = element;
		while (sibling = sibling.previousSibling) {
			if (sibling.nodeType == 1 && sibling.tagName == element.tagName) i++
		}

		return i;
	};

	function IDGenerator() {
		this.length = 8;
		this.timestamp = +new Date;

		var _getRandomInt = function(min, max) {
			return Math.floor(Math.random() * ( max - min + 1 )) + min;
		}

		this.generate = function() {
			var ts = this.timestamp.toString();
			var parts = ts.split("").reverse();
			var id = "";

			for (var i = 0; i < this.length; ++i) {
				var index = _getRandomInt(0, parts.length - 1);
				id += parts[index];
			}

			return id;
		}
	}

	var search = function() {
		var targetElement = drillDown(selector);

		if (!targetElement) return {notFound: true}
		var elementIDs = [];
		var generator = new IDGenerator();

		for (var i = 0; i < targetElement.length; i++) {
			var id = targetElement[i].getAttribute();

			if(!id) {
				id = generator.generate();
				targetElement[i].setAttribute("data-glance-id", id);
			}

			elementIDs.push(id);
		}

		return {ids: elementIDs};
	};

	return search();
}