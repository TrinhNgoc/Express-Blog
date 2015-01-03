var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require ('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var crypto = require('crypto');
var mongoose = require('mongoose');
var app = express();
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

// Middleware Area
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

mongoose.connect(CONNECTION_STRING);

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


// SCHEMAS
var postSchema = mongoose.Schema({
  author: String,
  title: String,
  body: String
});

var userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

// MODELS
var Post = mongoose.model('Post', postSchema);
var User = mongoose.model('User', userSchema);

// ROUTES

app.get('*', function(req, res, next) {
  //store new variable so I don't have to pass in all the req.user data to jade views
  res.locals.loggedIn = (req.user) ? true : false;
  next();
});

// LOGIN ROUTES

// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );

app.post('/login', function(req, res, next){
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
});


app.get('/login', function (req, res) {
  res.render('login', {user: req.user, messages: req.flash('error') });
});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// SIGNUP ROUTES
app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res) {

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
      res.redirect('/login');
    });
  } else {
    res.redirect('/signup');
  }



});

// DASHBOARD ROUTES
// Load Dashboard Page
app.get('/dashboard', ensureAuthenticated, function (req, res) {
  res.render('dashboard.jade');
});

// EDIT ACCOUNT ROUTES
// Load edit account page
app.get('/dashboard/edit_account', ensureAuthenticated, function (req, res) {
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
    res.render('edit_account', locals);
  });
});

// Update User Information
app.post('/dashboard/edit_account', function (req, res) {

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
});

// BLOG ROUTES
//Render all blog posts
app.get('/', function (req, res) {
  Post.find(function (err, blogposts) {
    if(err) {
      console.log(err);
    }
    var locals = {
      blogs: blogposts
    };
    res.render('./index', locals);
  });
});

//View Single Blog post
app.get('/blog/:id', function (req, res) {
  Post.findById(req.params.id, function (err, blog) {
    if(err) {
      return console.log(err);
    }
    var locals = {
      id: blog._id,
      author: blog.author,
      title: blog.title,
      body: blog.body.split(/\r?\n\r?\n/g)
      // body: blog.body

    };
    res.render('./single_blog', locals);
  });
});

//Render New Blog Form
app.get('/new_blog', ensureAuthenticated, function (req, res) {
  var locals = {
    author: req.user.firstname + ' ' + req.user.lastname
  };
  res.render('new_blog_form.jade', locals);
});

//Submit a new blog
app.post('/blog', function (req, res) {

  req.body.author = req.user.firstname + ' ' + req.user.lastname;

  var new_post = new Post(req.body);
    new_post.save(function (err, blog) {
    if(err) {
      throw err;
    }
    res.redirect('/blog/' + blog._id);
  });
});

//Render Edit Blog Form
app.get('/blog/:id/edit', ensureAuthenticated, function (req, res) {
  Post.findById(req.params.id, function (err, blog) {
    if(err) {
      return console.log(err);
    }
    var locals = {
      id: blog._id,
      author: blog.author,
      title: blog.title,
      body: blog.body
    };
    res.render('./edit_blog', locals);
  });
});

//Update Blog Post
app.put('/blog/:id', function (req, res) {
  var blogpost = {
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  };

  Post.findByIdAndUpdate(req.params.id, blogpost , function (err, blogpost) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/blog/'+req.params.id);
  });
});

//Delete Blog Post
app.delete('/blog/:id', ensureAuthenticated, function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, blogpost) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
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


module.exports.app = app;


