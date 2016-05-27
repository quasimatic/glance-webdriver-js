import log from 'loglevel';

import {getTagNameFromClient, getTextFromClient, getUrlFromClient, getSelectTextFromClient, getAttributeFromClient} from '../utils/client';

function getTagName(g, elementReference) {
    return g.browser.element(elementReference).then(element => {
        return g.browser.execute(getTagNameFromClient, element.value)
            .then(res => res.value.toLowerCase())
    });
}

function getText(g, elementReference) {
    return g.browser.element(elementReference).then(element => {
        return g.browser.execute(getTextFromClient, element.value)
            .then(res => res.value)
    });
}

function getUrl(g) {
    return g.browser.execute(getUrlFromClient).then(res => res.value)
}

function getAttribute(g, elementReference, name) {
    return g.browser.element(elementReference).then(element => {
        return g.browser.execute(getAttributeFromClient, element.value, name)
            .then(res => res.value.toLowerCase())
    });
}

export default [
    function url(g, selector, customGets) {
        log.debug("Getter: url")
        if (selector == "$url") {
            log.debug("Getting url")
            return getUrl(g);
        }

        log.debug("Not getting url")

        return Promise.reject()
    },
    
    function checkbox(g, selector) {
        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                return getAttribute(g, wdioSelector, "type").then(function(attributeType) {
                    if (tagName === "input" && attributeType === "checkbox") {
                        return g.driver.isSelected(wdioSelector)
                    }

                    return Promise.reject();
                })
            })
        })
    },

    function input(g, selector, customGets) {
        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                if (tagName === "input") {
                    return g.browser.getValue(wdioSelector);
                }

                return Promise.reject();
            });
        });
    },

    function select(g, selector, customGets) {
        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                if (tagName === "select") {
                    return g.browser.element(wdioSelector).then(res => {
                        return g.browser.execute(getSelectTextFromClient, res.value)
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