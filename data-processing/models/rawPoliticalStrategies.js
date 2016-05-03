var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    voterNum: Number,
    html: String
});

mongoose.model('RawPoliticalStrategy', schema);
