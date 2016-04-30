var state = require('./states/indiana.js');
var selenium = require('selenium-standalone');
var webdriverio = require('webdriverio');

var userInfo = {
	'county':'Knox',
	'firstName':'John',
	'lastName':'Gregg',
	'birthdate':'09/06/1954'
};


var seleniumCallback = function(error, child) {
	if (error) {
		console.error(error);
	}

	try {
		var options = { desiredCapabilities: { browserName: 'chrome' } };
		var client = webdriverio.remote(options);
		
		state.verifyRegistration(client.init(), userInfo)
			.end()
			.then(function() {
				child.kill();
			});

	} catch (error) {
		console.log(error);
	}
};

selenium.install({
	baseURL: 'https://selenium-release.storage.googleapis.com',
	drivers: {
		chrome: {
			arch: process.arch,
			baseURL: 'https://chromedriver.storage.googleapis.com'
		}
	}
}, function() {
	selenium.start(seleniumCallback);
});
