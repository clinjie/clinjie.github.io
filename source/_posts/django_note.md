title: Django笔记
date: 2016-10-14 22:24:06
toc: true
tags:
- python
- django
categories: python
---

# 模式 #

整个django大体上使用MTV架构：

- M-->Model

Model主要是建立起实体关系，根据不同Model之间的联系创建数据库，Model是实体，Model的属性是实体的属性，实体间的联系主要由外键控制。

表数据的增删改查就是Model类对象的创建、删除、过滤查找。

Modelname.objects返回类的句柄
<!--more-->

- V-->View

在urls.py配置文件中通过re匹配，转到view.py文件相应的方法，通过获取数据库中数据，将数据通过属性参数列表传递到模板文件template中。

- T-->Template

模板文件一般就是html文件，我们使用正常的html语法编写文件，同时配合传递进来的参数使用

展示界面


# filter #

过滤器我们常用的主要有2中类型：

- 在view.py文件中使用

view文件中我们通过modelname.objects.filter方法，留下符合条件的对象列表

`Article.objects.filter(title__icontains = s)`

上面表示返回符合Article Model中对象title属性包含s的对象列表，s是字符串表达式。

- 在template文件中使用 

我们可以在template中调用过滤方法，对待处理的数据过滤处理返回，Django中template支持管道，上一个处理的结果直接作用为下一方法的输入：

`post.content|read_more|custom_markdown`

上面的语句一次通过调用read_more()方法、之后将处理结果作为输出参数传递调用custom_markdown（）方法.

这里的filter方法是绑定到app本身的，不能其他app复用。在本app根目录创建tamplatetags包，里面包含__init__.py文件。


```python
register = template.Library() #自定义filter时必须加上，一个文件只需调用一次
@register.filter(is_safe=True) #注册template filter 必需
@stringfilter #希望字符串作为参数 #非必需
def custom_markdown(value):
	return mark_safe(markdown.markdown(value,extensions =['markdown.extensions.fenced_code', 'markdown.extensions.codehilite'],safe_mode=True,enable_attributes=True))
```

# staticfile #

使用静态文件：

----百度去吧

# 404 #

使用404

----百度去

使用staticfile要求debug=true，而使用404.html要求debug=false。冲突，我们使用将debug设置为false，此时自带服务器默认不会记在静态文件中的js、css等类型文件，需要在启动server时

`winpty python manage.py runserver --insecure`


# 连接mysql #

环境：

- Django1.10

- Mysql5.5.47

- Pyhton3.5.x

首先安装第三方支持模块：

`pip install pymysql`

在projec目录的setting.py中修改：

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'blog',#数据库名
        'USER':'root',#数据库用户名
        'PASSWORD':'',#数据库密码
        'HOST':'',#数据库地址不写为本地127.0.0.1
        'PORT':'' #数据库端口 默认3306
    }
}
```

要注意的是，上面使用的数据库名是已经在mysql中创建好的databasename

最后使用

`python manage.py migrate`

数据库同步迁移