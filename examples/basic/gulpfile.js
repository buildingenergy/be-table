var gulp = require('gulp');
var del = require('del');

var beTablePath = '../../build/js/be-table.js';
var cleanTargets = ['js/vendor'];

gulp.task('build', function () {
  return gulp.src(beTablePath).pipe(gulp.dest('js/vendor'));
});

gulp.task('clean', function (done) {
  del(cleanTargets, done);
});
