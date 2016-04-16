function tagElementWithID(elements, ids) {
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("data-glance-id", ids[i]);
    }
}

function waitForChange(element, name) {
    return element.getAttribute(name)
}

function GlanceSelector(selector, customLabels, multiple, logLevel) {
    glanceSelector.addCustomLabels(customLabels);
    glanceSelector.setLogLevel(logLevel);
    return glanceSelector(selector);
}

function getAttributeFromClient(element, name) {
    return element.getAttribute(name);
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

export {getAttributeFromClient};
export {getTagNameFromClient};
export {getTextFromClient};
export {getUrlFromClient};
export {getHTMLFromClient};
export {getSelectTextFromClient};

export {waitForChange};
export {tagElementWithID};
export {GlanceSelector};

export default GlanceSelector