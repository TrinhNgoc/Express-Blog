$( function () {

// View list of blog post
// GET /
  $.get('/', function (posts) {

  });  



  function displayBlogPosts () {
      


  }

// View a single blog post
// Includes a link to delete
// Includes a link to edit
// GET /blog/:id


// View new blog post
// Form fields: author, title, body
// GET /new_blog


// Create new blog post
// POST /blog
  function buildBlogPost () {

    var blog_post = $("<ul data-orbit>", {
      class: "blog_post"
    });

    var blog_post_item = 
      $("<li>").append('<img src="http://images.chesscomfiles.com/uploads/images_users/tiny_mce/brigatine-66/phpg8jbUV.jpeg" alt="slide 1" />');

    var blog_post_text = $("<div>", {
      class: "orbit-caption",
      text: "THIS IS A TREE!"
    });

    blog_post_item.append(blog_post_text);
    blog_post.append(blog_post_item);

    $(".blog_content").append(blog_post);
    
  }
  buildBlogPost();

// Updates a single blog post identified by :id
// PUT /blog/:id


//Delete a singple blog post identified by :id
// DELETE /blog/:id


});