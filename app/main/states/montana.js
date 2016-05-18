const Q = require('q');
const URL = "https://app.mt.gov/cgi-bin/voterinfo/voterinfo.cgi";
const NAME = 'Montana';
const INFO = {
	'firstName':'#firstName',
	'lastName':'#lastName',
	'birthdate':'#dob',
	'proceedBTN':'input[type="submit"]',
	'submit':'input.beginButton[type="submit"]',
	'status':'#mainContentIndex > p:nth-child(3)',
	'expectedStatus':'VOTER STATUS: Active'
};

var user = {
	"firstName":"Linda",
	"lastName":"McCulloch",
	"birthdate":"12/21/1954"
};

var verifyRegistration = function(client, user) {
	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
			.click(INFO['proceedBTN'])
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
	verifyRegistration:verifyRegistration,
	user:user,
        name:NAME
};
