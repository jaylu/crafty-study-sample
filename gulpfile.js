var _ = require('underscore');
var autoprefix = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var es = require('event-stream');
var gulp = require('gulp');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');
var lrServer = require('tiny-lr')();
var protractor = require('gulp-protractor').protractor;
var replace = require('gulp-replace');
var rjs = require('gulp-requirejs');
var sass = require('gulp-ruby-sass');
var less = require('gulp-less');
var spawn = require('child_process').spawn;
var uglify = require('gulp-uglify');
var webdriver = require('gulp-protractor').webdriver;
var express = require('express');
var path = require('path');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    gulp.src('build/**/*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('less', function () {
    gulp.src('source/less/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./source/assets/css'))
        .pipe(livereload(lrServer));
});

gulp.task('js', function () {
    var configRequire = require('./source/js/config-require.js');
    var configBuild = {
        baseUrl: 'source/js',
        name: 'main',
        optimize: 'none',
        out: 'main.js',
        wrap: true
    };
    var config = _(configBuild).extend(configRequire);

    rjs(config)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(livereload(lrServer));
});

gulp.task('karma-ci', function () {
    return gulp.src(['no need to supply files because everything is in config file'])
        .pipe(karma({
            configFile: 'karma-compiled.conf.js',
            action: 'run'
        }));
});

gulp.task('watch', ['server'], function () {
    var port = 35729;
    lrServer.listen(port, function (err) {
        if (err) {
            console.log(err);
        }
        gulp.watch('./source/less/**/*.less', ['less']);
        gulp.watch('./source/*.html', function (event) {
            gulp.src(event.path, {read: false})
                .pipe(livereload(lrServer));
        });
    });
    console.log('live load server start on port:' + port);
});

gulp.task('server', function () {
    var port = 4000;
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static('source'));
    app.listen(port);
    console.log('static server start on port:' + port);
});

// Copy
gulp.task('copy', ['less', 'js'], function () {
    return es.concat(
        // update index.html to work when built
        gulp.src(['source/index.html'])
            .pipe(replace("require(['./js/main.js'])", "require(['./js/main.js'], function () { require(['main']); })"))
            .pipe(gulp.dest('build')),
        // copy config-require
        gulp.src(['source/js/config-require.js'])
            .pipe(uglify())
            .pipe(gulp.dest('build/js')),
        // copy vendor files
        gulp.src(['source/vendor/**/*'])
            .pipe(gulp.dest('build/vendor')),
        // copy assets
        gulp.src(['source/assets/**/*'])
            .pipe(gulp.dest('build/assets')),
        // minify requirejs
        gulp.src(['build/vendor/requirejs/require.js'])
            .pipe(uglify())
            .pipe(gulp.dest('build/vendor/requirejs')),
        // minify domReady
        gulp.src(['build/vendor/requirejs-domready/domReady.js'])
            .pipe(uglify())
            .pipe(gulp.dest('build/vendor/requirejs-domready'))
    );
});

gulp.task('build', ['less', 'js', 'copy']);
