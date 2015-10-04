var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// Basic file structure
var sourceFiles = {
  allHtml:  'src/**/*.html',
  allJs:    'src/**/*.js',
  allScss:  'src/**/*.scss'
};

// Default task
gulp.task('default', ['build', 'watch', 'serve']);

// Initial build which first cleans the dist folder
gulp.task('build', ['clean'], function() {
  gulp.start(['js', 'scss', 'html']);
});

// Watchings various directories for changes and then reloads the browser
gulp.task('watch', function() {
  gulp.watch(sourceFiles.allHtml, ['html']);
  gulp.watch(sourceFiles.allJs, ['js']);
  gulp.watch(sourceFiles.allScss, ['scss']);
  gulp.watch('dist/**/*', ['reload']);
});

// Serves the dist file path to the browser
gulp.task('serve', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});

// Reloads the browser with the dist file path as the source files
gulp.task('reload', function() {
  gulp.src('dist/**/*')
    .pipe(connect.reload());
});

// CSS task
gulp.task('scss', function() {
  return gulp.src('src/css/main.scss')
    .on('error', swallowError)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});

// HTML task
gulp.task('html', function() {
  return gulp.src(sourceFiles.allHtml)
    .pipe(gulp.dest('dist'));
});

// JavaScript task
gulp.task('js', function() {
  return gulp.src(sourceFiles.allJs)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', swallowError)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
});

// Deploys the dist files to gh-pages
gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

// Cleans the distribution directory
gulp.task('clean', function(cb) {
  return del('dist', cb);
});

// Prevent gulp from crashing on errors
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}
