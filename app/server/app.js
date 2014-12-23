var express = require('express');
var app = express();
var mongoose = require('mongoose');
var CONNECTION_STRING = ('mongodb://blog:' + process.env.DBPASS + '@ds027761.mongolab.com:27761/winninghardest_expressblog');

// Middleware Area
app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'jade');

mongoose.connect(CONNECTION_STRING);


// // SCHEMAS

// var NewPostSchema = mongoose.Schema('NewPost', {
//   author: String,
//   title: String,
//   body: String
// });




// // MODEL
// var NewPost = mongoose.model('NewPost', NewPostSchema);


// ROUTES

app.get('/', function (req, res) {
  res.render("./index");
});

app.get('/new_blog', function (req, res) {
  
  // var new_blog_post = "<form method='POST'> <input type='text' placeholder='author'> <input type='text' placeholder='title'> <input type='text' placeholder='body'> <button type='submit'>Submit</button> </form>";

  // res.send(new_blog_post);
  res.render("new_blog_form.jade");


});




module.exports.app = app;



