title: Django介绍
date: 2016-09-6 20:24:06
tags:
- python
categories: python
---

>Django 是 Python 编程语言驱动的一个开源模型-视图-控制器（MVC）风格的 Web 应用程序框架。使用 Django，我们在几分钟之内就可以创建高品质、易维护、数据库驱动的应用程序。


下面是简略的django应用流程图

[](http://peihao.space/img/article/djaogo/diango_flow.png)


<!--more-->

>[简书作者](http://www.jianshu.com/p/3bf9fb2a7e31)

- 用户通过浏览器输入相应的 URL 发起 HTTP 请求（一般是 GET/POST）

- Django 接受到请求，检测 urls.py 文件，找到和用户输入的 URL 相匹配的项，并调用该 URL 对应的视图函数（view），例如，通常来说 urls.py 文件里的代码是这样的：

- `url(r'^homepage/$', views.home_page)`
则当用户输入的 URL 为 www.某个网址.com/homepage 时，django 检测到该 URL 与上面的代码 匹配，于是调用后面的 views.home_page 视图函数，把相应的请求交给该视图函数处理。

- 视图函数被调用后，可能会访问数据库（Model）去查询用户想要请求的数据，并加载模板文件（Template），渲染完数据后打包成 HttpResponse 返回给浏览器（Http协议）


**所以要想我们的django应用工作，我们需要做的事：**

- 编写相应的 url

- 编写数据库（Model）

- 编写处理 Http 请求的视图函数（View）

- 编写需要渲染的模板（Template）

## model ##

设计数据库结构就是编写 models，数据库中每一个实体对应的表在 django 中对用着 models.py 中的一个类，类的属性对应着数据库表的属性列

## View ##

数据库建立完毕后需要编写视图函数（view）来处理 Http 请求。

下面以一个简单Blog为例

```python
from blog.models import Article
from blog.models import Category
from django.views.generic import ListView
import markdown2

class IndexView(ListView): 

    # 首页视图,继承自ListVIew，用于展示从数据库中获取的文章列表

    template_name = "blog/index.html"
    # template_name属性用于指定使用哪个模板进行渲染

    context_object_name = "article_list"
    # context_object_name属性用于给上下文变量取名（在模板中使用该名字）

    def get_queryset(self):
        

        #过滤数据，获取所有已发布文章，并且将内容转成markdown形式
        
        article_list = Article.objects.filter(status='p')
        # 获取数据库中的所有已发布的文章，即filter(过滤)状态为'p'(已发布)的文章。
        for article in article_list:
            article.body = markdown2.markdown(article.body, )
            # 将markdown标记的文本转为html文本
        return article_list

    def get_context_data(self, **kwargs):
            # 增加额外的数据，这里返回一个文章分类，以字典的形式
        kwargs['category_list'] = Category.objects.all().order_by('name')
        return super(IndexView, self).get_context_data(**kwargs)
```

我们需要把数据库中存储的文章的相关信息取出来展示给用户看


## Template ##


- 模板标签，一般用大括号包裹两个百分号表示
```
{% %}
```

一些常用的有`for`循环标签、`if`判断标签等。

- 模板变量，用`variable`表示

模板渲染是这些变量会被数据库中相应的值代替，例如`article_list = Article.objects.filter(status='p')`，从数据库中取出了已发布的文章列表，赋给了 `article_list` 变量。如果模板文件中有如下代码：

```c
{% for article in article_list %}
{{article.title}}
```

渲染时会循环渲染 n 篇文章，并且 `{{article.title}}` 也会被存储在数据库中文章的标题取代。

## URL ##

写好了数据库、视图和模板，现在就是当用户在浏览器输入 url 访问我们的 Blog 时要告诉 django 哪个 url 的请求对应哪个视图函数来处理，通过 urls.py 来指定：


```
urls.py

urlpatterns = [

    ...
    url(r'^blog/', views.IndexView.as_view()),
    # 首页调用IndexView
    ...

]
```