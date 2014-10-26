var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    gutil = require('gulp-util'),
    sources = require('./config.json').sources,
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    debowerify = require('debowerify'),
    path = require('path'),
    del = require('del');

// Cleanup Temp Folder of Compiled Typescript
gulp.task('clean:temp_js', function(cb){
    return del(sources.ts_out + '/**/*',cb);
});

// Cleanup Temp Folder of Bundled Javascript
gulp.task('clean:dist_js', function(cb){
    return del(sources.build_dir + '/**/*.js', cb);
})

// Typescript
gulp.task('typescript', ['clean:temp_js'], function(cb){
    return gulp.src(sources.ts_in)
        .pipe(plugins.plumber())
        .pipe(plugins.tsc({
            sourcemap: false,
            emitError: false,
            module: "commonjs"
        }))
        .on('error', function(error){console.log(error)})
        .pipe(gulp.dest(sources.ts_out));
})

// Bundles Javascript into a Single Bundle
gulp.task('scripts', ['typescript'], function(){
    return gulp.src(sources.js_in)
        .pipe(plugins.plumber())
        .pipe(plugins.foreach(function(steam,file){
            return browserify(file)
            .on('error',gutil.log.bind(gutil, "browserify error: "))
            .transform('debowerify')
            .bundle()
            .pipe(source('./' + path.basename(file.path)))
            .pipe(gulp.dest(sources.build_dir + "/js"));
        }))
        .on('error', function(error){console.log(error)});
})