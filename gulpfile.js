'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    merge = require('merge2'); //,
    //tsProject = tsc.createProject('tsconfig.json')
    ;

var concat = require("gulp-concat");
var config = new Config();

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

gulp.task('compile', ['compile-commonjs', 'compile-amd']);
gulp.task('default', ['ts-lint', 'ts-compile']);