var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('js', function() {
    gulp.src('src/js/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('./'))
});
