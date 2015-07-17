// sampled from https://github.com/oblador/angular-scroll/blob/master/gulpfile.js
var gulp   = require('gulp');

require('harmonize')();
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
    'src/dependencies.js',
    'src/utils.js',
    'src/formatters.js',
    'src/default-types.jsx',
    'src/basic-table.jsx',
    'src/be-table.jsx'
  ],
  tests: [
    '__tests__/*.js'
  ]
};
var testWatchPaths = [].concat(filePaths.javascript, filePaths.tests);

var swallow = notify.onError(function(err) {
  console.error('\nERROR:\n\n', err);
  return err;
});

var wrapText = [
  '(function(){\n', // prepend
  '\n})();', // append
];

// common pipeline steps for javascript builds
var jsBuildFlow = function(outpath) {
  return lazypipe()
  .pipe(concat, outpath)
  .pipe(babel)
  .pipe(wrap, wrapText[0] + '<%= contents %>' + wrapText[1]);
};

gulp.task('clean', function (cb) {
  return del(['build'], cb);
});

gulp.task('compress', ['clean'], function () {

  // development version
  gulp.src(filePaths.javascript)
    .pipe(jsBuildFlow('be-table.js')()).on('error', swallow)
    .pipe(gulp.dest('build/js'));

  // minified version
  gulp.src(filePaths.javascript)
    .pipe(sourcemaps.init())
      .pipe(jsBuildFlow('be-table.min.js')()).on('error', swallow)
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
});

gulp.task('watchtest', function() {
    gulp.watch(testWatchPaths, ['test']);
});

gulp.task('test', ['build'], function () {
  return gulp.src('__tests__')
    .pipe(jest({
      testDirectoryName: "__tests__",
      unmockedModulePathPatterns: [
        "node_modules/react"
      ]
    }));
});

/**
 * doesn't build
 */
gulp.task('circletest', function () {
  return gulp.src('__tests__')
    .pipe(jest({
      testDirectoryName: "__tests__",
      unmockedModulePathPatterns: [
        "node_modules/react"
      ]
    }));
});

gulp.task('build', ['clean', 'compress']);
gulp.task('dev', ['build', 'watch']);
gulp.task('default', ['test', 'build']);
