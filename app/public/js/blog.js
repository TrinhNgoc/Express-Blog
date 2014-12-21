$( function () {


  $("a.new_post").click(function () {
    $.get('/new_blog', function (form) {
      console.log(form);
    }); 
  });




  function displayBlogPosts () {
      


  }



})();