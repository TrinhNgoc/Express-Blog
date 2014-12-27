var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var mongoose = require('mongoose');
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

// Middleware Area
app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

//Render all blog posts
app.get('/', function (req, res) {
  Post.find(function (err, blogposts) {
    if(err) {
      console.log(err);
    }
    var locals = {
      blogs: blogposts
    }
    res.render("./index", locals);
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
      body: blog.body
    }
    res.render('./single_blog', locals);
  });
});


//Render New Blog Form
app.get('/new_blog', function (req, res) {
  res.render("new_blog_form.jade");
});

//Render Edit Blog Form
app.get('/blog/:id/edit', function (req, res) {
  Post.findById(req.params.id, function (err, blog) {
    if(err) {
      return console.log(err);
    }
    var locals = {
      id: blog._id,
      author: blog.author,
      title: blog.title,
      body: blog.body
    }
    res.render('./edit_blog', locals);
  });
})

//Submit a new blog
app.post('/blog', function (req, res) {

  var new_post = new Post(req.body);
  new_post.save(function (err, image) {
    if(err) {
      throw err;
    }
    res.redirect('/');
  })

})

//Update Blog
app.put("/blog/:id", function (req, res) {
  var blogpost = {
    $set: { 
      title: req.body.title,
      author: req.body.author,
      body: req.body.body
    }
  };

  console.log(req.params.id);
  Post.findByIdAndUpdate(req.params.id, blogpost , function (err, post) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/blog/id');
  });


});




module.exports.app = app;



