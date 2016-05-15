const webdriverio = require('webdriverio');
var phantomPath = require('phantomjs-prebuilt').path;

const indiana = require('./indiana.js');
const kansas = require('./kansas.js');
const kentucky = require('./kentucky.js');
const montana = require('./montana.js');
const oregon = require('./oregon.js');
const westVirginia = require('./west-virginia');

var runTests = function() {
    runStateTest(indiana)//, userIndiana);
    runStateTest(kansas)//, userKansas);
    runStateTest(kentucky)//, userKentucky);
    runStateTest(montana)//, userMontana);
    runStateTest(oregon)//, userOregon);
    runStateTest(westVirginia)//, userWestVirginia);
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
