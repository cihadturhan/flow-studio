'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject'),
    naturalSort = require('gulp-natural-sort'),
    order = require('gulp-order'),
    bowerFiles = require('main-bower-files');

var handleErrors = require('./handle-errors');

var config = require('./config');

module.exports = {
    app: app,
    vendor: vendor
};

function app() {
    return gulp.src(config.app + 'index.html')
        .pipe(inject(gulp.src(config.app + 'app/**/*.js')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(naturalSort())
            .pipe(order(config.jsOrder)), {relative: true}))
        .pipe(gulp.dest(config.app));
}

function vendor() {
    var stream = gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(gulp.dest(config.app));

    return stream;
}