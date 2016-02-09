/**
 * Some useful links:
 *
 * http://stefanimhoff.de/2014/gulp-tutorial-12-optimize-css-javascript-images-and-html/
 *
 * https://markgoodyear.com/2014/01/getting-started-with-gulp/
 * http://jilles.me/introduction-to-gulp/
 * http://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/
 * http://inspiredjw.com/do-not-forget-to-use-gzip-for-express/
 * http://stackoverflow.com/questions/10207762/how-to-use-request-or-http-module-to-read-gzip-page-into-a-string
 *
 * http://mindthecode.com/lets-build-an-angularjs-app-with-browserify-and-gulp/
 * http://www.raymondcamden.com/2014/12/26/avoid-the-minified-angularjs-library-in-development/
 * https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917#.7cl2ld8h9
 *
 * https://calendee.com/2015/01/20/conditional-build-process-with-gulp-if/
 * //todo maybe add support for ngdocs
 */

/* jshint node:true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var argv = require('yargs').argv;
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

var config = require('./gulpconfig');

var onError = function (err) {
    $.notify.onError({
        title:    "Gulp",
        subtitle: "Crash!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);
    this.emit('end');
};

gulp.task('styles', function() {
    return gulp.src(config.styles.src)
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // keep track of changes - watches will apply task only on changed files
        .pipe($.cached(config.styles.cache))
        // compile less to css
        .pipe($.less())
        // minify css
        .pipe($.cssnano())
        // expand to browser-specific rules
        .pipe($.autoprefixer(config.styles.options.autoprefixer))
        .pipe($.rename(config.all.options.rename))
        .pipe(gulp.dest(config.styles.dest))
        // output size
        .pipe($.size());
});

gulp.task('lint', function() {
    return gulp.src(config.scripts.src)
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // keep track of changes - watches will apply task only on changed files
        .pipe($.cached(config.scripts.options.lint.cache))
        // check js code
        .pipe($.jshint())
        // add reporting tool
        .pipe($.jshint.reporter(config.scripts.options.lint.reporterType,
            config.scripts.options.lint.reporter));
        //.pipe($.jshint.reporter('jshint-stylish'))
        //.pipe($.jshint.reporter('fail'))
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src(config.scripts.src)
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // keep track of changes - watches will apply task only on changed files
        //.pipe($.cached(config.scripts.cache))
        // concat to single file
        .pipe($.concat(config.scripts.distFile))
        .pipe($.rename(config.all.options.rename))
        // add dep inj annotations to allow correct minification
        .pipe($.ngAnnotate())
        // minify js
        .pipe($.if(config.prodEnv, $.uglify()))
        .pipe(gulp.dest(config.scripts.dest))
        // output size
        .pipe($.size());
});

gulp.task('images', function() {
    return gulp.src(config.images.src)
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // keep track of changes - watches will apply task only on changed files
        .pipe($.cached(config.images.cache))
        // compress images
        .pipe($.imagemin(config.images.options.imagemin))
        .pipe(gulp.dest(config.images.dest))
        // output size
        .pipe($.size());
});

gulp.task('svgs', function() {
    return gulp.src(config.svgs.src)
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // keep track of changes - watches will apply task only on changed files
        .pipe($.cached(config.svgs.cache))
        // minify vector graphics
        .pipe($.svgmin())
        .pipe(gulp.dest(config.svgs.dest))
        // output size
        .pipe($.size());
});

gulp.task('fonts', function() {
    return gulp.src(mainBowerFiles()
        .concat(config.fonts.src))
        .pipe($.filter(config.fonts.options.filter))
        .pipe($.flatten())
        .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('others', function() {
    return gulp.src(config.others.src, config.others.options)
        // keep track of changes - watches will apply task only on changed files
        .pipe($.cached(config.others.cache))
        .pipe(gulp.dest(config.others.dest));
});

gulp.task('clean', function() {
    return del(config.clean.src);
});

gulp.task('test', function(done) {
    //todo add test suite & angular mocks
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', function() {
    gulp.watch(config.scripts.src, ['scripts']);
    gulp.watch(config.styles.srcPath, ['styles']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.svgs.src, ['svgs']);
    gulp.watch(config.others.src, ['others']);
    console.log('Started watchers...');
});

/**
 * Run modes:
 *
 * gulp deploy --type prod
 * gulp deploy --type dev
 */
gulp.task('deploy', function() {
    if (argv.type && argv.type !== 'dev') config.prodEnv = true;
    console.log('Deploy started at ' + new Date());
    runSequence('clean', 'styles', 'scripts', 'images', 'svgs', 'fonts', 'others', 'watch', function() {
        console.log('Deploy finished at ' + new Date());
    });
});

gulp.task('default', ['deploy']);