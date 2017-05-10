/**
 * Created by hp on 2017/5/9.
 */
var  gulp = require ("gulp") ;
var  uglify = require ("gulp-uglify");
var  sass = require('gulp-sass');//sass编译
var  concat = require ("gulp-concat");
var  rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');//css的压缩2
var webserver = require ('gulp-webserver');//启动一个热服务
var imgmin = require ("gulp-imagemin");//压缩图片
var rev = require('gulp-rev');//MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var datajson=require("./data/main.js");
var url=require("url");
gulp.task("default",function () {

});

gulp.task("jsmin",function () {//压缩js
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat("common.js"))
        .pipe(rev())//MD5
        .pipe(gulp.dest("bulid/js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'))
})

//编译sass
gulp.task("mincss",function () {
    gulp.src("src/css/*.sass")
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename("index.css"))
        .pipe(rev())//MD5
        .pipe(gulp.dest("bulid/css"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'))
});
gulp.task("html",function () {
    gulp.src("src/html/index.html")
        .pipe(gulp.dest("bulid/html"));
})
gulp.task("minimg",function () {
    gulp.src("img/img.jpg")
        .pipe(imgmin())
        .pipe(gulp.dest("bulid/img"))
})
gulp.task("bulid",["jsmin","mincss","html","rev"])
//启动一个服务
gulp.task("webserver",["bulid"],function () {
    gulp.watch(".bulid/css/*.sass",["mincss"])//监听
    gulp.watch(".build/html/*.html",["html"])//监听
    gulp.src("./bulid")
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            middleware:function(req,res,next){
                const reqPath=url.parse(req.url).pathname
                //req 请求
                // req 返回
                const routes=datajson.data()
                routes.forEach(function(i){
                    if(i.route==reqPath){
                        i.handle(req,res,next)
                    }
                })
                next()
            },
            open: "html/index.html"
        }))
})

//重新命名的任务
gulp.task("rev",function () {
    gulp.src(["./rev/**/*.json","./src/html/*.html"])
        .pipe(revCollector({
            replaceReved:true,
            dirReplacements:{
                "css":"../css",
                "js":"../js"
            }
        }))
        .pipe(gulp.dest("./bulid/html"))
})