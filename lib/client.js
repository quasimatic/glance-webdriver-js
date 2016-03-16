"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (selector, customLabels, multiple, logLevel) {
	glanceSelector.addCustomLabels(customLabels);
	return glanceSelector(selector);
};