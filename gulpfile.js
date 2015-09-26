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

