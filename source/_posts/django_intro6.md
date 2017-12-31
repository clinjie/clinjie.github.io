title: Django初识6
date: 2016-09-18 12:24:06
tags:
- python
categories: python
---

# 静态文件相关 #
----------

除了服务端生成的 HTML 以外，网络应用通常需要一些其他的文件——比如图片，脚本和样式表——来帮助渲染网络页面。在 Django 中，我们把这些文件统称为“静态文件”。

<!--more-->
django.contrib.staticfile将各个应用的静态文件（和一些你指明的目录里的文件）统一收集起来，这样一来，在生产环境中，这些文件就会集中在一个便于分发的地方。


首先，在 polls 目录下创建一个 static 目录。 Django 将会从这里收集静态文件，就像 Django 在 polls/templates 里寻找模板一样。

Django 的 STATICFILES_FINDERS 设置项是一个列表，它包含了若干个知道如何从不同地点寻找静态文件的搜寻器。其中之一是 AppDirectoriesFinder，它会从 INSTALLED_APPS 中各个应用的 “static” 子目录中寻找文件，比如刚刚创建的 polls/static。 之前的管理页面也使用了相同的目录结构来管理静态文件。

在刚创建的 static 目录下创建一个 polls 目录，再在其中新建文件 style.css。也就是说，你的样式文件的位置是 polls/static/polls/style.css。由于 AppDirectoriesFinder 的存在，你可以在 Django 中使用 polls/style.css 来引用这个文件，就像我们引用模板文件那样。


## 静态文件命名空间 ##

和模板一个样，虽然我们可以直接把样式表放在 polls/static 目录下（而不是再创建一个 polls 子目录），但是这并不是个好主意。Django 将会使用它找到的第一个和名称项匹配文件，当你在另一个应用里也有一个同名的文件的话，Django 将无法区分它们。我们想让 Django 能够找到正确的文件，最简单的方法就是使用命名空间。也就是把静态文件放到一个和应用同名的子目录中。


- css文件

在polls/static/polls/style.css文件中编辑：

```css
li a{
	color:red;
}
```


- html模板

![](http://peihao.space/img/article/djaogo/django_6_1.png)

load staticfiles语句会从staticfiles模板库里导入static模板标签，static标签会把静态文件引用转换成绝对地址

## 设置背景图片 ##

在static目录下设置专门存放图片的文件夹img,网页的背景图片地址为

polls/static/polls/img/xxx.png

在index。html模板中添加：

```
background: url("img/xxx.png")no-repeat center;
```
