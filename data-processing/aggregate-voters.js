var request = require('request');
var mongoose = require('mongoose');
require('./models/rawPoliticalStrategies');
mongoose.connect('mongodb://thepatshea:eI4bt%n3l5^m8w@ds013162.mlab.com:13162/voterregistrationmonitordb');





var makeRawPoliticalStrategy = function(inputHtml, inputVoterNum) {
    var RawPoliticalStrategy = mongoose.model('RawPoliticalStrategy');

    var rawPoliticalStrategy = new RawPoliticalStrategy({
      voterNum: inputVoterNum,
      html: inputHtml
    });

    rawPoliticalStrategy.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Saved Voter HTML: ' + inputVoterNum);
      }
    });
};




var scrapePoliticalStrategies = function(voterNum, callback) {
    request('http://www.politicalstrategies.com/voter/' + voterNum, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // var regExHtml = new RegExp('<div class="outerwrapper">(.*?)<script', 'g');
            var regExHtml = new RegExp('outerwrapper(.*?)page', 'g'); // Working on this
            var inputHtml = regExHtml.exec(body);

            console.log(inputHtml);

            //callback(inputHtml, voterNum);
        }
    });
};


var scrapeAllPoliticalStrategies = function(firstVoter, lastVoter) {
    for (i = firstVoter; i <= lastVoter; i++) {
        scrapePoliticalStrategies(i, makeRawPoliticalStrategy);
    }
}

// Max is around 57000000, around half the total number of registered voters in the US
scrapeAllPoliticalStrategies(1,1);


// https://iservices.intelius.com/premier/search.php?componentId=1&qf=Anthony&qn=Erjavec&qcs=Cleveland%2C+OH
// http://www.politicalstrategies.com/voter/57000000
// http://mlab.com
// @TODO: Add some regex so it doesn't save every single thing on the html page. It's taking up too much space.
