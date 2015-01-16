var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require ('connect-flash');
var passport = require('passport');
var methodOverride = require('method-override');

function middleware (app) {

  app.use(express.static(__dirname + '/../public'));
  app.set('view engine', 'jade');
  app.use(session({ 
    secret: 'blogify',
    resave: false,
    saveUninitialized: true
  }));
  app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = middleware;