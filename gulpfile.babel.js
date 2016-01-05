'use strict'

import gulp from 'gulp';
// file system node標準ぽい
import fs from 'fs'
import sass from "gulp-sass";
import haml from "gulp-haml";
// cssにvendor prefix をつける
import autoprefixer from "gulp-autoprefixer";
// css のスタイルガイドを作成、一人作業にはオーバースペック感
import frontnote from "gulp-frontnote";
// livereload 等
import browser from "browser-sync";
// 処理中にエラー出ても watcheを止めない
import plumber from "gulp-plumber";
import browserify from "browserify";
// browerify用babel
import babelify from "babelify";
// browserify がgulp.srcが使えないので生のstreamを取る用
import source from "vinyl-source-stream";
// 画像の最適化
import image from "gulp-image"

var config = JSON.parse(fs.readFileSync('/Users/yuichi/.aws/u1tnk_s3.json'));
// require('hoge')(args)が書けないようなので
import s3module from 'gulp-s3-upload'
var s3 = s3module(config)

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

gulp.task("haml", () => {
    gulp.src("haml/**/*.haml")
        .pipe(plumber())
        .pipe(haml({pretty: true}))
        .pipe(gulp.dest("./publish/"));
});

gulp.task('image', () => {
    gulp.src('./images/**/*.+(jpg|jpeg|JPG|png|PNG|gif|GIF)')
        .pipe(plumber())
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            advpng: true,
            jpegRecompress: false,
            jpegoptim: true,
            gifsicle: true,
            mozjpeg: true,
        }))
        .pipe(gulp.dest('./publish/images'));
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

gulp.task("build", ['sass', 'js', 'image', 'haml'])

gulp.task("develop", ['server'], () => {
    gulp.watch("js/**/*.js", ["js", "reload"]);
    gulp.watch("sass/**/*.scss", ["sass"]);
    gulp.watch("haml/**/*.haml", ["haml", "reload"]);
    gulp.watch('./images/**/*.+(jpg|jpeg|JPG|png|PNG|gif|GIF)', ["image", "reload"]);
});

gulp.task("deploy-staging", ['build'], function() {
  gulp.src(["./publish/**", "!./publish/**/.*"])
    .pipe(s3({
      Bucket: 'petit-ballon-staging',
      ACL: 'public-read',
    }))
  ;
});
