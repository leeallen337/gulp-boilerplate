var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

gulp.task('default', ['watch', 'serve']);

gulp.task('serve', function() {
  connect.server({
    root: './src',
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['reload']);
});

gulp.task('reload', function() {
  gulp.src('./src/**/*').pipe(connect.reload());
});

gulp.task('deploy', function() {
  return gulp.src('./src/**/*').pipe(ghPages());
});

gulp.task('css', function() {
  return gulp.src('./src/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./src/css'));
})