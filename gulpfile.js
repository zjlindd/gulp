//开始gulp使用
var gulp=require("gulp");
var $=require("gulp-load-plugins");
var less = require('gulp-less');
var autoPreFixer=require('gulp-autoprefixer');
var cssMin=require('gulp-autoprefixer');
var plumber=require("gulp-plumber");
var concat=require("gulp-concat");
var uglify=require("gulp-uglify");
var imagemin=require("gulp-imagemin");
var clean=require("gulp-clean");
var open=require("open");
var connect=require("gulp-connect");

//定义目录路径
var app={
	"srcPath":"src/",
	"devPath":"build/",
	"prdPath":"dist/",   
}
//定义任务
gulp.task("lib",function(){
	gulp.src("bower_components/**/*.js")
	.pipe(gulp.dest(app.devPath+"lib"))
	.pipe(gulp.dest(app.prdPath+"lib"))	
});

//html 搬家
gulp.task("html",function(){
    gulp.src(app.srcPath+"views/**/*.html")
        .pipe(gulp.dest(app.devPath+"template"))
        .pipe(gulp.dest(app.prdPath+"template"))
});
//json搬家
gulp.task('json', function() {
    gulp.src(app.srcPath + 'data/**/*.json') //所有的json文件照搬到另外两个目录
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe(gulp.dest(app.prdPath + 'data'))
});
//编译less文件并压缩less
gulp.task('less', function() { //使用less编写的css
    gulp.src(app.srcPath + 'style/1.less') //index.less导入其他less文件
        .pipe(less()) //less转为css
        .pipe(autoPreFixer()) //自动添加浏览器前缀
        .pipe(gulp.dest(app.devPath + 'css'))
        .pipe(cssMin()) //压缩css
        .pipe(gulp.dest(app.prdPath + 'css'))
});
//js文件的压缩混肴
gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
        .pipe(plumber()) //阻止gulp插件发生错误导致进程退出并输出错误日志。
        .pipe(concat('index.js')) //全部打包为index.js
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe(uglify())// 混淆（丑化）js
        .pipe(gulp.dest(app.prdPath + 'js'))
});
//image图片的压缩
gulp.task('image', function() {
    gulp.src(app.srcPath + 'image/**/*')
        .pipe(gulp.dest(app.devPath + 'image'))
        .pipe(imagemin())
        .pipe(gulp.dest(app.prdPath + 'image'))
});

//清除文件夹包括所有的文件
gulp.task('clean', function() { //这个任务清除文件夹
    gulp.src([app.devPath, app.prdPath])
        .pipe(clean());
});

//任务依赖
gulp.task('build', ['image', 'js', 'less', 'lib', 'html', 'json']);

//开一个服务器
gulp.task('server', ['build'], function() {
    connect.server({
        root: [app.devPath],
        liverload: true,
        port: 3000
    });
	open('http://localhost:3000'); //自动打开浏览器
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

gulp.task('default', ['server']);