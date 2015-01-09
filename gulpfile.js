"use strict";

// Load Plugins
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    requireDir = require('require-dir'),
    config = require('./gulp/config.json'),
    sources = config.sources,
    dir = requireDir('./gulp');

// Watch the server for changes
gulp.task('watch', ['styles:init'],function(){
    gulp.watch(sources.images, ['images']);
    gulp.watch(sources.sass_watch, ['styles']);

    // Don't compile typescript if in visual studio mode
    if(config.isVisualStudio)
    {
        gulp.watch(sources.js_watch, ['scripts']);
    }
    else
    {
        gulp.watch(sources.ts_in, ['scripts']);
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
    'watch'], function () { });