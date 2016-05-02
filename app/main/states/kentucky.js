const Q = require('q');
const URL = "https://vrsws.sos.ky.gov/vic/";
const INFO = {
	'firstName':'#FIRST_NAME',
	'lastName':'#LAST_NAME',
	'birthdate':'#DATE_OF_BIRTH',
	'submit':'#submit',
	'status':'[name="ELIGIBLE FOR PRIMARY"]',
	'expectedStatus':'Yes'
};

var user = {
	"firstName":"Alison",
	"lastName":"Grimes",
	"birthdate":"11/23/1978"
};

var verifyRegistration = function(client, user) {
	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
			.setValue(INFO['firstName'], user['firstName'])
			.setValue(INFO['lastName'], user['lastName'])
			.setValue(INFO['birthdate'], user['birthdate'])
			.click(INFO['submit'])
			.waitForExist(INFO['status'], 5000)
			.getText(INFO['status'])
				.then(function(value) {
					resolve(INFO['expectedStatus'] === value.trim());
				});
	});
};

module.exports = {
	verifyRegistration:verifyRegistration
};
