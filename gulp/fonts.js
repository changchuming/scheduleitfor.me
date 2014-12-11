var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sources = require('./config.json').sources;

gulp.task('fonts', function(){
    return gulp.src(sources.fonts)
        .pipe(plugins.newer(sources.fonts_out))
        .pipe(gulp.dest(sources.fonts_out));
});