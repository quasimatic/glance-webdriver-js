import log from 'loglevel';

import {getTagNameFromClient, getTextFromClient, getUrlFromClient, getHTMLFromClient, getSelectTextFromClient} from './client';

function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getTagNameFromClient, element.value)
            .then(res => res.value.toLowerCase())
    });
}

function getText(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getTextFromClient, element.value)
            .then(res => res.value)
    });
}

function getUrl(g) {
    return g.webdriver.execute(getUrlFromClient).then(res => res.value)
}

function getHTML(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getHTMLFromClient, element.value)
            .then(res => res.value)
    });
}

export default [
    function custom(g, selector, customGets) {
        var custom = customGets[selector]
        if (!custom) {
            var match = selector.match(/.+:(.+)$/);
            if (match) {
                var label = match[1]
                if (label)
                    custom = customGets[label];
            }
        }

        if (custom) {
            return Promise.resolve(custom.call(g, selector.replace(/(.+):.+$/, "$1")))
        }

        return Promise.reject();
    },

    function url(g, selector, customGets) {
        log.debug("Getter: url")
        if (selector == "$url") {
            log.debug("Getting url")
            return getUrl(g);
        }

        log.debug("Not getting url")

        return Promise.reject()
    },

    function html(g, selector, customGets) {
        var data = g.parse(selector);

        if (selector == "html" || (data[data.length-1].modifiers && data[data.length-1].modifiers.indexOf("html") != -1)) {
            selector = selector.replace(/:html$/, "");
            return g.find(selector).then((wdioSelector)=> {
                return getHTML(g, wdioSelector)
            });
        }

        return Promise.reject();
    },

    function value(g, selector, customGets) {
        var data = g.parse(selector);
        if (selector == "value" || (data[data.length-1].modifiers && data[data.length-1].modifiers.indexOf("value") != -1)) {
            selector = selector.replace(/:value$/, "");
            return g.find(selector).then((wdioSelector)=> g.webdriver.getValue(wdioSelector));
        }

        return Promise.reject();
    },

    function input(g, selector, customGets) {
        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                if (tagName === "input") {
                    return g.webdriver.getValue(wdioSelector);
                }

                return Promise.reject();
            });
        });
    },

    function select(g, selector, customGets) {
        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                if (tagName === "select") {
                    return g.webdriver.element(wdioSelector).then(res => {
                        return g.webdriver.execute(getSelectTextFromClient, res.value)
                            .then(res => res.value)
                    });
                }

                return Promise.reject();
            });
        });
    },

    function text(g, selector, next) {
        return g.find(selector).then((wdioSelector)=> getText(g, wdioSelector));
    }
];