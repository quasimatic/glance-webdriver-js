"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function tagElementWithID(elements, ids) {
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("data-glance-id", ids[i]);
    }
}

function emptyClientFunction() {}

function waitForChange(element, name) {
    return element.getAttribute(name);
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
    return document.location.href;
}

function getHTMLFromClient(element) {
    return element.outerHTML;
}

function getSelectTextFromClient(select) {
    var i = select.selectedIndex;
    if (i == -1) return;

    return select.options[i].text;
}

exports.emptyClientFunction = emptyClientFunction;
exports.getAttributeFromClient = getAttributeFromClient;
exports.getTagNameFromClient = getTagNameFromClient;
exports.getTextFromClient = getTextFromClient;
exports.getUrlFromClient = getUrlFromClient;
exports.getHTMLFromClient = getHTMLFromClient;
exports.getSelectTextFromClient = getSelectTextFromClient;
exports.waitForChange = waitForChange;
exports.tagElementWithID = tagElementWithID;
exports.GlanceSelector = GlanceSelector;
exports.default = GlanceSelector;