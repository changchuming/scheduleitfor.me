var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sources = require('./config.json').sources,
    del = require('del');

gulp.task('clean:img', function(cb){
    del(sources.imagesOut + '/**/*', cb);
})

// Compress Images
gulp.task('images', ['clean:img'], function(){
    gulp.src(sources.images)
        .pipe(plugins.plumber())
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(sources.images_out));
});