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
    var seleniumRunner = {
        install: function() {
            // Runs selenium.install, then triggers start
            try {
                var complete = seleniumRunner.start;
                var settings = {
                    baseURL: 'https://selenium-release.storage.googleapis.com',
                    drivers: {
                        chrome: {
                            arch: process.arch,
                            baseURL: 'https://chromedriver.storage.googleapis.com'
                        },
                        ie: {
                            arch: process.arch,
                            baseURL: 'https://selenium-release.storage.googleapis.com'
                        }
                    }
                };
                selenium.install(settings, complete);
            } catch (error) {
                console.log(error);
            }
        },
        start: function() {
            // Runs selenium.start, then hooks into afterStart
            var afterStart = seleniumRunner.afterStart;
            selenium.start(afterStart);
        },
        error: function(error, child) {
            // If error occurs during start, show error and kill child
            if (typeof error !== "string") {
                error = error.toString();
            }
            if (child) {
                child.kill();
            }
            console.log(error);
        },
        afterStart: function(error, child) {
            // After starting selenium, try to run chosen state's script
            if (error) {
                    seleniumRunner.error(error, child);
            }
            else {
                try {
                    var client = webdriverio.remote({
                        'desiredCapabilities': { 
                            'browserName': 'phantomjs',
                            'phantomjs.binary.path': phantomPath
                        } 
                    });
                    
                    state.verifyRegistration(client.init(), state.user)
                        .then(
                            function() { console.log(state.name + '\tpassed') },
                            function() { console.log(state.name + '\tfailed') },
                            function() { console.log(state.name + '\tprogress')}
                        );
                }
                catch (error) {
                    console.log(error.toString() + child.toString());
                }
            }	
        }
    };
    
    seleniumRunner.install();
    
};


console.log('Running State Tests...');
runTests();
