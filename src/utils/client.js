function tagElementWithID(elements, ids) {
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("data-glance-id", ids[i]);
    }
}

function waitForChange(element, name) {
    return element.getAttribute(name)
}

function GlanceSelector(selector, customLabels, multiple, logLevel) {
    glanceSelector.setLogLevel(logLevel);
    return glanceSelector(selector, {
        preload: {
            labels: customLabels
        }
    });
}

function getAttributeFromClient(element, name) {
    return element.getAttribute(name);
}

function addPropertiesToBrowser(propertyString) {
    function functionReviver(key, value) {
        if (key === "") return value;
        if (typeof value === 'string') {
            var startOfFunc = /^function[^\(]*\(([^\)]*)\)[^\{]*\{/;
            var match = value.match(startOfFunc);

            if (match) {
                var args = match[1].split(',').map(function (arg) {
                    return arg.replace(/\s+/, '');
                });
                return new Function(args, value.replace(startOfFunc, '').replace(/\}$/, ''));
            }
        }

        return value;
    }

    var properties = JSON.parse(propertyString, functionReviver);
    glanceSelector.addExtension({
        properties: properties
    });
}

function serializeBrowserSideProperties(properties) {
    function functionReplacer(key, value) {
        if (typeof(value) === 'function') {
            return value.toString();
        }
        return value;
    }

    var browserSideProperties = Object.keys(properties).reduce((o, k) => {
        if (properties[k].browser) {
            o[k] = properties[k];
        }
        return o;
    }, {});

    return JSON.stringify(browserSideProperties, functionReplacer);
}

function getTagNameFromClient(element) {
    return element.tagName;
}

function getTextFromClient(element) {
    return element.textContent;
}

function getUrlFromClient() {
    return document.location.href
}

function getHTMLFromClient(element) {
    return element.outerHTML;
}

function getSelectTextFromClient(select) {
    var i = select.selectedIndex;
    if (i == -1) return;

    return select.options[i].text;
}

function checkGlanceSelector() {
    return typeof(glanceSelector) != 'undefined';
}

export {
    checkGlanceSelector,
    addPropertiesToBrowser,
    serializeBrowserSideProperties,
    getAttributeFromClient,
    getTagNameFromClient,
    getTextFromClient,
    getUrlFromClient,
    getHTMLFromClient,
    getSelectTextFromClient,
    waitForChange,
    tagElementWithID,
    GlanceSelector
}