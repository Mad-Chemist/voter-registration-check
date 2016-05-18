"use strict";

const webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
	.usingServer('http://localhost:9515')
	.withCapabilities({
		chromeOptions: {
			binary: './node_modules/.bin/electron'
		}
	})
	.forBrowser('electron')
	.build();

var done = function() {
	if (driver && driver.close && driver.quit) {
		driver.close();
		driver.quit();
	}
};

var start = function(voterInfo, callback) {
	try {
		if (!voterInfo || typeof voterInfo.state !== "string" || typeof callback !== "function") {
			throw new Error("Invalid arguments passed to run-selenium.start.  voterInfo<ob>, voterInfo.state<st>, callback<fx> are required.");
		}

		let state = require('./states/' + voterInfo.state.toLowerCase());

		state.verifyRegistration(driver, voterInfo)
			.then(function(status) {
				callback('display-status', status);
				done();
			})
			.fail(function(err) {
				let msg = (typeof err === "string") ? err : err.toString();
				console.error('Failed verifyRegistration:', msg, err);
				callback('display-error', msg);
				done();
			})
			.done();
	}
	catch (err) {
		let msg = (typeof err === "string") ? err : err.toString();
		console.error('Caught:', msg, err);
		if (callback) {
			callback('display-error', msg);
		}
		done();
	}
}

module.exports = {
	init: start
};
