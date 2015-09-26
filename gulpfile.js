// Import all packages needed
var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

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

gulp.task('serve', function() {
  connect.server({
    root: './dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('reload', function() {
  watch('./dist/**/*', function() {
    gulp.src('./dist/**?*')
      .pipe(connect.reload());
  });
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('scss', function() {
  return gulp.src('./src/css/main.scss')
    .on('error', swallowError)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
});



// Prevent gulp from crashing and leaving a running Node process behind
function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}