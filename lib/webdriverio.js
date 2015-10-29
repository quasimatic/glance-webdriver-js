var _ = require('lodash');
var glanceFunc = require('./client');

module.exports = {
	create: function(client) {
		var customLabels = [];
		var customGets = [];
		var customSets = [];

		var glance = require('webdriverio').remote(client.requestHandler.sessionID);

		var wrapMethods = ['addValue',
			'clearElement',
			'click',
			'doubleClick',
			'leftClick',
			'middleClick',
			'moveToObject',
			'rightClick',
			'selectByIndex',
			'selectByValue',
			'selectByVisibleText',
			'selectorExecute',
			'selectorExecuteAsync',
			'setValue',
			'submitForm',

			'getAttribute',
			'getCssProperty',
			'getElementSize',
			'getHTML',
			'getLocation',
			'getLocationInView',
			'getTagName',
			'getText',
			'getValue',

			'element',

			'isSelected',
			'isExisting',

			'waitForEnabled',
			'waitForExist',
			'waitForSelected',
			'waitForText',
			'waitForValue',
			'waitForVisible'
		];

		_.each(wrapMethods, function(method) {
			glance.addCommand(method, function() {
				var args = arguments;
				var reference = args[0]

				if (!reference)
					return client[method].apply(glance, args);

				if (reference.indexOf('wdio:') == 0) {
					args[0] = reference.replace('wdio:', '');
					return client[method].apply(glance, args);
				}

				return this.getCustomLabeledElements(reference).then(function(labels) {
					return this.glanceElement(reference, labels).then(function(id) {
						args[0] = "[data-glance-id='" + id + "']";
						return client[method].apply(glance, args);
					});
				});
			}, true);
		});

		glance.addCommand('dragAndDrop', function() {
			var args = arguments;
			var reference = args[0];
			var reference2 = args[1];
			return this.getCustomLabeledElements(reference).then(function(labels) {
				return this.glanceElement(args[0], labels).then(function(id) {
					this.getCustomLabeledElements(reference2).then(function(labels2) {
						return this.glanceElement(args[1], labels2).then(function(id2) {
							args[0] = "[data-glance-id='" + id + "']";
							args[1] = "[data-glance-id='" + id2 + "']";
							return client['dragAndDrop'].apply(glance, args);
						});
					});
				});
			})
		}, true);

		glance.addCommand("elements", function() {
			var args = arguments;
			var reference = args[0];

			return this.getCustomLabeledElements(reference).then(function(labels) {
				return this.glanceElement(reference, labels, true).then(function(ids) {
					args[0] = ids.map(function(id){ return "//*[@data-glance-id='" + id + "']" }).join("|");
					return client['elements'].apply(glance, args);
				});
			});
		}, true);

		glance.addCommand('addElementLabel', function(lookup, label) {
			customLabels[label] = lookup;
		});

		glance.addCommand('getCustomLabeledElements', function(reference) {
			var labels = reference.split(">");

			var foundLabels = _.filter(labels, function(label) {
				return customLabels[label]
			});

			var labelLookup = {};
			if (foundLabels.length > 0) {
				return customLabels[foundLabels[0]].apply(this).then(function(element) {
					return this.getCustomElementIDs(element).then(function(xpath) {
						labelLookup[foundLabels[0]] = xpath;
						return labelLookup;
					});
				});
			}

			return [];
		});

		glance.addCommand("getCustomElementIDs", function(e) {
			var element = e.value || e;
			return client.execute(function(s) {
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
				return res.value;
			});
		});

		glance.addCommand("searchClient", function(selector, customLabels, multiple, retryCount) {
			return glance.execute(glanceFunc, selector, customLabels, multiple).then(function(res) {
				var val = res.value;

				//return client.log("browser").then(function(logs){
				//	console.log(logs.value.map(function(l){ return l.message}).join("\n"))

				if (val.notFound) {
					if (retryCount < 3) {
						++retryCount;
						return glance.pause(retryCount * 375).searchClient(selector, customLabels, multiple, retryCount);
					}
					else
						throw new Error("Element not found: " + selector);
				}

				if (multiple) {
					return val.ids;
				}
				else {
					if (val.ids.length > 1)
						throw new Error("Found " + val.ids.length + " duplicates for: " + selector)
					else
						return val.ids[0]
				}
				//});
			})
		});

		glance.addCommand("glanceElement", function(selector, customLabels, multiple) {
			return glance.searchClient(selector, customLabels, multiple, 0);
		});

		glance.addCommand('get', function(selector) {
			var strategies = require('../lib/get-strategies.js')

			var func = null;
			for (var i = strategies.length; i >= 0; --i) {
				func = function(glance, selector, s, func) {
					return function() {
						return s(glance, selector, customGets, func);
					}
				}(glance, selector, strategies[i], func);
			}

			return func();
		});

		glance.addCommand('addCustomGet', function(lookup, label) {
			customGets[label] = lookup;
		});

		glance.addCommand('set', function(selector, value) {
			var strategies = require('../lib/set-strategies.js')

			var func = null;
			for (var i = strategies.length; i >= 0; --i) {
				func = function(glance, selector, s, func) {
					return function() {
						return s(glance, selector, value, customSets, func);
					}
				}(glance, selector, strategies[i], func);
			}

			return func();
		});

		glance.addCommand('addCustomSet', function(lookup, label) {
			customSets[label] = lookup;
		});

		return glance;
	}
};