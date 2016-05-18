const Q = require('q');
const URL = "https://services.sos.wv.gov/Elections/Voter/AmIRegisteredToVote";
const NAME = 'West Virginia';
const INFO = {
	'firstName':'#FirstName',
	'lastName':'#LastName',
	'birthdate':'#DateOfBirth',
	'submit':'input[type="submit"]',
	'status':'table i',
	'expectedStatus':'Democrat'
};

var user = {
	'firstName': 'Natalie',
	'lastName': 'Tennant',
	'birthdate': '12/25/1967'
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
				resolve(INFO['expectedStatus'] === value);
			});
	});
};

module.exports = {
	verifyRegistration:verifyRegistration,
	user:user,
        name:NAME
};
