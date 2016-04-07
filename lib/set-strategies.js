'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glance = require('./glance');

var _glance2 = _interopRequireDefault(_glance);

var _client = require('./client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(function (element) {
        return g.webdriver.execute(_client.getTagNameFromClient, element.value).then(function (res) {
            return res.value.toLowerCase();
        });
    });
}

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
        return Promise.resolve(custom(new _glance2.default(g), selector.replace(/(.+):.+$/, "$1"), value));
    }

    return Promise.reject();
}, function url(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: url");
    if (selector == "$url") {
        _loglevel2.default.debug("Setting url:", value);
        return g.webdriver.url(value);
    }

    return Promise.reject();
}, function select(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: select");
    var byValue = false;

    var data = g.parse(selector);

    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        byValue = true;
        _loglevel2.default.debug("selecting by value");
    } else {
        _loglevel2.default.debug("selecting by text");
    }

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
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
    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        return g.find(selector).then(function (wdioSelector) {
            return g.webdriver.setValue(wdioSelector, value);
        });
    }

    return Promise.reject();
}, function input(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: input");

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            _loglevel2.default.debug("Found tag name:", tagName);
            if (tagName === "input" || tagName === "textarea") {
                return g.webdriver.setValue(wdioSelector, value);
            }

            return Promise.reject();
        });
    });
}, function error(g, selector, value, customSets) {
    return g.find(selector).then(function () {
        _loglevel2.default.debug("No setter found for: " + selector);
        return Promise.reject("No setter found for: " + selector);
    }, function (err) {
        _loglevel2.default.debug("Can't set " + selector + " because " + err);
        return Promise.reject("Can't set because " + err);
    });
}];