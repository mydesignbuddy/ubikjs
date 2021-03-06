'use strict';

var gulp = require('gulp'),
    //debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    //sourcemaps = require('gulp-sourcemaps'),
    //del = require('del'),
    Config = require('./gulpfile.config'),
    mocha = require('gulp-mocha'),
    merge = require('merge2'),
    gulpSequence = require('gulp-sequence'),
    watch = require('gulp-watch')
;

//var concat = require("gulp-concat");
var config = new Config();


gulp.task('test', function () {
  gulp.src('test/**/*.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('watch', function () {
    // Endless stream mode
    return watch('src/**/*.ts', { ignoreInitial: false })
        .pipe(gulp.dest('gulp'));
});

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('gen-ts-refs', function () {
    var target = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src([config.allTypeScript], { read: false });
    return target.pipe(inject(sources, {
        starttag: '//{',
        endtag: '//}',
        transform: function (filepath) {
            return '/// <reference path="../..' + filepath + '" />';
        }
    })).pipe(gulp.dest(config.typings));
});


gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report());
});

gulp.task('ts-compile', function () {
    var tsProject = tsc.createProject('tsconfig.json', { outFile: 'ubik.js' });

    var tsResult = gulp.src('./src/**/*.ts')
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('./dist'));
});

gulp.task('compile-commonjs', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(tsc({
            declaration: true,
            module: 'commonjs'
        }));
    return merge([
        //tsResult.dts.pipe(gulp.dest('dist/definitions')),
        tsResult.js.pipe(gulp.dest('dist/commonjs'))
    ]);
});
gulp.task('compile-amd', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(tsc({
            declaration: true,
            module: 'amd',
            outFile: 'ubik.js'
        }));
    return merge([
        //tsResult.dts.pipe(gulp.dest('dist/definitions')),
        tsResult.js.pipe(gulp.dest('dist/amd'))
    ]);
});


gulp.task('compile-dist', gulpSequence('compile-commonjs', 'compile-amd'));
gulp.task('default', gulpSequence('ts-lint', 'ts-compile', 'compile-dist'));
