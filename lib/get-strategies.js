"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = require("loglevel");

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [function custom(g, selector, customGets) {
    var custom = customGets[selector];
    if (!custom) {
        var match = selector.match(/.+:(.+)$/);
        if (match) {
            var label = match[1];
            if (label) custom = customGets[label];
        }
    }

    if (custom) {
        return Promise.resolve(custom.call(g, selector.replace(/(.+):.+$/, "$1")));
    }

    return Promise.reject();
}, function url(g, selector, customGets) {
    _loglevel2.default.debug("Getter: url");
    if (selector == "$url") {
        _loglevel2.default.debug("Getting url");
        return g.webdriverio.getUrl();
    }

    _loglevel2.default.debug("Not getting url");

    return Promise.reject();
}, function html(g, selector, customGets) {
    var data = g.parse(selector);

    if (selector == "html" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("html") != -1) {
        selector = selector.replace(/:html$/, "");
        return g.convertGlanceSelector(selector).then(function (wdioSelector) {
            return g.webdriverio.getHTML(wdioSelector);
        });
    }

    return Promise.reject();
}, function value(g, selector, customGets) {
    var data = g.parse(selector);
    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        return g.convertGlanceSelector(selector).then(function (wdioSelector) {
            return g.webdriverio.getValue(wdioSelector);
        });
    }

    return Promise.reject();
}, function input(g, selector, customGets) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return g.webdriverio.getTagName(wdioSelector).then(function (tagName) {
            if (tagName === "input") {
                return g.webdriverio.getValue(wdioSelector);
            }

            return Promise.reject();
        });
    });
}, function select(g, selector, customGets) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return g.webdriverio.getTagName(wdioSelector).then(function (tagName) {
            if (tagName === "select") {
                return g.webdriverio.selectorExecute(wdioSelector, function (select) {
                    var select = select[0];
                    var i = select.selectedIndex;
                    if (i == -1) return;

                    return select.options[i].text;
                });
            }

            return Promise.reject();
        });
    });
}, function text(g, selector, next) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return g.webdriverio.getText(wdioSelector);
    });
}];