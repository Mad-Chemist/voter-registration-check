 /*
  * Made to accept userInfo input and state vars, and pass them along to dynamically run selenium script
  */

'use strict';

const selenium = require('selenium-standalone');
const webdriverio = require('webdriverio');
var phantomPath = require('phantomjs-prebuilt').path;

// TODO: Simplify structure below

var seleniumCallback = function(error, child, state, userInfo, callback) {
	if (error) {
		var errMsg = error.toString();
		callback('display-error', errMsg);

		if (child) {
			child.kill();
		}
	}
	else {
		try {
			var options = { desiredCapabilities: { browserName: 'phantomjs' } };
			var client = webdriverio.remote(options);
			var promise = state.verifyRegistration(client.init(), userInfo);

			promise.then(function(status) {
				callback('display-status', status);

				client.endAll()
					.then(function() {
						child.kill();
					});
			});

		} catch (error) {
			callback('display-error', error);

			if (child) {
				child.kill();
			}
		}
	}
};

var seleniumSetup = function(submittedUserInfo, callback) {
	var complete = function() {
		if (!submittedUserInfo || typeof submittedUserInfo['state'] !== "string") {
			throw new Error("Cannot look voter up if no submittedUserInfo provided.");
		}

		// Dynamically pulls from states
		var state = require('./states/' +submittedUserInfo['state'].toLowerCase());

		// This path may need to be tweaked in built app, not positive
		selenium.start({
			seleniumArgs: ["-Dphantomjs.binary.path=" + phantomPath]
		}, function(error, child) {
			// TODO, try to minimize complexity of what is being passed here
			seleniumCallback(error, child, state, submittedUserInfo, callback);
		});
	};

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
};

module.exports = {
	init: seleniumSetup
};