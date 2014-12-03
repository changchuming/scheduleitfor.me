"use strict";

// Load Plugins
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    requireDir = require('require-dir'),
    config = require('./gulp/config.json'),
    sources = config.sources,
    dir = requireDir('./gulp');

// Watch the server for changes
gulp.task('watch', function(){
    var lr = plugins.livereload;

    lr.listen();

    gulp.watch(sources.images, ['images']).on('change', lr.changed);
    gulp.watch(sources.sass_in, ['styles']).on('change', lr.changed);

    // Don't compile typescript if in visual studio mode
    if(config.isVisualStudio)
    {
        gulp.watch(sources.js_in, ['scripts']).on('change', lr.changed);
    }
    else
    {
        gulp.watch(sources.ts_in, ['scripts']).on('change', lr.changed);
    }

  })

// Default function
gulp.task('default', [
    'clean:dist_js',
    'clean:img',
    'clean:css',
    'images',
    'scripts',
    'fonts',
    'styles:init',
    'watch'], function(){});