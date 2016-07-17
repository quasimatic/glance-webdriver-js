import * as wdio from 'webdriverio';
import {tagElementWithID} from '../utils/client'
import shortid from 'shortid';

class WebdriverIOAdapter {
    constructor(config) {
        this.driver = wdio.remote(config);
    }

    init() {
        return this.driver.init().catch(function (error) {
            console.log(error)
            return Promise.reject(error);
        });
    }

    elementReference(element) {
        return this.execute(tagElementWithID, element, shortid.generate()).then(function (id) {
            return `[data-glance-id="${id}"]`;
        });
    }

    getUrl(address) {
        return this.driver.url();
    }

    setUrl(address) {
        return this.driver.url(address);
    }

    type(keys) {
        return this.driver.keys(keys);
    }

    click(element) {
        return this.elementReference(element).then(reference => this.driver.click(reference));
    }

    doubleClick(element) {
        return this.elementReference(element).then(reference => this.driver.doubleClick(reference));
    }

    middleClick(element) {
        return this.elementReference(element).then(reference => this.driver.middleClick(reference));
    }

    moveMouseTo(element, xOffset, yOffset) {
        return this.elementReference(element).then(reference => this.driver.moveToObject(reference, xOffset, yOffset));
    }

    rightClick(elementReference) {
        return this.elementReference(element).then(reference => this.driver.rightClick(reference));
    }

    mouseDown(button) {
        button = button || 0;
        return this.driver.buttonDown(button);
    }

    mouseUp(button) {
        button = button || 0;
        return this.driver.buttonUp(button);
    }

    execute(func, ...args) {
        return this.driver.execute.apply(this.driver, [func].concat(args)).then(res => res.value)
    }

    executeAsync(func, ...args) {
        return this.driver.executeAsync.apply(this.driver, [func].concat(args)).then(res => res.value);
    }

    dragAndDrop(elementReferenceSource, elementReferenceTarget, xOffset, yOffset) {
        if (this.driver.isMobile) {
            return this.driver.getLocation(elementReferenceSource).then(
                (location) => this.driver.touchDown(location.x, location.y)
            ).getLocation(elementReferenceTarget).then(
                (location) => this.driver.touchMove(location.x, location.y).touchUp(location.x, location.y)
            );
        }

        return this.driver.moveToObject(elementReferenceSource).buttonDown().moveToObject(elementReferenceTarget, xOffset, yOffset).buttonUp();
    }

    pause(delay) {
        return this.driver.pause(delay);
    }

    saveScreenshot(filename) {
        return this.driver.saveScreenshot(filename);
    }

    end() {
        return this.driver.end();
    }

    find(reference) {
        return this.element(reference);
    }

    element(reference) {
        return this.driver.element(reference).then(res => res.value);
    }

    elements(reference) {
        return this.driver.elements(reference).then(res => res.value);
    }

    getValue(element) {
        return this.elementReference(element).then(reference => this.driver.getValue(reference));
    }

    setValue(element, ...values) {
        return this.elementReference(element).then(reference => this.driver.setValue(reference, ...values));
    }

    getTitle() {
        return this.driver.getTitle();
    }

    log(type) {
        return this.driver.log(type);
    }
}

export default WebdriverIOAdapter;