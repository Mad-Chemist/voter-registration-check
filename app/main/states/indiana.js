var URL = "https://indianavoters.in.gov/PublicSite/Public/FT1/PublicLookupMain.aspx?Link=Registration";
var information = {
	'county':'#ctl00_ContentPlaceHolder1_usrCounty_cboCounty',
	'firstName':'#ctl00_ContentPlaceHolder1_txtFirst',
	'lastName':'#ctl00_ContentPlaceHolder1_txtLast',
	'birthdate':'#ctl00_ContentPlaceHolder1_usrDOB_txtDate',
	'submit':'input[type="submit"]',
	'status':'#ctl00_ContentPlaceHolder1_lblStatus',
	'expectedStatus':'Registered'
};

var verifyRegistration = function(client, userInfo) {
	return client
		.url(URL)
		.selectByVisibleText(information['county'], userInfo['county'])
		.setValue(information['firstName'], userInfo['firstName'])
		.setValue(information['lastName'], userInfo['lastName'])
		.setValue(information['birthdate'], userInfo['birthdate'])
		.click(information['submit'])
		.waitForExist(information['status'], 5000)
		.getText(information['status'])
		.then(function(value) {
			console.log(information['expectedStatus'] === value, value);
		});
};

module.exports = {
	verifyRegistration:verifyRegistration
};