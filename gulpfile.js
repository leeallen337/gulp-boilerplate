var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');

var sourceFiles = {
  allHtml:  'src/**/*.html',
  allJs:    'src/**/*.js',
  allScss:  'src/**/*.scss'
};

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['clean'], function() {
  gulp.start(['js', 'scss', 'html']);
});

gulp.task('watch', function() {
  gulp.watch(sourceFiles.allHtml, ['html']);
  gulp.watch(sourceFiles.allJs, ['js']);
  gulp.watch(sourceFiles.allScss, ['scss']);
  gulp.watch('dist/**/*', ['reload']);
});

gulp.task('serve', function() {
  connect.server({
    root: './dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src('dist/**/*').pipe(connect.reload());
});

gulp.task('scss', function() {
  return gulp.src('src/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
  return gulp.src(sourceFiles.allHtml)
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return gulp.src(sourceFiles.allJs)
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function(cb) {
  return del('dist', cb);
});