 /*
  * Made to accept userInfo input and state vars, and pass them along to dynamically run selenium script
  */

'use strict';

const state = require('./states/indiana.js');
const selenium = require('selenium-standalone');
const webdriverio = require('webdriverio');
var phantomPath = require('phantomjs-prebuilt').path;

var userInfo = {
	'county': 'Knox',
	'firstName': 'John',
	'lastName': 'Gregg',
	'birthdate': '09/06/1954'
};

var seleniumCallback = function(error, child, callback) {
	if (error) {
		console.error(error);
	}

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
		console.log('Error ~ ', error);
		if (child) {
			child.kill();
		}
	}
};

var seleniumSetup = function(state, submittedUserInfo, callback) {
	var complete = function() {
		if (submittedUserInfo) {
			userInfo = submittedUserInfo;
		}

		selenium.start({
			seleniumArgs: ["-Dphantomjs.binary.path=" + phantomPath]
		},
		function(error, child) {
			seleniumCallback(error, child, callback);
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