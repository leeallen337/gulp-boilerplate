var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var del = require('del');

var src = {
  allHtml: './src/**/*.html',
  allJs: './src/**/*.js',
  allFont: './src/**/*.{ttf,woff,otf,eot}',
  allScss: './src/**/*.scss',
  allImg: './src/**/*.{jpg,png,svg,gif,ico}'
}

gulp.task('default', ['clean'], function() {
  return gulp.start('html', 'img', 'font', 'js:vendor', 'js', 'scss', 'watch', 'reload', 'serve');
});

gulp.task('watch', function() {
  watch(src.allHhtml, function() {
    gulp.start('html');
  });
  
  watch(src.allJs, function() {
    gulp.start('js');
  });
  
  watch(src.allScss, function() {
    gulp.start('scss');
  });
  
  watch(src.allImg, function() {
    gulp.start('img');
  });
  
  watch(src.allFont, function() {
    gulp.start('font');
  });
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

gulp.task('html', function() {
  return gulp.src(src.allHtml)
    .pipe(gulp.dest('./dist'));
});

gulp.task('img', function() {
  return gulp.src(src.allImg)
    .pipe(gulp.dest('./dist'));
});

gulp.task('font', function() {
  return gulp.src(src.allFont)
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function (cb) {
  del('./dist', cb);
});

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}