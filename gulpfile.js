// sampled from https://github.com/oblador/angular-scroll/blob/master/gulpfile.js
var gulp   = require('gulp');

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');
var jest = require('gulp-jest');
var jshint = require('gulp-jshint');
var lazypipe = require('lazypipe');
var notify = require('gulp-notify');
var react = require('gulp-react');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

var filePaths = {
  javascript: [
    'src/preamble.js',
    'src/utils.js',
    'src/formatters.js',
    'src/be-table.jsx',
  ]
};

var swallow = notify.onError(function(err) {
  console.error('\nERROR:\n\n', err);
  return err;
});

var wrapText = [
  '(function(){\n"use strict";\nvar require = require || function() {};\n', // prepend
  '\n})();', // append
];

// common pipeline steps for javascript builds
var jsBuildFlow = function(outpath) {
  return lazypipe()
  // .pipe(react, {harmony: true})
  // .pipe(babel, {modules: 'common'})
  .pipe(concat, outpath)
  .pipe(wrap, wrapText[0] + '<%= contents %>' + wrapText[1]);
}

gulp.task('clean', function (cb) {
  return del(['build'], cb);
});

gulp.task('compress', ['clean'], function () {

  // development version
  gulp.src(filePaths.javascript)
    // .pipe(react({harmony: true})).on('error', swallow)
    .pipe(babel({modules: null})).on('error', swallow)
    .pipe(jsBuildFlow('be-table.js')())
    // .pipe(babel()).on('error', swallow)
    // .pipe(concat('be-table.js'))
    // .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(gulp.dest('build/js'));

  // minified version
  gulp.src(filePaths.javascript)
    .pipe(sourcemaps.init())
      // .pipe(react({harmony: true})).on('error', swallow)
      .pipe(babel({modules: null})).on('error', swallow)
      .pipe(jsBuildFlow('be-table.min.js')())
      // .pipe(babel()).on('error', swallow)
      // .pipe(concat('be-table.min.js'))
      // .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
      .pipe(uglify()).on('error', swallow)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('lint', function() {
  return gulp.src(filePaths.javascript)
    .pipe(jsBuildFlow('be-table.js')())
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
    gulp.watch(filePaths.javascript, ['build']);
})

gulp.task('test', function () {
  return gulp.src('__tests__')
    .pipe(jest({
      testDirectoryName: "__tests__",
      unmockedModulePathPatterns: [
        "node_modules/react"
      ]
    }))
});

gulp.task('build', ['clean', 'compress']);
gulp.task('dev', ['build', 'watch']);
gulp.task('default', ['test', 'build']);
