"use strict";

// Load Plugins
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    pngcrush = require('imagemin-pngcrush'),
    del = require('del');

//Configuration
var isDevelopment = true,
    sources = {
        srcDir: './web',
        buildDir: './public',
        sass: './web/scss/**/*.scss',
        ts: './web/ts/**/*.ts',
        tsOut: './web/temp',
        browserify: './web/temp/*.js',
        images: './web/img/**/*',
        imagesOut: './public/images/'
    };

// Cleanup Tasks
gulp.task('clean:js', function(cb){
    del(sources.tsOut + '/**/*',cb);
});

gulp.task('clean:buildJs', function(cb){
    del(sources.buildDir + '/**/*.js', cb);
})

gulp.task('clean:img', function(cb){
    del(sources.imagesOut + '/**/*', cb);
})

gulp.task('clean:css', function(cb){
    del(sources.buildDir + '/**/*.css', cb);
})

gulp.task('clean:build', [
    'clean:buildJs',
    'clean:img',
    'clean:css'], function(){});

// Compress Images
gulp.task('images', ['clean:img'], function(){
    gulp.src(sources.images)
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(sources.imagesOut));
});

// Typescript
gulp.task('typescript', function(){
    gulp.src(sources.ts)
        .pipe(plugins.tsc({
            sourcemap: true,
            emitError: false
        }))
        .pipe(gulp.dest(sources.tsOut));
})

// Bundles Javascript into a Single Bundle
gulp.task('scripts', ['typescript', 'clean:buildJs'], function(){
    gulp.src(sources.browserify)
        .pipe(plugins.browserify({
            transform: 'debowerify'
        }))
        .pipe(gulp.dest(sources.buildDir));
})

// Compiles SASS to CSS
gulp.task('styles', ['clean:css'],function(){
    gulp.src(sources.sass)
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest(sources.buildDir));
})

// Watch the server for changes
gulp.task('watch', function(){
    var lr = plugins.livereload;

    lr.listen();

    gulp.watch(sources.images, ['images']).on('change', lr.changed);
    gulp.watch(sources.scss, ['styles']).on('change', lr.changed);
    gulp.watch(sources.ts, ['scripts']).on('change', lr.changed);
  })

// Default function
gulp.task('default', [
    'images',
    'scripts',
    'styles',
    'watch'], function(){});