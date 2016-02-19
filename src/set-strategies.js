import log from 'loglevel';

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
            return Promise.resolve(custom.call(g, selector.replace(/(.+):.+$/, "$1"), value));
        }

        return Promise.reject();
    },

    function select(g, selector, value, customSets) {
        log.debug("Setter: select");
        var byValue = false;
        if (selector == "value" || selector.match(":value$") == ":value") {
            selector = selector.replace(/:value$/, "");
            byValue = true;
            log.debug("selecting by value")
        }
        else {
            log.debug("selecting by text")
        }

        return g.convertGlanceSelector(selector).then(function(wdioSelector) {
            return g.webdriverio.getTagName(wdioSelector).then(function(tagName) {
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
        if (selector == "value" || selector.match(":value$") == ":value") {
            selector = selector.replace(/:value$/, "");
            return g.convertGlanceSelector(selector).then((wdioSelector)=> g.webdriverio.setValue(wdioSelector, value));
        }

        return Promise.reject();
    },

    function input(g, selector, value, customSets) {
        log.debug("Setter: input");

        return g.convertGlanceSelector(selector).then((wdioSelector)=> {
            return g.webdriverio.getTagName(wdioSelector).then(function(tagName) {
                log.debug("Found tag name:", tagName)
                if (tagName === "input") {
                    return g.webdriverio.setValue(wdioSelector, value)
                }

                return Promise.reject();
            })
        })
    },

    function error(g, selector, value, customSets) {
        log.debug('Can\'t find a setter for: "' + selector + '"')
        return Promise.reject("Element not found: " + selector);
    }
];