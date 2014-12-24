var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

// Middleware Area
app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));


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

//New Blog Link
app.get('/new_blog', function (req, res) {
  res.render("new_blog_form.jade");
});

app.post('/blog', function (req, res) {

  var new_post = new Post(req.body);
  new_post.save(function (err, image) {
    if(err) {
      throw err;
    }
    res.redirect('/');
  })
  // console.log(new_post.author);

})





module.exports.app = app;



