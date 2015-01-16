var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var mongoose = require('mongoose');
var flash = require ('connect-flash');

var User = require('../models/users.js');

//Passport Area
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });

      }
      if (encryptPassword(password) !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });

      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  // console.log("serialize", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user) {
    done(null, user);
  });
});

//FUNCTIONS
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated() ){
    return next();
  }

  //store the url they're coming from
  req.session.redirectUrl = req.url;

  //not authenticated
  req.flash("warn", "You must be logged-in to do that.");
  res.redirect('/login');
};

function encryptPassword (password) {
  var salt = "allwedoiswin";
  var shasum = crypto.createHash('sha512');

  shasum.update ( password + salt );

  return shasum.digest('hex');
};
// LOGIN ROUTES

// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );

function login (req, res, next){
  passport.authenticate('local', function(err, user, info){
    // This is the default destination upon successful login.
    var redirectUrl = '/';

    if (err) { 
      return next(err);
    }

    if (!user) { 
      req.flash('errorMessage', 'user not found');
      return res.redirect('/login');
    }

    // If we have previously stored a redirectUrl, use that, 
    // otherwise, use the default.
    if (req.session.redirectUrl) {
      redirectUrl = req.session.redirectUrl;
      req.session.redirectUrl = null;
    }
    req.logIn(user, function(err){
      if (err) { return next(err); }
    });
    res.redirect(redirectUrl);
  })(req, res, next);
}

function view_login (req, res) {
  res.render('./login_views/login.jade', {user: req.user, messages: req.flash('error') });
}

function logout (req, res) {
  req.logout();
  res.redirect('/');
}

function view_signup (req, res) {
  res.render('./login_views/signup.jade');
}

function signup (req, res) {

  if(req.body.password === req.body.cpassword) {
    var new_user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: encryptPassword(req.body.password),
    });

    new_user.save(function (err, user) {
      if (err) {
        throw err;
      }
      req.logIn(user, function(err){
        if (err) { return next(err); }
      });
      res.redirect('/');
    });
  } else {
    res.redirect('/signup');
  }

}
module.exports = {
  login: login,
  view_login: view_login,
  logout: logout,
  view_signup: view_signup,
  signup: signup,
  ensureAuthenticated: ensureAuthenticated,
  encryptPassword: encryptPassword
};