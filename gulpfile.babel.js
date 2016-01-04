'use strict'

import gulp from 'gulp';
import sass from "gulp-sass";
import haml from "gulp-haml";
import autoprefixer from "gulp-autoprefixer";
import frontnote from "gulp-frontnote";
import browser from "browser-sync";
import plumber from "gulp-plumber";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";

import handleErrors from "./handle-errors.js";

gulp.task("sass", () => {
    gulp.src("sass/**/*.scss")
        .pipe(plumber())
        .pipe(frontnote({css: '../css/style.css'}))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./publish/css"))
        .pipe(browser.reload({stream:true}));
});

gulp.task("js", () => {
    browserify({entries: ["./js/main.js"]})
        .transform(babelify)
        .bundle()
        .on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("./publish/js"));
});

gulp.task("haml", () =>{
    gulp.src("haml/**/*.haml")
        .pipe(plumber())
        .pipe(haml({pretty: true}))
        .pipe(gulp.dest("./publish/"));

});

gulp.task("reload", () =>{
    browser.reload()
});

gulp.task("server", () => {
    browser({
        server: {
            baseDir: "./publish/"
        }
    });
});

gulp.task("default", ['server'], () => {
    gulp.watch("js/**/*.js", ["js", "reload"]);
    gulp.watch("sass/**/*.scss", ["sass"]);
    gulp.watch("haml/**/*.haml", ["haml", "reload"]);
});

