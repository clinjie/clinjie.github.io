title: Django初识4
date: 2016-09-16 12:24:06
tags:
- python
categories: python
---

# 编写简单的vote逻辑框架 #

投票网站，我们在每个需要投票问题的页面上展现出所有可以投票的选项，并且在每个选项前假如radio单选按钮。当按钮结束之后，选择submit跳转到结果显示页面.

问题展示页面在polls/question_id中显示，而与之对应的template是detail.html

![](http://peihao.space/img/article/djaogo/django_4_1.png)
<!--more-->
上面设计了一个表单，选择一个选项之后提交将会跳转到action。

这里要注意的是**csrf_token**

Cross-site request forgery 跨站请求伪造，也被称为 “one click attack” 或者 session riding，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。CSRF 则通过伪装来自受信任用户的请求来利用受信任的网站。


CSRF 主流防御方式是在后端生成表单的时候生成一串随机 token ，内置到表单里成为一个字段，同时，将此串 token 置入 session 中。每次表单提交到后端时都会检查这两个值是否一致，以此来判断此次表单提交是否是可信的。提交过一次之后，如果这个页面没有生成 CSRF token ，那么 token 将会被清空，如果有新的需求，那么 token 会被更新。

攻击者可以伪造 POST 表单提交，但是他没有后端生成的内置于表单的 token，session 中有没有 token 都无济于事。


Django内置便捷的csrf_token机制，所以在内部跳转可能会修改数据库数据情况下都要使用csrf_token机制


forloop.counter 指示 for 标签已经循环多少次。

选择提交成功之后，页面会跳转到action目的地址：polls/vote/question_id上，我们编写相应页面显示逻辑

```python
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse

from .models import Choice, Question
# ...
def vote(request, question_id):
    p = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = p.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # 重新显示问题的投票表单
        return render(request, 'polls/detail.html', {
            'question': p,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # 成功处理之后 POST 数据之后，总是返回一个 HttpResponseRedirect 。防止因为用户点击了后退按钮而提交了两次。
        return HttpResponseRedirect(reverse('polls:results', args=(p.id,)))
```

- request.POST 是一个类字典对象，让你可以通过关键字的名字获取提交的数据。 这个例子中，request.POST['choice'] 以字符串形式返回选择的 Choice 的 ID。request.POST 的值永远是字符串。 注意，Django 还以同样的方式提供 request.GET 用于访问 GET 数据 —— 但我们在代码中显式地使用 request.POST ，以保证数据只能通过POST调用改动。


- 如果在 POST 数据中没有提供 choice，request.POST['choice'] 将引发一个 KeyError。上面的代码检查 KeyError，如果没有给出 choice 将重新显示Question表单和一个错误信息。


- 在增加Choice的得票数之后，代码返回一个 HttpResponseRedirect 而不是常用的 HttpResponse。HttpResponseRedirect 只接收一个参数：用户将要被重定向的 URL。 正如上面的Python注释指出的，你应该在成功处理 POST 数据后总是返回一个 HttpResponseRedirect。 这不是 Django 的特定技巧；这是那些优秀网站在开发实践中形成的共识。


- 在这个例子中，我们在 HttpResponseRedirect 的构造函数中使用 reverse() 函数。这个函数避免了我们在视图函数中硬编码 URL。它需要我们给出我们想要跳转的视图的名字和该视图所对应的URL模式中需要给该视图提供的参数。


在上面的代码中，views.vote函数使用了`render(request, 'polls/detail.html`模板文件，所以我们在相应的模板目录下创建文件，实现界面设计。


![](http://peihao.space/img/article/djaogo/django_4_2.png)

上面的html页面代码将会显示当前投票问题的所有选项以及投票结果。`choice.votes|pluralize`代表如果choice.votes是>=1的情况下，将会返回s，也就是vote复数的情况。

# 通用视图 #

Web 开发中的一个常见情况：根据 URL 中的参数从数据库中获取数据、载入模板文件然后返回渲染后的模板。 由于这种情况特别常见，Django 提供一种快捷方式，叫做“通用视图”系统。


## 改良URLconf ##

修改polls/urls.py：

```python
from django.conf.urls import url
from . import views

urlpatterns=[
	url(r'^$',views.IndexView.as_view(),name='index'),
	url(r'^(?P<question_id>[0-9]+)/$',views.DetailView.as_view(),name='detail'),
	url(r'^(?P<question_id>[0-9]+)/results/$',views.ResultView.as_view(),name='results'),
	url(r'^(?P<question_id>[0-9]+)/vote/$',views.votes,name='vote')]
```

其中第二、三个模式的正则表达式匹配模式名字有<question_id>变成了<pk>，同时，需要修改的前三个url逻辑方法都有变化

## 修改view逻辑 ##

删除原来在url函数中注册的index、detail、result逻辑方法。通过通用视图提供的类继承：

```python
from django.views import generic
class IndexView(generic.ListView):
	template_name='polls/index.html'
	context_object_name='latest_question_list'

	def get_queryset(self):
		#返回最心发布的5个问题
		return Question.objects.order_by('-pub_date')[:5]

class DetailView(generic.DetailView):
	model=Question
	template_name='polls/detail.html'

class ResultView(generic.DetailView):
	model=Question
	template_name='polls/results.html'
```

在上面的代码中，来年各个视图分别继承自通用VIew中的ListView和DetailView。前者显示一个对象列表，后者显示一个特定类型对象的详细信息。


- 每个通用视图需要知道他将作用于那个model，这个有类中的model属性设置

- DetailView期望从URL中捕获名为'pk'的主键，所以在视图中我们修改了URLconf中question_id为pk

- 通用模型类中的template属性决定逻辑加载哪个模板，否则的话会选择默认的template加载。例如，DetailView和ListView都会选择`<app name>/<model name>_detail.html`文件作为模板文件；

- 之前的逻辑函数都会提供一个包含模板文件中将会使用的变量做上下文语境的context，而在通用模板中，实际上同样需要。我们使用的两种通用模板中，DeatilView模板由于是默认提供的是一个特定类型对象的详细信息，它属于一个特定的类型，所以他会自动生成model对应的对象名作为context，例如Question模型自动生成的对象名为question；ListView通用模板显示一个对象列表，所以默认生成的context是一个列表类型，Question模型生成的对象列表名应为question_list，而我们之前使用的context列表名为latest_question_list，为了不修改模板中的对象名，我们直接在逻辑函数中指定context中对象名字为latest_question_list.  使用context_object_name属性，可以把通用模板的context_name设定，同时由于这个使用了ListView的类没有再使用默认提供的question_list名作为context，我们就不用在类中声明model是谁了。