var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var sourceFiles = {
  allHtml:  './src/**/*.html',
  allJs:    './src/**/*.js',
  allScss:  './src/**/*.scss'
};

gulp.task('default', ['clean'], function() {
  return gulp.start('serve', 'watch', 'reload')
});

gulp.task('serve', function() {
  connect.server({
    root: './dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', function() {
  watch(sourceFiles.allHtml, function() {
    gulp.start('html');
  });
  
  watch(sourceFiles.allJs, function() {
    gulp.start('js');
  });
  
  watch(sourceFiles.allScss, function() {
    gulp.start('scss');
  });
});

gulp.task('reload', function() {
  watch('./dist/**/*', function() {
    gulp.src('./dist/**/*')
      .pipe(connect.reload());
  });
});

