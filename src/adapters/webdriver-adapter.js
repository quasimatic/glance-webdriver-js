import Webdriver from 'selenium-webdriver';
import {By, until} from 'selenium-webdriver';
import fs from 'fs';

class WebdriverAdapter {
	constructor(config) {
		this.config = config;
		this.driver = new Webdriver.Builder()
		//
		// Need to parse out the browser
		//
			.forBrowser(config.desiredCapabilities.browserName)
			.usingServer('http://localhost:' + config.port + '/wd/hub')
			.build();
	}

	init() {
	}

	getUrl(address) {
		return this.driver.getCurrentUrl();
	}

	setUrl(address) {
		return this.driver.get(address);
	}

	getTabs() {
		return this.driver.getAllWindowHandles();
	}

	getActiveTab() {
		return this.driver.getWindowHandle();
	}

	setActiveTab(id) {
		return this.driver.switchTo().window(id);
	}

	closeTab(id) {
		if (id) {
			return this.driver.switchTab(id).then(result => {
				return this.driver.close();
			});
		}
		else {
			return this.driver.close();
		}
	}

	type(keys) {
		return this.driver.keys(keys.split(''));
	}

	sendKeys(...keys) {
		return this.driver.actions().sendKeys(...keys).perform();
	}

	click(element) {
		return element.click();
	}

	doubleClick(element) {
		return element.doubleClick();
	}

	middleClick(element) {
	}

	moveMouseTo(element, xOffset, yOffset) {
		console.log('Move Mouse:', element);
		if (xOffset || yOffset)
			return this.driver.actions().mouseMove(element, {x: xOffset, y: yOffset}).perform();
		else
			return this.driver.actions().mouseMove(element).perform();
	}

	rightClick(element) {
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
		return this.driver.executeScript.apply(this.driver, [func].concat(args));
	}

	executeAsync(func, ...args) {
		return this.driver.executeAsyncScript.apply(this.driver, [func].concat(args));
	}

	dragAndDrop(elementSource, elementTarget, xOffset, yOffset) {
		return this.driver.dragAndDrop(elementSource, elementTarget);
	}

	pause(delay) {
		return this.driver.sleep(delay);
	}

	saveScreenshot(filename) {
		return this.driver.takeScreenshot().then(function(data) {
			fs.writeFile(filename, data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
				if (err) throw err;
			});
		});
	}

	end() {
		return this.driver.quit();
	}

	find(reference) {
		return this.element(reference);
	}

	element(reference) {
		//
		// Needs to check for xpath
		//
		return this.driver.findElement(By.css(reference));
	}

	elements(reference) {
		return this.driver.findElements(By.css(reference));
	}

	getValue(element) {
		return element.getAttribute("value");
	}

	setValue(element, ...values) {
		return element.sendKeys(...values);
	}

	getTitle() {
		return this.driver.getTitle();
	}

	log(type) {
		return this.driver.log(type);
	}

	setWindowSize(size) {
		return this.driver.windowHandleSize(size);
	}

	getWindowSize() {
		return this.driver.windowHandleSize();
	}

	maximize() {
		return this.driver.windowHandleMaximize();
	}

	scroll(element) {
	}
}

export default WebdriverAdapter;
