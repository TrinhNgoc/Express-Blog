var express = require('express');
var mongoose = require('mongoose');
var app = express();
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

mongoose.connect(CONNECTION_STRING);

require('./middleware')(app);
require('./routes')(app);

module.exports.app = app;