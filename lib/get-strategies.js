module.exports = [
	function custom(g, selector, customGets, next) {
		var custom;

		custom = customGets[selector]
		if (!custom) {
			var match = selector.match(/.+>(.+)$/);
			if (match) {
				var label = match[1]
				if (label)
					custom = customGets[label];
			}
		}

		if (custom) {
			return custom(selector.replace(/(.+)>.+$/, "$1"));
		}

		return next();
	},

	function value(g, selector, customGets, next) {
		if (selector == "value" || selector.match("value$") == "value") {
			selector = selector.replace(/>value$/, "");
			return g.getValue(selector);
		}

		return next();
	},

	function input(g, selector, customGets, next) {
		return g.getTagName(selector).then(function(tagName) {
			if (tagName === "input") {
				return g.getValue(selector);
			}

			return next();
		});
	},

	function select(g, selector, customGets, next) {
		return g.getTagName(selector).then(function(tagName) {
			if (tagName === "select") {
				return g.selectorExecute(selector, function(select) {
					var select = select[0];
					var i = select.selectedIndex;
					if (i == -1) return;

					return select.options[i].text;
				});
			}

			return next();
		});
	},

	function text(g, selector, next) {
		return g.getText(selector);
	}
];