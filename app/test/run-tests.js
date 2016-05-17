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
    
    var seleniumRunner = {
        install: function() {
            // Runs selenium.install, then triggers start
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
        },
        start: function() {
            // Runs selenium.start, then hooks into afterStart
            var afterStart = seleniumRunner.afterStart;
            selenium.start(afterStart);
        },
        error: function(error, child, caller) {
            // If error occurs during start, show error and kill child
            if (typeof error !== "string") {
                error = error.toString();
            }
            if (child) {
                child.kill();
            }
            console.log("From " + caller + " - " + error);
        },
        afterStart: function(error, child) {
            // After starting selenium, try to run chosen state's script
            if (error) {
                seleniumRunner.error(error, child, "seleniumRunner.afterStart");
            } else {
                runStateTest(indiana);
                runStateTest(kansas);
                runStateTest(kentucky);
                runStateTest(montana);
                runStateTest(oregon);
                runStateTest(westVirginia);
            }
            
            //child.kill();
        }
    };
    
    seleniumRunner.install();
};

var runStateTest = function(state, child) {
    try {
        var client = webdriverio.remote({
            'desiredCapabilities': { 
                'browserName': 'phantomjs',
                'phantomjs.binary.path': phantomPath
            } 
        });
        
        state.verifyRegistration(client.init(), state.user)
            .then(
                function() { console.log(state.name + '\t\tpassed') },
                function() { console.log(state.name + '\t\tfailed') },
                function() { console.log(state.name + '\t\tprogress')}
            );
    }
    catch (error) {
        seleniumRunner.error(error, child);
    }
    
};


console.log('Running State Tests...');
runTests();
