// 'use strict';

const path = require('path');

import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
// import browserSync from 'browser-sync';
// import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
// import postcss from 'gulp-postcss';
import cssnano from 'cssnano';

// import {output as pagespeed} from 'psi';
// import pkg from './package.json';

const $ = gulpLoadPlugins({
  scope: ['devDependencies']
});
// const reload = browserSync.reload();


gulp.task('build', () => {
  runSequence([
    'build:clean',
    'build:revAppend',
    'build:html',
    'build:css-libs',
    'build:css',
    'build:js-libs',
    'build:js']);
});

gulp.task('build:clean', () => del(['.tmp', 'dist/*', '!dist/.git'], { dot: true }));

gulp.task('build:revAppend', () => {
  gulp.src('./app/*.html')
    .pipe($.revAppend())
    .pipe(gulp.dest('./app'))
    .pipe($.notify('build:revAppend - OK!'));
});

gulp.task('build:html', () => {
  gulp.src('./app/*.html')
    .pipe($.minifyHtml())
    .pipe(gulp.dest('./dist'))
    .pipe($.notify('build:html - OK!'));
});

gulp.task('build:css', () => {
  gulp.src('./app/css/*.css')
    .pipe($.postcss([cssnano()]))
    .pipe(gulp.dest('./dist'))
    .pipe($.notify('build:css - OK!'));
});

gulp.task('build:css-libs', () => {
  gulp.src([
    './app/libs/normalize-css/normalize.css',
    'app/libs/Materialize/dist/css/materialize.min.css'
  ])
    .pipe($.postcss([cssnano()]))
    .pipe(gulp.dest('./dist/libs'))
    .pipe($.notify('build:css-libs - OK!'));
});

gulp.task('build:js-libs', function () {
  gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/Materialize/dist/js/materialize.min.js'
  ])
    .pipe($.rename( (path) => {
      path.dirname = '';
      path.basename += '';
    }))
    .pipe(gulp.dest('./dist/libs/'))
    .pipe($.notify('build:js-libs - OK!'));
});

gulp.task('build:js', $.shell.task(['r.js -o build.js']));


gulp.task('watch', () => {
  gulp.watch('./app/js/*.js', ['build:revAppend']);
});

gulp.task('default', () => {
  runSequence('build', 'watch');
});

