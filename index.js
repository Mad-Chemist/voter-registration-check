var selenium = require('selenium-standalone');
var webdriverio = require('webdriverio');

var userInfo = {
	'county':'Knox',
	'firstName':'John',
	'lastName':'Gregg',
	'birthdate':'09/06/1954'
};

var indianaInformation = {
	'county':'#ctl00_ContentPlaceHolder1_usrCounty_cboCounty',
	'firstName':'#ctl00_ContentPlaceHolder1_txtFirst',
	'lastName':'#ctl00_ContentPlaceHolder1_txtLast',
	'birthdate':'#ctl00_ContentPlaceHolder1_usrDOB_txtDate',
	'submit':'input[type="submit"]',
	'status':'#ctl00_ContentPlaceHolder1_lblStatus',
	'expectedStatus':'Registered'
};

var seleniumCallback = function(error, child) {
	if (error) {
		console.error(error);
	}

	try {
		var options = { desiredCapabilities: { browserName: 'chrome' } };
		var client = webdriverio.remote(options);

		client
			.init()
			.url("https://indianavoters.in.gov/PublicSite/Public/FT1/PublicLookupMain.aspx?Link=Registration")
			.selectByVisibleText(indianaInformation['county'], userInfo['county'])
			.setValue(indianaInformation['firstName'], userInfo['firstName'])
			.setValue(indianaInformation['lastName'], userInfo['lastName'])
			.setValue(indianaInformation['birthdate'], userInfo['birthdate'])
			.click(indianaInformation['submit'])
			.waitForExist(indianaInformation['status'], 5000)
			.getText(indianaInformation['status'])
			.then(function(value) {
				console.log(indianaInformation['expectedStatus'] === value, value);
			})
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
