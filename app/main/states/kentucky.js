const Q = require('q');
const NAME = 'Kentucky';
const INFO = {
	'status':'[name="ELIGIBLE FOR PRIMARY"]',
	'expectedStatus':'Yes'
};

var user = {
	"firstName":"Alison",
	"lastName":"Grimes",
	"birthdate":"11/23/1978"
};

var fullUrl = 'https://vrsws.sos.ky.gov/vic/Default.aspx';
fullUrl += '?FIRST_NAME=' + user.firstName;
fullUrl += '&MIDDLE_NAME=&LAST_NAME=' + user.lastName;
fullUrl += '&DATE_OF_BIRTH=' + encodeURIComponent(user.birthdate);
fullUrl += '&SSN_LAST4=&submit=Submit';


var verifyRegistration = function(client, user) {
	return Q.promise(function(resolve, reject) {
		client
			.url(fullUrl)
			.getValue(INFO['status'])
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
