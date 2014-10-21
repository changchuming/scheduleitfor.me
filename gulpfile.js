"use strict";

// Load Plugins
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    rimraf = require('rimraf');

//Configuration
var sources = {
    sass: './src/scss/**/*.scss',
    ts: './src/ts/**/*.ts',
    tsOut: './src/temp',
    browserify: './src/temp/app.js',
    buildDir: './dist'
}

// Clean Before Doing Any Output
gulp.task('clean:js', function(cb){
    rimraf(sources.tsOut + '/**/',cb    );
});
gulp.task('clean:build', function(cb){
    rimraf(sources.buildDir + '/**/*',cb);
})

// Typescript
gulp.task('typescript', ['clean:js'], function(){
    gulp.src(sources.ts)
        .pipe(plugins.tsc({
            sourcemap: true,
            emitError: false
        }))
        .pipe(gulp.dest(sources.tsOut));
})

// Bundles Javascript into a Single Bundle
gulp.task('scripts', ['types    cript'], function(){
    gulp.src(sources.browserify)
        .pipe(plugins.browserify())
        .pipe(gulp.dest(sources.buildDir));
})

// Compiles SASS to CSS
gulp.task('styles', function(){
    gulp.src(sources.sass)
        .pipe(plugins.sass())
        .pipe(gulp.dest(sources.buildDir));
})

// Watch the server for changes
gulp.task('watch', function(){
    var lr = plugins.livereload;

    lr.listen();

    gulp.watch(sources.scss, ['styles']).on('change', lr.changed);
    gulp.watch(sources.ts, ['scripts']).on('change', lr.changed);
  })

// Default function
gulp.task('default', [
    'clean:build',
    'clean:js',
    'scripts',
    'styles',
    'watch'], function(){});