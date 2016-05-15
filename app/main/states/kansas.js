const Q = require('q');
const URL = "https://myvoteinfo.voteks.org/VoterView/RegistrantSearch.do";
const INFO = {
        'firstName':'#nameFirst',
        'lastName':'#nameLast',
        'dobMonth':'#dobMonth',
        'dobDay':'#dobDay',
        'dobYear':'#dobYear',
        'submit':'input[type="submit"]',
        'status': '#registrant > span:nth-of-type(4)',
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
	try {
		if (user && typeof user['birthdate'] === "string") {
			var splitBirth = user['birthdate'].split('/');
			user['dobYear'] = splitBirth[2];
			user['dobDay'] = splitBirth[1];
			user['dobMonth'] = splitBirth[0];
		}
	}
	catch(error) {
		console.error(error);
	}

	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
			.setValue(INFO['firstName'], user['firstName'])
			.setValue(INFO['lastName'], user['lastName'])
			.selectByValue(INFO['dobMonth'], user['dobMonth'])
            .selectByValue(INFO['dobYear'], user['dobYear'])
            .selectByValue(INFO['dobDay'], user['dobDay'])
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

