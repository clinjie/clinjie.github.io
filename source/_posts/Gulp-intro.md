title: Gulp介绍
date: 2016-04-06 14:17:22
toc: true
tags: Gulp
categories: Gulp
---

# 介绍 #

## 什么是Gulp ##

`gulp.js`是一种基于流的，代码优于配置的新一代构建工具.[官方文档](https://github.com/gulpjs/gulp/tree/master/docs)

`Gulp`和`Grunt`类似。但相比于 Grunt 的频繁的 I/O 操作，Gulp 的流操作，能更快地完成构建<!--more-->

## Gulp特性 ##

- 使用方便

通过代码优于配置的策略，Gulp可以让简单的任务简单，复杂的任务更可管理。

- 构建快速

通过流式操作，减少频繁的 IO 操作，更快地构建项目。

- 插件高质

Gulp 有严格的插件指导策略，确保插件能简单高质的工作。

- 易于学习

少量的API，掌握Gulp可以毫不费力。构建就像流管道一样，轻松加愉快。


# Gulp安装 #

Gulp是基于`Node.js`的，故要首先安装 Node.js。

`npm install -g gulp`

然后按以下清单文件安装

```
gulp
gulp-htmlclean
gulp-htmlmin
gulp-imagemin
gulp-minify-css
gulp-uglify
```

方法是同样的,`npm install xxx --save`，xxx即为清单列表文件名


其中gulp是工程的核心程序，Gulp采用插件方式进行工作，下面的5个文件就是基于Gulp的插件.[Gulp插件列表](http://gulpjs.com/)

# 使用Gulp优化Hexo #

## 建立gulpfile.js ##

```js
var gulp = require('gulp');

	//Plugins模块获取
    var minifycss = require('gulp-minify-css');
    var uglify = require('gulp-uglify');
    var htmlmin = require('gulp-htmlmin');
    var htmlclean = require('gulp-htmlclean');
    var imagemin = require('gulp-imagemin')

    // 压缩 public 目录 css文件
    gulp.task('minify-css', function() {
        return gulp.src('./public/**/*.css')
            .pipe(minifycss())
            .pipe(gulp.dest('./public'));
    });

    // 压缩 public 目录 html文件
    gulp.task('minify-html', function() {
      return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
             removeComments: true,
             minifyJS: true,
             minifyCSS: true,
             minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'))
    });

    // 压缩 public/js 目录 js文件
    gulp.task('minify-js', function() {
        return gulp.src('./public/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('./public'));
    });


    // 压缩图片任务
    // 在命令行输入 gulp images 启动此任务
    gulp.task('images', function () {
        // 1. 找到图片
        gulp.src('./photos/*.*')
        // 2. 压缩图片
            .pipe(imagemin({
                progressive: true
            }))
        // 3. 另存图片
            .pipe(gulp.dest('dist/images'))
    });



    // 执行 gulp 命令时执行的任务
    gulp.task('default', [
        'minify-html','minify-css','minify-js','images'
    ]);
```

## 运行 ##

要运行gulp任务，只需切换到存放gulpfile.js文件的目录，然后在终端中执行gulp命令就行了，gulp后面可以加上要执行的任务名，例如gulp task1，如果没有指定任务名，则会执行任务名为default的默认任务。