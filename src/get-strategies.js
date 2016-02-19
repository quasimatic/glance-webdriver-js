import log from 'loglevel';

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

    function pageTitle(g, selector, customGets) {
        log.debug("Getter: pageTitle")
        if (selector == "$TITLE$") {
            log.debug("Getting Title")
            return g.webdriverio.getTitle();
        }

        log.debug("Not getting title")

        return Promise.reject()
    },

    function html(g, selector, customGets) {
        var data = g.parse(selector);

        if (selector == "html" || data.containers[data.containers.length-1].transform == "html") {
            selector = selector.replace(/:html$/, "");
            return g.convertGlanceSelector(selector).then((wdioSelector)=> g.webdriverio.getHTML(wdioSelector));
        }

        return Promise.reject();
    },

    function value(g, selector, customGets) {
        var data = g.parse(selector);
        if (selector == "value" || data.containers[data.containers.length-1].transform == "value") {
            selector = selector.replace(/:value$/, "");
            return g.convertGlanceSelector(selector).then((wdioSelector)=> g.webdriverio.getValue(wdioSelector));
        }

        return Promise.reject();
    },

    function input(g, selector, customGets) {
        return g.convertGlanceSelector(selector).then((wdioSelector)=> {
            return g.webdriverio.getTagName(wdioSelector).then(function(tagName) {
                if (tagName === "input") {
                    return g.webdriverio.getValue(wdioSelector);
                }

                return Promise.reject();
            });
        });
    },

    function select(g, selector, customGets) {
        return g.convertGlanceSelector(selector).then((wdioSelector)=> {
            return g.webdriverio.getTagName(wdioSelector).then(function(tagName) {
                if (tagName === "select") {
                    return g.webdriverio.selectorExecute(wdioSelector, function(select) {
                        var select = select[0];
                        var i = select.selectedIndex;
                        if (i == -1) return;

                        return select.options[i].text;
                    });
                }

                return Promise.reject();
            });
        });
    },

    function text(g, selector, next) {
        return g.convertGlanceSelector(selector).then((wdioSelector)=> g.webdriverio.getText(wdioSelector));
    }
];