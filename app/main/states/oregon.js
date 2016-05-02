const Q = require('q');
const URL = "https://secure.sos.state.or.us/orestar/vr/voterSearch.do";
const INFO = {
	'firstName':'#firstName',
	'lastName':'#lastName',
	'birthdate':'#birthDate',
	'submit':'input#submitResults',
	'status':'span.active',
	'expectedStatus':'Active'
};

var user = {
	"firstName":"Sharon",
	"lastName":"Meieran",
	"birthdate":"08/27/1964"
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