var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require ('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var app = express();
var mongoose = require('mongoose');
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

// Middleware Area
app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'jade');
app.use(session({ 
  secret: 'anime pregnancy test',
  resave: false,
  saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("serialize", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findOne({id: user.id}, function(err, user) {
    done(null, user);
  });
});

mongoose.connect(CONNECTION_STRING);

// SCHEMAS
var postSchema = mongoose.Schema({
  author: String,
  title: String,
  body: String
});

// MODELS
var Post = mongoose.model('Post', postSchema);

// ROUTES

// LOGIN ROUTES
app.post('/login',
  passport.authenticate('local', { successRedirect: '/new_blog',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/login', function (req, res) {
  res.render('login', {user: req.user, messages: req.flash('error') });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
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
  res.render('new_blog_form.jade');
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

//Submit a new blog
app.post('/blog', function (req, res) {
  var new_post = new Post(req.body);
    new_post.save(function (err, image) {
    if(err) {
      throw err;
    }
    res.redirect('/');
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
  console.log(req.isAuthenticated());
  console.log(req.user);
  if (req.isAuthenticated() ){
    return next();
  }
  //not authenticated
  res.redirect('/login');
}

//FAKE USER
var User = {
  findOne : function (opts, cb){
    
    var user = {
      id: 1, 
      username: "jon",
      password: "winners",
      validPassword: function (password) {
        return (password === "winners");
      }
    };
    cb (null, user);
  }
};


module.exports.app = app;


