"use strict";

const _ = require('lodash');
const Q = require('q');
const help = require('../lib/utils.js');

let state = {
	URL: "https://secure.sos.state.or.us/orestar/vr/voterSearch.do",
	default: {
		"firstName":"Sharon",
		"lastName":"Meieran",
		"birthdate":"08/27/1964"
	},
	selectorMap: {
		'firstName':'#firstName',
		'lastName':'#lastName',
		'birthdate':'#birthDate',
		'submit':'input#submitResults',
		'status':'span.active',
		'expectedStatus':'Active'
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
		return u;
	},

	script: function(resolve, reject) {
		let d = this.driver;
		let i = this.selectorMap;
		let u = this.user;
		let URL = this.URL;

		help.goTo(d, URL);
		Object.keys(i)
			.forEach(function(key) {
				if (i[key] && u[key]) {
					help.setValue(d, i[key], u[key]);
				}
			});

		help.findElement(d, i['submit'])
			.then(function(element) {
				element.click();
				return help.findElement(d, i['status']); // Promise
			})
			.then(function(element) {
				return element.getText(); // Promise
			})
			.then(function(text) {
				let result = (text.trim() === i['expectedStatus']);
				(result) ? resolve('Active') : reject('Inactive');
			});
	}
};

state._init();

module.exports = state;
