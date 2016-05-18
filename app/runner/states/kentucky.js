"use strict";

const _ = require('lodash');
const Q = require('q');
const help = require('../lib/utils.js');

let state = {
	URL: "https://vrsws.sos.ky.gov/vic/Default.aspx",
	default: {
		"firstName":"Alison",
		"lastName":"Grimes",
		"birthdate":"11/23/1978"
	},
	selectorMap: {
		'status':'[name="ELIGIBLE FOR PRIMARY"]',
		'expectedStatus':'Yes'
	},
	_init: function() {
		_.bindAll(this, 'verifyRegistration', 'manipulateData', 'script');
	},
	verifyRegistration: function(driver, user) {
		if (!driver || !user) {
			console.error(driver, user);
			throw new Error('required arguments missing, driver, user');
		}

		this.driver = driver;
		this.user = this.manipulateData(user);

		let script = this.script;
		return Q.promise(script);
	},

	manipulateData: function(u) {
		// If any UserInfo needs massaging...
		this.URL += '?FIRST_NAME=' + u.firstName;
		this.URL += '&MIDDLE_NAME=&LAST_NAME=' + u.lastName;
		this.URL += '&DATE_OF_BIRTH=' + encodeURIComponent(u.birthdate);
		this.URL += '&SSN_LAST4=&submit=Submit';

		return u;
	},

	script: function(resolve, reject) {
		let d = this.driver;
		let i = this.selectorMap;
		let u = this.user;
		let URL = this.URL;

		help.goTo(d, URL);
		help.findElement(d, i['status'])
			.then(function(element) {
				return element.getAttribute('value');
			})
			.then(function(value) {
				if (value.trim() === i['expectedStatus']) {
					resolve(value);
				}
				else {
					reject(value);
				}
			});
	}
};

state._init();

module.exports = state;
