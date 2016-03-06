'use strict';

let gulp = require('gulp'),
    runSequence = require('run-sequence'),
    revAppend = require('gulp-rev-append'),
    notify = require('gulp-notify');

gulp.task('build', function() {
  runSequence('revAppend');
});

gulp.task('revAppend', function() {
  gulp.src('./public/index.html')
    .pipe(revAppend())
    .pipe(gulp.dest('./public'))
    .pipe(notify('revAppend - OK!'));
});

gulp.task('watch', function() {
  gulp.watch('./public/js/*.js', ['revAppend']);
});

gulp.task('default', function () {
  runSequence('build', 'watch');
});

