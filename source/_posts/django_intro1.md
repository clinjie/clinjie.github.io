title: Django初识
date: 2016-09-6 22:24:06
toc: true
tags:
- python
categories: python
---

# 项目与应用 #

项目和应用有啥区别？

应用是一个专门做某件事的网络应用程序 - 比如博客系统，或者公共记录的数据库，或者简单的投票程序。


项目则是一个网站使用的配置和应用的集合。项目可以包含很多个应用。应用可以被很多个项目使用。


# 创建项目 #

一个 Django 项目实例需要的设置项集合，包括 Django 配置和应用程序设置

## start ##

`$ django-admin startproject mysite`

这行代码将会在当前目录下创建一个 mysite 目录

- manage.py：一个让你用各种方式管理 Django 项目的命令行工具

<!--more-->
-  mysite/ 目录包含你的项目，它是一个纯 Python 包。它的名字就是当你引用它内部任何东西时需要用到的 Python 包名。

- mysite/__init__.py：一个用于指明此目录是 Python 包的空白文件

- mysite/settings.py：Django 项目的配置文件

- mysite/urls.py：Django 项目的 URL 声明，就像是你网站的“目录”

- mysite/wsgi.py：当你部署项目到一个兼容 WSGI 的服务器上时所需要的入口点


## INSTALLED_APPS  ##

mysite/settings.py。这是包含着 Django 项目设置的 Python 模块。

文件头部的 INSTALLED_APPS 设置项，这里包括了会在你项目中启用的所有 Django 应用。应用能在多个项目中使用，你也可以打包并且发布应用，让别人使用它们

通常，INSTALLED_APPS 默认包括了以下 Django 的自带应用：

- django.contrib.admin - 管理员界面。你将会在 教程的第二部分（zh） 使用它。

- django.contrib.auth - 验证系统。

- django.contrib.contenttypes - 内容类型框架。

- django.contrib.sessions - 会话框架。

- django.contrib.messages - 消息框架。

- django.contrib.staticfiles - 管理静态文件的框架。


默认开启的某些应用需要至少一个数据表，所以，在使用他们之前需要在数据库中创建一些表。请执行以下命令：

`$ python manage.py migrate`

migrate 命令检查 INSTALLED_APPS 设置，为其中的每个应用创建需要的数据表,这取决于你的 mysite/settings.py 设置文件和每个应用的数据库迁移文件.migrate 命令只会为在 INSTALLED_APPS 里声明了的应用进行数据库迁移。


## launch ##

`$ python manage.py runserver`

此时开启的是django默认附带的一个简易服务器，默认在本机8000端口内可查看当前网站内容。


# App #

应用可以放在 Python path 中的任何目录里。在本次试验中，将直接在 manage.py 所在的目录里创建test应用，这样它就能够被当做顶级模块被引入，而不是作为 mysite 的子模块.

`$ python manage.py startapp polls`

在当前目录下创建名为polls的应用


```
polls/
    
	__init__.py
    
	admin.py
    
	migrations/
    
	    __init__.py
    
	models.py
    
	tests.py
    
	views.py
```

## create model ##

在 Django 里写一个数据库驱动的 Web 应用的第一步是定义模型 - 也就是数据库结构设计和附加的其他元数据。

模型是真实数据的简单明确的描述。它包含了储存的数据所必要的字段和行为。

本次简单的投票实例中需要两个model，即Question和Choice.

问题模型包括问题描述和发布时间。选项模型有两个字段，选项描述和当前得票数。每个选项属于一个问题。

编辑 polls/models.py 文件

```python
# polls/models.py

from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')


class Choice(models.Model):
    question = models.ForeignKey(Question)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```


再次编辑 mysite/settings.py，改变 INSTALLED_APPS 设置，使其包含字符串 polls。它现在看起来应该像这样：

```python
INSTALLED_APPS = (

    'django.contrib.admin',

    'django.contrib.auth',

    'django.contrib.contenttypes',

    'django.contrib.sessions',

    'django.contrib.messages',

    'django.contrib.staticfiles',

    'polls',

)
```

## App migration ##

项目创建polls应用之后：

`$ python manage.py makemigrations polls`

通过 migrations 命令，Django 会检测你对模型文件的修改，并且把修改的部分储存为一次 迁移。

迁移是 Django 对于模型定义（也就是你的数据库结构）的变化的储存形式 - 其实也只是一些你磁盘上的文件。如果你想的话，你可以阅读一下你模型的迁移数据，它被储存在 polls/migrations/0001_initial.py 里。别担心，你不需要每次都阅读迁移文件，但是它们被设计成人类可读的形式，这是为了便于你手动修改它们。


现在，再次运行 migrate 命令，在数据库里创建新定义的模型的数据表

`$ python manage.py migrate`

migrate 命令选中所有还没有执行过的迁移（Django 通过在数据库中创建一个特殊的表 django_migrations 来跟踪执行过哪些迁移）并应用在数据库上 - 也就是将你对模型的更改同步到数据库结构上。


综上所述，改变app的model需要以下几步

- 编辑 models.py 文件，改变模型（如果是初创建的app，甚至需要在setting文件中扩入installed-apps）

- 运行 python manage.py makemigrations 为模型的改变生成迁移文件（相当于commit）

- 运行 python manage.py migrate 来应用数据库迁移（相当于真正的push）



# 一些基本数据操作 #

在django shell编程模式下：

```python
>>> from polls.models import Question, Choice   # 导入刚刚创建的模型类

# 列出当前应用指定Models集合
>>> Question.objects.all()
[]

# 创建新 Question
# 在 settings 文件里，时区支持被设为开启状态，所以
# pub_date 字段要求一个带有时区信息（tzinfo）
# 的 datetime 数据。请使用 timezone.now() 代替
# datetime.datetime.now()，这样就能获取正确的时间。
>>> from django.utils import timezone
>>> q = Question(question_text="What's new?", pub_date=timezone.now())

# 想将对象保存到数据库中，必须显式的调用 save()。
>>> q.save()

# 现在它被分配了一个 ID。注意有可能你的结果是“1L”而不是“1”，
# 这取决于你在使用哪种数据库。这不是什么大问题；只是表明
# 你所用的数据库后端倾向于将整数转换为 Python 的
# long integer 对象。
>>> q.id
1

# 通过属性来获取模型字段的值
>>> q.question_text
"What's new?"
>>> q.pub_date
datetime.datetime(2012, 2, 26, 13, 0, 0, 775217, tzinfo=<UTC>)

# 通过改变属性值来改变模型字段，然后调用 save()。
>>> q.question_text = "What's up"
>>> q.save()

# objects.all() 显示数据库中所有 question。
>>> Question.objects.all()
[<Question: Question object>]
```


在python3下，对应配套的django框架中我们可以通过改变Model的内置函数`__str__()`，当调用`Model.objects.all()`方法时，列出__str()__方法修改的内容。


在Python2中，想要达到相同的目的，则是需要修改__unicode__()方法，此时django将会调用py2版本的django模块中内置方法__str__()函数，__str__()函数调用__unicode__()方法。


```python
from django.db import models

class Question(models.Model):
    # ...
    def __str__(self):  # Python 2 请改为 __unicode__
        return self.question_text

class Choice(models.Model):
    # ...
    def __str__(self):  # Python 2 请改为 __unicode__
        return self.choice_text
```


下面是使用API的一些小例子：


```python
>>> from django.utils import timezone
>>> current_year = timezone.now().year
>>> Question.objects.get(pub_date__year=current_year)
<Question: What's up?>

# 查找一个不存在的 ID 将会引发异常
>>> Question.objects.get(id=2)
Traceback (most recent call last):
    ...
DoesNotExist: Question matching query does not exist.

# 通过主键来查找数据是非常常见的需求，所以 Django
# 为这种需求专门制定了一个参数。
# 以下代码等同于 Question.objects.get(id=1)。
>>> Question.objects.get(pk=1)
<Question: What's up?>


# 给这个问题添加几个选项。create 函数会创建一个新的
# Choice 对象，执行 INSERT 语句，将 Choice 添加到
# Question 的选项列表中，最后返回刚刚创建的
# Choice 对象。Django 创建了一个集合 API 来使你可以从
# 外键关系的另一方管理关联的数据。
# （例如，可以获取问题的选项列表）
>>> q = Question.objects.get(pk=1)

# 显示所有和当前问题关联的选项列表，现在是空的。
>>> q.choice_set.all()
[]

# 创建三个选项。
>>> q.choice_set.create(choice_text='Not much', votes=0)
<Choice: Not much>
>>> q.choice_set.create(choice_text='The sky', votes=0)
<Choice: The sky>
>>> c = q.choice_set.create(choice_text='Just hacking again', votes=0)

# Choice 对象能通过 API 获取关联到的 Question 对象。
>>> c.question
<Question: What's up?>

# 反过来，Question 对象也可以获取 Choice 对象
>>> q.choice_set.all()
[<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]
>>> q.choice_set.count()
3

# 查找 API 的关键字参数可以自动调用关系函数。
# 只需使用双下划线来分隔关系函数。
# 只要你想，这个调用链可以无限长。
# 例如查找所有「所在问题的发布日期是今年」的选项
# （重用我们之前创建的 'current_year' 变量）
>>> Choice.objects.filter(question__pub_date__year=current_year)
[<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]

# 试试删除一个选项，使用 delete() 函数。
>>> c = q.choice_set.filter(choice_text__startswith='Just hacking')
>>> c.delete()
```