'use strict';

var gulp = require('gulp'),
    expect = require('gulp-expect-file'),
    es = require('event-stream'),
    sass = require('gulp-sass'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed');

var handleErrors = require('./gulp/handle-errors'),
    util = require('./gulp/utils'),
    inject = require('./gulp/inject');

var config = require('./gulp/config');


gulp.task(
    'sass', function () {
        return es.merge(
            gulp.src(config.sassSrc)
                .pipe(plumber({errorHandler: handleErrors}))
                .pipe(expect(config.sassSrc))
                .pipe(changed(config.cssDir, {extension: '.css'}))
                .pipe(sass({includePaths: config.bower}).on('error', sass.logError))
                .pipe(gulp.dest(config.cssDir))
        );
    }
);

gulp.task(
    'inject:dep', [
        'inject:vendor'
    ]
);

gulp.task('inject:app', inject.app);

gulp.task('inject:vendor', inject.vendor);

gulp.task(
    'ngconstant:dev', function () {
        return ngConstant(
            {
                name: 'app.blocks',
                constants: {
                    VERSION: util.parseVersion(),
                    DEBUG_INFO_ENABLED: true,
                    API_URI: util.parseApiUri()
                },
                template: config.constantTemplate,
                stream: true,
                wrap: false
            }
        )
            .pipe(rename('BlocksConstants.js'))
            .pipe(gulp.dest(config.app + 'app/blocks/'));
    }
);

gulp.task(
    'watch', function () {
        gulp.watch('bower.json', ['install']);
        gulp.watch(
            [
                'gulpfile.js'
            ], ['ngconstant:dev']
        );
        gulp.watch(config.sassSrc, ['styles']);
        gulp.watch(config.app + 'content/images/**', ['images']);
        gulp.watch(config.app + 'app/**/*.js', ['inject:app']);
        gulp.watch(
            [
                config.app + '*.html',
                config.app + 'app/**',
                config.app + 'i18n/**'
            ]
        ).on('change', browserSync.reload);
    }
);

gulp.task(
    'install', function () {
        runSequence(
            [
                'inject:dep',
                'ngconstant:dev'
            ], 'sass', 'inject:app'
        );
    }
);

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(gulpDocs.process())
        .pipe(gulp.dest('./docs'));
});

gulp.task('default', ['install']);
