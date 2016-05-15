const selenium = require('selenium-standalone');
const webdriverio = require('webdriverio');
var phantomPath = require('phantomjs-prebuilt').path;

const indiana = require('../main/states/indiana.js');
const kansas = require('../main/states/kansas.js');
const kentucky = require('../main/states/kentucky.js');
const montana = require('../main/states/montana.js');
const oregon = require('../main/states/oregon.js');
const westVirginia = require('../main/states/west-virginia.js');

var runTests = function() {
    runStateTest(indiana);
    runStateTest(kansas);
    runStateTest(kentucky);
    runStateTest(montana);
    runStateTest(oregon);
    runStateTest(westVirginia);
};

var runStateTest = function(state) {
    try {
        var client = webdriverio.remote({
            'desiredCapabilities': { 
                'browserName': 'phantomjs',
                'phantomjs.binary.path': phantomPath
            } 
        });
        
        state.verifyRegistration(client.init(), state.user)
            .then(
                function() { console.log('passed') },
                function() { console.log('failed') },
                function() { console.log('progress')}
            );
    } catch (error) {
        console.log(error);
    }
};

runTests();
