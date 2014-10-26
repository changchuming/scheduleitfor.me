var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sources = require('./config.json').sources,
    del = require('del');

// Clean out Images Folder
gulp.task('clean:css', function(cb){
    del(sources.build_dir + '/**/*.css', cb);
})

// Compiles SASS to CSS
gulp.task('styles', ['clean:css'],function(){
    gulp.src(sources.sass_in)
        .pipe(plugins.plumber())
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest(sources.build_dir + "/css"));
})