"use strict";

// Load Plugins
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    lr = require('tiny-lr'),
    eventStream = require('event-stream'),
    server = lr(),
    ts = plugins.typescript;

//Configuration
var sources = {
    sass: './src/scss/**/*.scss',
    ts: './src/ts/**/*.ts',
    js: './src/temp/*.js',
    browserify: './src/temp/app.js',
    buildDir: './dist/'
}

// Typescript
var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true
})

gulp.task('typescript', function(){
    // Store reference to typescript result
    var tsResult = gulp.src(sources.ts)
        .pipe(ts(tsProject));

    // Merge the two output streams, so this task is finished when the IO of both operations are done.
    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest(sources.js)),
        tsResult.js.pipe(gulp.dest(sources.js))
    );
})

// Bundles Javascript into a Single Bundle
gulp.task('scripts', ['typescript'], function(){
    gulp.src(sources.js)
        .pipe(plugins.browserify())
        .pipe(gulp.dest(sources.buildDir))
        .pipe(plugins.livereload(server));
})

// Compiles SASS to CSS
gulp.task('styles', function(){
    gulp.src(sources.sass)
        .pipe(plugins.sass())
        .pipe(gulp.dest(sources.buildDir))
        .pipe(plugins.livereload(server));
})

// Sets up the LiveReload server
gulp.task('livereload',function(){
    server.listen(35729, function(err){
        if(err){
            return console.log(err);
        }
    })
});

// Watch the server for changes
gulp.task('watch', ['livereload'],
  function(){
    gulp.watch(sources.scss, ['styles']);
    gulp.watch(sources.ts,['typescript']);
    gulp.watch('bower.json',['wiredep']);
  })

// Default function
gulp.task('default', ['scripts', 'styles'],function(){
    gulp.run('livereload');
    gulp.run('watch');
});