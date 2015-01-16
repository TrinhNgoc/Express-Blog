function routes (app) {

  //MODELS
  var User = require('../models/users.js');
  var Post = require('../models/post.js');

  //CONTROLLERS
  var auth = require('../controllers/auth.js');
  var accounts = require('../controllers/user_info.js');
  var blogs = require('../controllers/blogs.js');

  // ROUTES
  app.get('*', function(req, res, next) {
    //store new variable so I don't have to pass in all the req.user data to jade views
    res.locals.loggedIn = (req.user) ? true : false;
    next();
  });

  //LOGIN ROUTES
  app.post('/login', auth.login);
  app.get('/login', auth.view_login);
  app.get('/logout', auth.logout);

  // SIGNUP ROUTES
  app.get('/signup', auth.view_signup);
  app.post('/signup', auth.signup);

  // DASHBOARD ROUTES
  app.get('/dashboard', auth.ensureAuthenticated, accounts.view_dashboard);
  app.get('/dashboard/edit_account', auth.ensureAuthenticated, accounts.view_edit_account);
  app.post('/dashboard/edit_account', accounts.update_edit_account);
  app.get('/dashboard/change_password', auth.ensureAuthenticated, accounts.view_change_password);
  app.post('/dashboard/change_password', accounts.change_password);


  // BLOG ROUTES
  app.get('/', blogs.view_all_blogs);
  app.get('/blog/:id', blogs.view_single_blog);
  app.get('/new_blog', auth.ensureAuthenticated, blogs.new_blog_form);
  app.post('/blog', auth.ensureAuthenticated, blogs.submit_new_blog);
  app.get('/blog/:id/edit', auth.ensureAuthenticated, blogs.edit_blog_form);
  app.put('/blog/:id', auth.ensureAuthenticated, blogs.update_blog_post);
  app.delete('/blog/:id', auth.ensureAuthenticated, blogs.delete_blog_post);
}

module.exports = routes;