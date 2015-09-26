// Import all packages needed
var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

// Common patterns used throughout the gulp configuration
var src = {
  allHTML: './src/**/*.html',
  allJs: './src/**/*.js',
  allFont: './src/**/*.{ttf,woff,otf,eot}',
  allScss: './src/**/*.scss',
  allImg: './src/**/*.{jpg,png,svg,gif,ico}'
}

// The default task is what runs when you type 'npm run gulp' in the terminal
gulp.task('default', ['clean'], function() {
  return gulp.start('html', 'img', 'font', 'js:view', 'js:vendor', 'js', 'scss', 'watch', 'reload', 'serve');
});
