var mongoose = require('mongoose');
var auth = require('./auth.js');
var User = require('../models/users.js');

function view_dashboard (req, res) {
  res.render('./account_editing/dashboard.jade');
}

function view_edit_account (req, res) {
  User.findOne({ email: req.user.email}, function (err, user) {
    if(err) {
      console.log(err);
      return 404;
    }
    var locals = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    };
    res.render('./account_editing/edit_account.jade', locals);
  });
};

function update_edit_account (req, res) {

  var updated_user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  }

  User.findOneAndUpdate({email: req.user.email}, updated_user, function (err, user) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/dashboard/edit_account');
  });
}

function view_change_password (req, res) {
  res.render('./account_editing/change_password');
}

function change_password (req, res) {
  var new_password = req.body.password;
  var password_check = (auth.encryptPassword(req.body.current_password) === req.user.password);
  var confirm_password_check = (new_password === req.body.cpassword);

  if (password_check && confirm_password_check) {

    User.findOneAndUpdate({email: req.user.email}, { password: auth.encryptPassword(new_password) } , function (err, user) {
      if(err) {
        return console.log(err);
      }
      res.redirect('/dashboard');
    });

  } else {
    res.redirect('/dashboard/change_password');
  }
};

module.exports = {
 view_dashboard: view_dashboard,
 view_edit_account: view_edit_account,
 update_edit_account: update_edit_account,
 view_change_password: view_change_password,
 change_password: change_password
};



