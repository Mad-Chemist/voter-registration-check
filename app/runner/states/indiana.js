"use strict";

const _ = require('lodash');
const Q = require('q');
const help = require('../lib/utils.js');

let state = {
	URL: "https://indianavoters.in.gov/PublicSite/Public/FT1/PublicLookupMain.aspx?Link=Registration",
	default: {
		'county': 'Knox',
		'firstName': 'John',
		'lastName': 'Gregg',
		'birthdate': '09/06/1954'
	},
	selectorMap: {
		'county':'#ctl00_ContentPlaceHolder1_usrCounty_cboCounty',
		'firstName':'#ctl00_ContentPlaceHolder1_txtFirst',
		'lastName':'#ctl00_ContentPlaceHolder1_txtLast',
		'birthdate':'#ctl00_ContentPlaceHolder1_usrDOB_txtDate',
		'submit':'input[type="submit"]',
		'status':'#ctl00_ContentPlaceHolder1_lblStatus',
		'expectedStatus':'Registered'
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
				if (i[key] && u[key] && key !== "county") {
					help.setValue(d, i[key], u[key]);
				}
			});

		help.findElement(d, '//option[text()="'+ u['county'] + '"]', 'xpath')
			.then(function(element) {
				element.click(); // Click drop down option
				// Submit form
				return help.findElement(d, i['submit']); // Promise
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
				return (result) ? resolve('Active') : reject('Inactive');
			});
	}
};

state._init();

module.exports = state;
