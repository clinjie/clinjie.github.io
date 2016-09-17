title: Django初识2
date: 2016-09-10 22:24:06
toc: true
tags:
- python
categories: python
---

# 创建管理员账户 #

作为一个常规的Blog系统，我们需要有能够后台操作的账户。Django提供了便捷的创建用户接口：

```
$ python manage.py createsuperuser
```

在交互式输入相关信息时，要注意密码不能是纯数字形式。


在`http://127.0.0.1:8000/admin`中输入刚刚创建的用户即可管理项目。

<!--more-->
# 管理页管理应用 #

默认的后台网页中是没有显示我们自行添加的应用的Model，我们可以根据自己需要，插件式自行添加。


## model ##

app_name.admin.py中添加

`admin.site.register(Model.name)`

默认添加model时的次序是我们在models.py中创建model时class属性次序。

```
from .models import Choice, Question
admin.site.register(Question)
admin.site.register(Choice)
```

如果想要在Model管理面上增加其他特性或者改变排序方式，需要在admin.py中修改相关设置：


```python
class QuestionAdmin(admin.ModelAdmin):
    fields = ['pub_date', 'question_text']

#修改次序，类继承自admin.ModelAdmin
admin.site.register(Question, QuestionAdmin)

#将字段次序修改为字段集合
class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['question_text']}),
        ('Date information', {'fields': ['pub_date']}),
    ]

admin.site.register(Question, QuestionAdmin)
```

## 关联对象 ##

Django对于ForeignKey有很好的支持机制，为了方便我们在后台操作，我们可以修改当前model的注册代码


```python
from django.contrib import admin

from .models import Choice, Question


class ChoiceInline(admin.StackedInline):
    model = Choice
    extra = 3


class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['question_text']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
```

增加的代码将会告诉 Django，Choice（选项） 对象将会在 问题（Question） 的管理界面里被编辑。默认显示3个问题字段以供编辑。


## 其他特性 ##

默认情况下，Django 使用 str() 方法来显示对象。但有时如果我们显示一些其他的字段会很有用。为此，我们可以使用 list_display 选项，它是由需要被显示的字段名组成的元组，这些字段将会作为额外的列显示在列表中。


```python
# polls/admin.py

class QuestionAdmin(admin.ModelAdmin):
    # ...
    list_display = ('question_text', 'pub_date')
```


----------
- 简单搜索功能

`search_fields = ['question_text']`

这将会在对象列表的顶部加一个搜索框。当有人键入内容时，Django 会搜索 question_text 字段。你想搜索多少字段都行 - 尽管搜索过程使用的是数据库查询语句里的 LIKE 关键字，但限制一下搜索结果数量将会让数据库搜索更加轻松。


# 自定义管理页面 #

Django管理页面是Django自身提供的，通过Django的模板系统可以轻易修改。

下面的例子，我们通过简单的管理主页面模板修改主页面：

- 创建模板Tempalte目录

在mysite/settings.py中添加DIRS选项

```
# mysite/settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

上述修改将mysite目录下的templates目录加入到模板扫描队列中
DIRS 是在载入 Django 模板时会搜索的文件系统上的目录集合。

- 硬盘创建templates目录

在mysite/下创建templates目录，里面可以根据需要包含整个Django项目的template文件。


- 编写template

我们只需要在管理页面中尝试修改小部分内容做测试，所以可以在原来模板上做轻微的修改。

在python安装目录下找到django安装路径，并找到`django/contrib/admin/templates`，将目录下的admin/base_site.html模板复制。我们在项目mysite/templates/目录下创建admin目录，并粘贴刚刚复制的base_site.html文件。根据尝试，修改相应内容。