"use strict";

const _ = require('lodash');
const Q = require('q');
const help = require('../lib/utils.js');

let state = {
	URL: "https://app.mt.gov/cgi-bin/voterinfo/voterinfo.cgi",
	default: {
		"firstName":"Linda",
		"lastName":"McCulloch",
		"birthdate":"12/21/1954"
	},
	selectorMap: {
		'firstName':'#firstName',
		'lastName':'#lastName',
		'birthdate':'#dob',
		'proceedBTN':'input[type="submit"]',
		'submit':'input.beginButton[type="submit"]',
		'status':'#mainContentIndex > p:nth-child(3)',
		'expectedStatus':'VOTER STATUS: Active'
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
		help.findElement(d, i['proceedBTN'])
			.then(function(element) {
				element.click();
				Object.keys(i)
					.forEach(function(key) {
						if (i[key] && u[key]) {
							help.setValue(d, i[key], u[key]);
						}
					});

				return help.findElement(d, i['submit']);
			})
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
