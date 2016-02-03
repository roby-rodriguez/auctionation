/**
 * Some useful links:
 *
 * http://stefanimhoff.de/2014/gulp-tutorial-12-optimize-css-javascript-images-and-html/
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
 * //todo maybe add support for ngdocs
 */

/* jshint node:true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var $ = require('gulp-load-plugins')();

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
    return gulp.src('public/styles/main.less')
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // compile less to css
        .pipe($.less())
        // minify css
        .pipe($.cssnano())
        // expand to browser-specific rules
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe($.rename({suffix : '.min'}))
        .pipe(gulp.dest('public/dist/styles'))
        // output size
        .pipe($.size());
});

gulp.task('lint', function() {
    return gulp.src('public/scripts/**/*.js')
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // check js code
        .pipe($.jshint())
        // add reporting tool
        .pipe($.jshint.reporter('default', { verbose: true }));
        //.pipe($.jshint.reporter('jshint-stylish'))
        //.pipe($.jshint.reporter('fail'))
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src('public/scripts/**/*.js')
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.rename({suffix: '.min'}))
        // add dep inj annotations to allow correct minification
        .pipe($.ngAnnotate())
        // minify js
        .pipe($.uglify())
        .pipe(gulp.dest('public/dist/scripts'))
        // output size
        .pipe($.size());
});

gulp.task('images', function() {
    return gulp.src('public/resources/images/**/*')
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // process only modified images
        .pipe($.newer('public/dist/images'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('public/dist/resources/images'))
        // output size
        .pipe($.size());
});

gulp.task('svgs', function() {
    return gulp.src('public/resources/images/**/*.svg')
        // prevents gulp from crashing
        .pipe($.plumber({errorHandler: onError}))
        // process only modified images
        .pipe($.newer('public/dist/images'))
        .pipe($.svgmin())
        .pipe(gulp.dest('public/dist/resources/images'))
        // output size
        .pipe($.size());
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')()
        .concat('bower_components/bootstrap/fonts/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('public/dist/resources/fonts'));
});

gulp.task('others', function() {
    return gulp.src([
        'public/views/**/*.html',
        'public/templates/**/*.html',
        'public/*.*'
    ], { base: 'public' }).pipe(gulp.dest('public/dist'));
});

gulp.task('clean', function() {
    return del(['public/dist']);
});

gulp.task('test', function(done) {
    //todo add test suite & angular mocks
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', function() {
    gulp.watch('public/styles/**/*.js', ['lint']);
    gulp.watch('public/styles/**/*.less', ['styles']);
});

gulp.task('deploy', function() {
    console.log('Deploy started at ' + new Date());
    runSequence('clean', 'styles', 'scripts', 'images', 'svgs', 'fonts', 'others', function() {
        console.log('Deploy finished at ' + new Date());
    });
});