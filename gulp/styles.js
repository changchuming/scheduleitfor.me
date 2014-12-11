var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sources = require('./config.json').sources,
    del = require('del');

// Clean out Images Folder
gulp.task('clean:css', function (cb){
    return del(sources.build_dir + '/**/*.css', cb);
})

gulp.task('clean:csslib', function (cb){
    return del(sources.sass_lib + '/**/*', cb);
})

gulp.task('copy:csslib', ['clean:csslib'], function (cb){
    console.log("Hi");
    return gulp.src('./bower_components/**/*.css')
        .pipe(plugins.rename({
            extname: ".scss"
        }))
        .pipe(gulp.dest(sources.sass_lib));
})

gulp.task('styles:init', ['copy:csslib'],function(){return styles();});

// Compiles SASS to CSS
gulp.task('styles', ['clean:css'], function (){return styles();
});

function styles(){
    gulp.src(sources.sass_in)
        .pipe(plugins.plumber())
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest(sources.build_dir + "/css"));
}