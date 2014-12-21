var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var app = express();
var mongoose = require('mongoose');


// Middleware Area
app.use(express.static('public'));


