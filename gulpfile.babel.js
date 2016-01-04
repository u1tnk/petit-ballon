'use strict'

import gulp from 'gulp';
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import frontnote from "gulp-frontnote";
import uglify from "gulp-uglify";
import browser from "browser-sync";
import plumber from "gulp-plumber";
import browserify from "browserify";
import source from "vinyl-source-stream";

import handleErrors from "./handle-errors.js";

gulp.task("sass", function(){
    gulp.src("sass/**/*.scss")
        .pipe(plumber())
        .pipe(frontnote({css: '../css/style.css'}))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./css"))
        .pipe(browser.reload({stream:true}));
});

gulp.task("js", function() {
    browserify({entries: ["./js.dev/index.js"]})
        .bundle()
        .on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("./js"))
        .pipe(browser.reload({stream:true}));
});

// gulp.task("js", function() {
//     gulp.src(["js.dev/**/*.js"])
//         .pipe(plumber())
//         .pipe(uglify())
//         .pipe(gulp.dest("./js"))
//         .pipe(browser.reload({stream:true}));
// });

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("default", ['server'], function() {
    gulp.watch(["js.dev/**/*.js"],["js"]);
    gulp.watch("sass/**/*.scss",["sass"]);
});

