$( function () {


// View list of blog post
// GET /
  $.get('/', function (posts) {
  }


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

    var blog_post = $("<ul data-orbit style='height: 500px;'>", {
      class: "blog_post"
    });

    var blog_post_item = 
      $("<li>").append('<img src="http://images.chesscomfiles.com/uploads/images_users/tiny_mce/brigatine-66/phpg8jbUV.jpeg" alt="slide 1" />');

    var blog_post_text = $("<div>", {
      class: "orbit-caption",
      html: "<p>Captions</p>"
    });

    var nav_arrow_prev = 
      $("<a href ='#' class='orbit-prev>Prev</a>")

    var nav_arrow_next = 
      $("<a href ='#' class='orbit-next>Next</a>")

    var slide_number = $("<div>", {
      class: "orbit-slide-number",
      html: "<span>1</span> of <span>1</span>"
    });

    var slide_timer = $("<div>", {
      class: "orbit-timer",
      html: "<span></span>"
    });

    var slide_button = $("<div>", {
      class: "orbit-progress"
    });

    var slide_bullet = $("<ol>", {
      class: "orbit-bullets"
    });

    var slide_bullet_number = 
      $("<li>").attr("data-orbit-slide-number", "1");

    blog_post_item.append(blog_post_text);

    blog_post
      .append(blog_post_item)
      .append(nav_arrow_prev)
      .append(nav_arrow_next);

    slide_timer.append(slide_button);
    slide_bullet.append(slide_bullet_number);

    $(".orbit-container")
      .append(blog_post)
      .append(slide_bullet)
      .append(slide_number)
      .append(slide_timer);
  }

  // buildBlogPost();

// Updates a single blog post identified by :id
// PUT /blog/:id


//Delete a singple blog post identified by :id
// DELETE /blog/:id


});