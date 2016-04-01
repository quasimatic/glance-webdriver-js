'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _client = require('./client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTagName(g, elementReference) {
    return g.browser.element(elementReference).then(function (element) {
        return g.browser.execute(_client.getTagNameFromClient, element.value).then(function (res) {
            return res.value.toLowerCase();
        });
    });
}

function getText(g, elementReference) {
    return g.browser.element(elementReference).then(function (element) {
        return g.browser.execute(_client.getTextFromClient, element.value).then(function (res) {
            return res.value;
        });
    });
}

function getUrl(g) {
    return g.browser.execute(_client.getUrlFromClient).then(function (res) {
        return res.value;
    });
}

function getHTML(g, elementReference) {
    return g.browser.element(elementReference).then(function (element) {
        return g.browser.execute(_client.getHTMLFromClient, element.value).then(function (res) {
            return res.value;
        });
    });
}

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
        return getUrl(g);
    }

    _loglevel2.default.debug("Not getting url");

    return Promise.reject();
}, function html(g, selector, customGets) {
    var data = g.parse(selector);

    if (selector == "html" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("html") != -1) {
        selector = selector.replace(/:html$/, "");
        return g.convertGlanceSelector(selector).then(function (wdioSelector) {
            return getHTML(g, wdioSelector);
        });
    }

    return Promise.reject();
}, function value(g, selector, customGets) {
    var data = g.parse(selector);
    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        return g.convertGlanceSelector(selector).then(function (wdioSelector) {
            return g.browser.getValue(wdioSelector);
        });
    }

    return Promise.reject();
}, function input(g, selector, customGets) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            if (tagName === "input") {
                return g.browser.getValue(wdioSelector);
            }

            return Promise.reject();
        });
    });
}, function select(g, selector, customGets) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            if (tagName === "select") {
                return g.browser.element(wdioSelector).then(function (res) {
                    return g.browser.execute(_client.getSelectTextFromClient, res.value).then(function (res) {
                        return res.value;
                    });
                });
            }

            return Promise.reject();
        });
    });
}, function text(g, selector, next) {
    return g.convertGlanceSelector(selector).then(function (wdioSelector) {
        return getText(g, wdioSelector);
    });
}];