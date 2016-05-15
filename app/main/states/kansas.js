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
        'county':'Sedgwick',
        'firstName':'Anthony',
        'lastName':'St Aubin',
        'birthday':'09/09/1993'
        'expectedParty':'Democratic'
};

var verifyRegistration = function(client, user) {
        return Q.promise(function(resolve, reject) {
                client
                        .url(URL)
                        .selectByVisibleText(INFO['county'], user['county'])
                        .setValue(INFO['firstName'], user['firstName'])
                        .setValue(INFO['lastName'], user['lastName'])
                        .selectByValue(INFO['dobMonth'], user['birthday'].slice(0,1))
                        .selectByValue(INFO['dobYear'], user['birthday'].slice(3, 4))
                        .selectByValue(INFO['dobDay'], user['birthday'].slice(6, 9))
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
