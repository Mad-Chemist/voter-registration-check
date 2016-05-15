const Q = require('q');
const URL = "https://indianavoters.in.gov/PublicSite/Public/FT1/PublicLookupMain.aspx?Link=Registration";
const NAME = 'Indiana';
const INFO = {
	'county':'#ctl00_ContentPlaceHolder1_usrCounty_cboCounty',
	'firstName':'#ctl00_ContentPlaceHolder1_txtFirst',
	'lastName':'#ctl00_ContentPlaceHolder1_txtLast',
	'birthdate':'#ctl00_ContentPlaceHolder1_usrDOB_txtDate',
	'submit':'input[type="submit"]',
	'status':'#ctl00_ContentPlaceHolder1_lblStatus',
	'expectedStatus':'Registered'
};

var user = {
	'county': 'Knox',
	'firstName': 'John',
	'lastName': 'Gregg',
	'birthdate': '09/06/1954'
};

var verifyRegistration = function(client, user) {
	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
			.selectByVisibleText(INFO['county'], user['county'])
			.setValue(INFO['firstName'], user['firstName'])
			.setValue(INFO['lastName'], user['lastName'])
			.setValue(INFO['birthdate'], user['birthdate'])
			.click(INFO['submit'])
			.waitForExist(INFO['status'], 5000)
			.getText(INFO['status'])
			.then(function(value) {
				resolve(INFO['expectedStatus'] === value);
			});
	});
};

module.exports = {
	verifyRegistration:verifyRegistration,
	user:user,
	name:NAME
};
