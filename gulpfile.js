'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var mergeStream = require('merge-stream');
var bowerInstall = require('bower').commands.install;
var saveLicense = require('uglify-save-license');

var pkg = require('./package.json');

function bowerFiles() {
  return gulp.src([
    'selectivizr/selectivizr.js',
    'respond/dest/respond.src.js',
    'html5shiv/dist/html5shiv.js'
  ], {cwd: 'bower_components'});
}

gulp.task('lint', function() {
  gulp.src(['gulpfile.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter())
    .pipe($.jscs('.jscs.json'));
  gulp.src(['*.json'])
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean', del.bind(null, ['*.js', '!gulpfile.js']));

gulp.task('bower', function() {
  return bowerInstall([
    'selectivizr=https://github.com/keithclark/selectivizr/archive/ed2f5e3e56f059ad256cc921e24ecc0e1855f18a.zip',
    'respond',
    'html5shiv'
  ]);
});

gulp.task('build', ['lint', 'clean', 'bower'], function() {
  return mergeStream(
    bowerFiles()
      .pipe($.concat(pkg.main))
      .pipe($.replace('\r\n', '\n'))
      .pipe(gulp.dest('')),
    bowerFiles()
      .pipe($.uglify({preserveComments: saveLicense}))
      .pipe($.concat(pkg.main))
      .pipe($.replace(/^\s+\*/mg, '*'))
      .pipe($.rename({suffix: '.min'}))
      .pipe(gulp.dest(''))
  );
});

gulp.task('watch', function() {
  gulp.watch(['*.json', '.jshintrc'], ['test']);
  gulp.watch(['gulpfile.js'], ['lint']);
});

gulp.task('default', ['build', 'watch']);
