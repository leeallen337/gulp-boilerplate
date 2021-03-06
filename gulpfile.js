var del             = require('del');
var gulp            = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var babel           = require('gulp-babel');
var concat          = require('gulp-concat');
var connect         = require('gulp-connect');
var ghPages         = require('gulp-gh-pages');
var rename          = require('gulp-rename');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var uglify          = require('gulp-uglify');

// Basic file structure
var sourceFiles = {
  allHtml:      'src/**/*.html',
  allAppJs:     'src/js/app/**/*.js',
  allVendorJs:  'src/js/vendor/**/*.js',
  allScss:      'src/**/*.scss',
  allImg:       'src/**/*.{jpg,png,svg,gif,ico}',
  allFont:      'src/**/*.{ttf,woff,otf,eot}'
};

// Default task: 'npm run gulp'
gulp.task('default', ['build', 'watch', 'serve']);

// Initial build which first cleans the dist folder
gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'appJs', 'vendorJs', 'scss', 'img', 'font']);
});

// Watches various directories for changes and then reloads the browser
gulp.task('watch', function() {
  gulp.watch(sourceFiles.allHtml, ['html']);
  gulp.watch(sourceFiles.allAppJs, ['appJs']);
  gulp.watch(sourceFiles.allVendorJs, ['vendorJs']);
  gulp.watch(sourceFiles.allScss, ['scss']);
  gulp.watch(sourceFiles.allImg, ['img']);
  gulp.watch(sourceFiles.allFont, ['font']);
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

/**
  * Note: Gulp preserves the file structure but adding on additional
  * plugins can destroy the file structure which is why for the js and scss
  * task the end file needs to be piped to the correct folder structure
  */

// HTML task
gulp.task('html', function() {
  return gulp.src(sourceFiles.allHtml)
    .pipe(gulp.dest('dist'));
});

// JavaScript task for app files
gulp.task('appJs', function() {
  return gulp.src(sourceFiles.allAppJs)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', swallowError)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js/app'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/app'));
});

// JavaScript task for vendor files (e.g. jQuery)
// Note: Should be able to use production file as this will minify them
gulp.task('vendorJs', function() {
  return gulp.src(sourceFiles.allVendorJs)
    .pipe(sourcemaps.init())
    .on('error', swallowError)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js/vendor'))
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/vendor'));
})

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

// Image task
gulp.task('img', function() {
  return gulp.src(sourceFiles.allImg)
    .pipe(gulp.dest('dist'));
});

// Font task
gulp.task('font', function() {
  return gulp.src(sourceFiles.allFont)
    .pipe(gulp.dest('dist'));
});

// Deploys the dist files to gh-pages by running 'npm run gulp -- deploy'
gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

// Cleans the distribution directory
gulp.task('clean', function() {
  return del(['dist']).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

// Prevent gulp from crashing on errors
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}
