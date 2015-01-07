Express-Blog
============

To run app:
1. Clone the repo
2. npm install in terminal
3. bower install in terminal
4. Install gulp globally in terminal
5. To get DBPASS, go to https://cryptobin.org/z1n7q6e2 
6. Run DBPASS="insert_password" gulp in terminal
7. View in localhost:4000 in browser

MEH stack - Mongo Express and HTML5 

Use the MEH stack plus *almost* any other library or templating engines you want to fulfill the requirements.  
recommended: sass, jade, mongoose, bower, jQuery, foundation.  
helpful: livereload, gulp for watching compiling sass

---

Create a multi-user Blog.  
Any user should be able to access these routes:  

- `GET /` to view a list of blog post entries
- `GET /blog/:id` to see a single blog post
	- each blog post should include a link to delete this blog post
	- each blog post should include a link to edit this blog post
- `GET /new_blog` to see a "new blog post" form
	- the form fields are:
		- `author` : Text
		- `title` : Text
		- `body` : TextArea
- `POST /blog` to create a new blog post i
- `GET /blog/:id/edit` to see a form to *edit* a blog post identified by the `:id` param
	- the form fields are:
		- `author` : Text
		- `title` : Text
		- `body` : TextArea
- `PUT /blog/:id` updates a single blog post identified by the `:id` param
- `DELETE /blog/:id` to delete a single blog post identified by the `:id` param

---

Your app should be stored in subdirectory `/app`.  
The layout of the app must match the layouts included in `/layouts`.  
Match the layout as close as you can, using free and open fonts and graphics.