var Horse = require('node-horseman');
var _  = require('underscore');
var co = require('co');

var state = require('./states/indiana');

console.log('Checking your voter registration for Indiana. Please wait...\n');

co(function* () {
    var horse = new Horse();

    yield horse.open(state.regSiteUrl);

    yield horse.select(state.selectors.county, state.voterInfo.county);
    yield horse.value(state.selectors.firstName, state.voterInfo.firstName);
    yield horse.value(state.selectors.lastName, state.voterInfo.lastName);
    yield horse.value(state.selectors.birthdate, state.voterInfo.birthdate);

    yield horse.click(state.selectors.submit);
    yield horse.waitForNextPage();

    var registrationStatus = yield horse.text(state.selectors.registrationStatus);
    var voterName = yield horse.text(state.selectors.voterName);

    yield horse.close();

    console.log(voterName + ": " + registrationStatus);
});


// @TODO: Use these to make a function that checks if the submission worked or not
// var countyRequiredStyle = yield horse.attribute('#ctl00_ContentPlaceHolder1_usrCounty_vldRequiredField', 'style');
// var lastNameRequiredStyle = yield horse.attribute('#ctl00_ContentPlaceHolder1_rfvLastName', 'style');
// var firstNameRequiredStyle = yield horse.attribute('#ctl00_ContentPlaceHolder1_QRequiredFieldValidator1', 'style');
// var dobRequiredStyle = yield horse.attribute('#ctl00_ContentPlaceHolder1_usrDOB_vldRequiredField', 'style');


// TODO: Implement a function like this to get the Id for the county when the user inputs the name of the county
// var countyId = yield horse.evaluate(function(county, selector) {
//     var idForCounty = $(selector + ' option').filter(function (county) {
//         return $(this).html() === county;
//     }).val();
//
//     $('[value="' + idForCounty + '"]').val(idForCounty);
//
//     return idForCounty;
// }, state.voterInfo.countyName, state.selectors.county);
