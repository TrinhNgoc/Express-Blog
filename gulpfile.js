var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function (){
  return gulp.src('./app/sass/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./app/public/css'));
});

gulp.task('watch_styles', function (){
  gulp.watch('./app/sass/**/*.scss', ['styles']);
  gulp.watch('./app/public/*.html', notifyLiveReload);
  gulp.watch('./app/public/css/*.css', notifyLiveReload);
});

gulp.task('express', function(){
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname + '/app/public/'));
  app.listen(4000);
});

function notifyLiveReload(event){
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

var tinylr;
gulp.task('livereload', function(){
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

gulp.task('default', ['styles', 'watch_styles', 'express', 'livereload']);
