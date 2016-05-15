const Q = require('q');
const URL = "https://myvoteinfo.voteks.org/VoterView/RegistrantSearch.do"
const INFO = {
	'firstName':'#nameFirst',
	'lastName':'#nameLast',
	'dobMonth':'#dobMonth',
	'dobDay':'#dobDay',
        'dobYear':'#dobYear',
        'submit':'input#search',
	'status':'div#registrant > p:nth-child(4)',
	'expectedStatus':'Active'
};

var user = {
        'firstName':'Anthony',
        'lastName':'St Aubin',
        'dobMonth':'Sep',
        'dobDay':'09',
        'dobYear':'1993',
        'expectedParty':'Democratic'
};

var verifyRegistration = function(client, user) {
	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
			.setValue(INFO['firstName'], user['firstName'])
			.setValue(INFO['lastName'], user['lastName'])
			.setValue(INFO['dobMonth'], user['dobMonth'])
                        .setValue(INFO['dobYear'], user['dobYear'])
                        .setValue(INFO['dobDay'], user['dobDay'])
			.click(INFO['submit'])
			.waitForExist(INFO['status'], 5000)
			.getText(INFO['status'])
			.then(function(value) {
				resolve(INFO['expectedStatus'] === value);
			});
	});
};

module.exports = {
	verifyRegistration:verifyRegistration
};
