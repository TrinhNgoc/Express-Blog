var Post = require('../models/post.js');

function view_all_blogs (req, res) {
  Post.find(function (err, blogposts) {
    if(err) {
      console.log(err);
    }
    var locals = {
      blogs: blogposts
    };
    res.render('./index.jade', locals);
  });
}

function view_single_blog (req, res) {
  Post.findById(req.params.id, function (err, blog) {
    if(err) {
      return console.log(err);
    }
    var locals = {
      id: blog._id,
      author: blog.author,
      title: blog.title,
      body: blog.body.split(/\r?\n\r?\n/g)
    };
    res.render('./blog_views/single_blog.jade', locals);
  });
}

function new_blog_form (req, res) {
  var locals = {
    author: req.user.firstname + ' ' + req.user.lastname
  };
  res.render('./blog_views/new_blog_form.jade', locals);
}

function submit_new_blog (req, res) {

  req.body.author = req.user.firstname + ' ' + req.user.lastname;

  var new_post = new Post(req.body);
    new_post.save(function (err, blog) {
    if(err) {
      throw err;
    }
    res.redirect('/blog/' + blog._id);
  });
}

function edit_blog_form (req, res) {
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
    res.render('./blog_views/edit_blog.jade', locals);
  });
}

function update_blog_post (req, res) {
  var blogpost = {
    title: req.body.title,
    body: req.body.body
  };

  Post.findByIdAndUpdate(req.params.id, blogpost , function (err, blogpost) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/blog/'+req.params.id);
  });
}

function delete_blog_post (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, blogpost) {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  view_all_blogs: view_all_blogs,
  view_single_blog: view_single_blog,
  new_blog_form: new_blog_form,
  submit_new_blog: submit_new_blog,
  edit_blog_form: edit_blog_form,
  update_blog_post: update_blog_post,
  delete_blog_post: delete_blog_post
};