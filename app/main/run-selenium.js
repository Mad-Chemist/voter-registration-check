 /*
  * Made to accept userInfo input and state vars, and pass them along to dynamically run selenium script
  */

'use strict';

const selenium = require('selenium-standalone');
const webdriverio = require('webdriverio');
var phantomPath = require('phantomjs-prebuilt').path;

var seleniumSetup = function(voterInfo, callback) {
	if (!voterInfo || typeof voterInfo['state'] !== "string" || typeof callback !== "function") {
		throw new Error("Cannot look voter up if no voterInfo or callback provided.");
	}

	var seleniumRunner = {
		install: function() {
			// Runs selenium.install, then triggers start
			var complete = seleniumRunner.start;
			var settings = {
				baseURL: 'https://selenium-release.storage.googleapis.com',
				drivers: {
					chrome: {
						arch: process.arch,
						baseURL: 'https://chromedriver.storage.googleapis.com'
					},
					ie: {
						arch: process.arch,
						baseURL: 'https://selenium-release.storage.googleapis.com'
					}
				}
			};

			selenium.install(settings, complete);
		},
		start: function() {
			// Runs selenium.start, then hooks into afterStart
			var afterStart = seleniumRunner.afterStart;
			selenium.start(afterStart);
		},
		error: function(error, child) {
			// If error occurs during start, show error and kill child
			if (typeof error !== "string") {
				error = error.toString();
			}

			if (child) {
				child.kill();
			}

			callback('display-error', error);
			return error;
		},
		afterStart: function(error, child) {
			// After starting selenium, try to run chosen state's script
			if (error) {
				seleniumRunner.error(error, child);
			}
			else {
				try {
					var state = require('./states/' + voterInfo['state'].toLowerCase()); // Dynamically pulls from states
					var client = webdriverio.remote({
						'desiredCapabilities': { 
							'browserName': 'phantomjs',
							'phantomjs.binary.path': phantomPath
						} 
					});
					
					state.verifyRegistration(client.init(), voterInfo)
						.then(function(status) {
							callback('display-status', status);
							client.endAll()
								.then(function() {
									child.kill();
								});
						});
				}
				catch (error) {
					seleniumRunner.error(error, child);
				}
			}	
		}
	};

	return seleniumRunner.install();
};

module.exports = {
	init: seleniumSetup
};