import log from 'loglevel';
import Glance from "./glance";
import {getTagNameFromClient} from './client';

function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getTagNameFromClient, element.value)
            .then(res => res.value.toLowerCase())
    });
}

export default [
    function custom(g, selector, value, customSets) {
        log.debug("Setter: custom");
        var custom;

        custom = customSets[selector]
        if (!custom) {
            var match = selector.match(/.+:(.+)$/);
            if (match) {
                var label = match[1];
                if (label)
                    custom = customSets[label];
            }
        }

        if (custom) {
            return Promise.resolve(custom(new Glance(g), selector.replace(/(.+):.+$/, "$1"), value));
        }

        return Promise.reject();
    },

    function url(g, selector, value, customSets) {
        log.debug("Setter: url");
        if (selector == "$url") {
            log.debug("Setting url:", value)
            return g.webdriver.url(value);
        }

        return Promise.reject()
    },

    function select(g, selector, value, customSets) {
        log.debug("Setter: select");
        var byValue = false;

        var data = g.parse(selector);

        if (selector == "value" || (data[data.length-1].modifiers && data[data.length-1].modifiers.indexOf("value") != -1)) {
            selector = selector.replace(/:value$/, "");
            byValue = true;
            log.debug("selecting by value")
        }
        else {
            log.debug("selecting by text")
        }
        
        return g.find(selector).then(function(wdioSelector) {
            return getTagName(g, wdioSelector).then(function(tagName) {
                log.debug("Found tag:", tagName)

                if (tagName === "select") {
                    if (byValue) {
                        return this.selectByValue(wdioSelector, value)
                    }

                    return this.selectByVisibleText(wdioSelector, value);
                }

                log.debug("not a select")

                return Promise.reject();
            })
        }).catch(function() {
            log.debug("Select not found:", selector)
            return Promise.reject();
        });
    },

    function value(g, selector, value, customSets) {
        log.debug("Setter: value");
        var data = g.parse(selector);
        if (selector == "value" || (data[data.length-1].modifiers && data[data.length-1].modifiers.indexOf("value") != -1)) {
            selector = selector.replace(/:value$/, "");
            return g.find(selector).then((wdioSelector)=> g.webdriver.setValue(wdioSelector, value));
        }

        return Promise.reject();
    },

    function input(g, selector, value, customSets) {
        log.debug("Setter: input");

        return g.find(selector).then((wdioSelector)=> {
            return getTagName(g, wdioSelector).then(function(tagName) {
                log.debug("Found tag name:", tagName)
                if (tagName === "input" || tagName === "textarea") {
                    return g.webdriver.setValue(wdioSelector, value)
                }

                return Promise.reject();
            })
        })
    },

    function error(g, selector, value, customSets) {
        return g.find(selector).then(function(){
            log.debug("No setter found for: " + selector)
            return Promise.reject("No setter found for: " + selector);
        },
        function (err) {
            log.debug("Can't set " + selector + " because " + err)
            return Promise.reject("Can't set because " + err)
        });
    }
];