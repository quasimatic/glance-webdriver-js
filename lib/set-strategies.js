module.exports = [
	function custom(g, selector, value, customSets, next) {
		var custom;

		custom = customSets[selector]
		if (!custom) {
			var match = selector.match(/.+>(.+)$/);
			if (match) {
				var label = match[1];
				if (label)
					custom = customSets[label];
			}
		}

		if (custom) {
			return custom(selector.replace(/(.+)>.+$/, "$1"), value);
		}

		return next();
	},

	function select(g, selector, value, customSets, next) {
		var byValue = false;
		if (selector == "value" || selector.match("value$") == "value") {
			selector = selector.replace(/>value$/, "");
			byValue = true;
		}

		return g.getTagName(selector).then(function(tagName) {
			if (tagName === "select") {
				if (byValue)
					return g.selectByValue(selector, value);

				return g.selectByVisibleText(selector, value);
			}

			return next();
		});
	},

	function value(g, selector, value, customSets, next) {
		if (selector == "value" || selector.match("value$") == "value") {
			selector = selector.replace(/>value$/, "");
			return g.setValue(selector, value);
		}

		return next();
	},

	function input(g, selector, value, customSets, next) {
		return g.getTagName(selector).then(function(tagName) {
			if (tagName === "input") {
				return g.setValue(selector, value);
			}

			return next();
		});
	},

	function text(g, selector, value, customSets, next) {
		throw new Error(selector + " text not changable");
	}
];