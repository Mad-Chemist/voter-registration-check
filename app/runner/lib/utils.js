"use strict";

const _ = require('lodash');
const By = require('selenium-webdriver').By;

let utils = {
	_init: function() {
		_.bindAll(this, 'find', 'findElement', 'goTo', 'setValue', 'waitForElement');
	},
	find: function(selector, method) {
		method = (typeof method === "string" && typeof By[method] === "function") ? method : "css";
		return By[method](selector);
	},
	findElement: function(driver, selector, method) {
		let ele = this.find(selector, method);
		return driver.findElement(ele);
	},
	goTo: function(driver, url) {
		return driver.get(url);
	},
	setValue: function(driver, selector, value) {
		// var ele = driver.findElement(driver.by.cssSelector(selector));
		// ele.sendKeys('value', value);
		// driver.executeScript("arguments[0].setAttribute('value', arguments[1]);", ele, value);
		return driver.executeScript("document.querySelectorAll(arguments[0])[0].value = arguments[1]", selector, value);
	},
	waitForElement: function(driver, selector) {
		let ele = this.find(selector);
		let till = function() {
			return driver.isElementPresent(ele);
		};

		return driver.wait(till, 5000);
	}
};

utils._init();

module.exports = utils;
