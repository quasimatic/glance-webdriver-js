"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = require("loglevel");

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [function custom(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: custom");
    var custom;

    custom = customSets[selector];
    if (!custom) {
        var match = selector.match(/.+:(.+)$/);
        if (match) {
            var label = match[1];
            if (label) custom = customSets[label];
        }
    }

    if (custom) {
        return Promise.resolve(custom.call(g, selector.replace(/(.+):.+$/, "$1"), value));
    }

    return Promise.reject();
}, function select(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: select");
    var byValue = false;

    var data = g.parse(selector);
    if (selector == "value" || data.containers[data.containers.length - 1].transform == "value") {
        selector = selector.replace(/:value$/, "");
        byValue = true;
        _loglevel2.default.debug("selecting by value");
    } else {
        _loglevel2.default.debug("selecting by text");
    }

    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return g.webdriverio.getTagName(wdioSelector).then(function (tagName) {
            _loglevel2.default.debug("Found tag:", tagName);
            if (tagName === "select") {
                if (byValue) {
                    return this.selectByValue(wdioSelector, value);
                }

                return this.selectByVisibleText(wdioSelector, value);
            }

            _loglevel2.default.debug("not a select");

            return Promise.reject();
        });
    }).catch(function () {
        _loglevel2.default.debug("Select not found:", selector);
        return Promise.reject();
    });
}, function value(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: value");
    var data = g.parse(selector);
    if (selector == "value" || data.containers[data.containers.length - 1].transform == "value") {
        selector = selector.replace(/:value$/, "");
        return g.convertGlanceSelector(selector).then(function (wdioSelector) {
            return g.webdriverio.setValue(wdioSelector, value);
        });
    }

    return Promise.reject();
}, function input(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: input");

    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return g.webdriverio.getTagName(wdioSelector).then(function (tagName) {
            _loglevel2.default.debug("Found tag name:", tagName);
            if (tagName === "input") {
                return g.webdriverio.setValue(wdioSelector, value);
            }

            return Promise.reject();
        });
    });
}, function error(g, selector, value, customSets) {
    _loglevel2.default.debug('Can\'t find a setter for: "' + selector + '"');
    return Promise.reject("Element not found: " + selector);
}];