title: Django初识3
date: 2016-09-11 22:24:06
tags:
- python
categories: python
---

# View视图 #

Django 中的视图的概念是「一类具有相同功能和模板的网页的集合」。比如，在一个博客应用中，你可能会创建如下几个视图：

- 博客首页——展示最近的几项内容。
- 内容“详情”页——详细展示某项内容。
- 以年为单位的归档页——展示选中的年份里各个月份创建的内容。
- 以月为单位的归档页——展示选中的月份里各天创建的内容。
- 以天为单位的归档页——展示选中天里创建的所有内容。
- 评论处理器——用于响应为一项内容添加评论的操作。

<!--more-->

**而在投票应用中，我们需要下列几个视图：**



- 问题索引页——展示最近的几个投票问题。
- 问题详情页——展示某个投票的问题和不带结果的选项列表。
- 问题结果页——展示某个投票的结果。
- 投票处理器——用于响应用户为某个问题的特定选项投票的操作。


在 Django 中，网页和其他内容都是从视图派生而来。每一个视图表现为一个简单的 Python 函数。Django 将会根据用户请求的 URL 来选择使用哪个视图（更准确的说，是根据 URL 中域名之后的部分）。


# re命名组 #

## 分组 ##


- (…) 用来匹配符合条件的字符串。并且将此部分，打包放在一起，看做成一个组，group。


而此group，可以被后续的（正则表达式中）匹配时，所引用。此处我称其为 前向引用，即前面已经通过group定义好的字符串，你在后面需要引用。引用的方式，是通过\N，其中N是对应的group的编号。

- group的编号

编号为0的group，始终代表匹配的整个字符串；我们在正则表达式内所看到的，通过括号括起来的group，编号分别对应着1,2,3，…


如果你想要在正则表达式中，匹配左括号'(‘，右括号’)’，其字符本身，则通过添加反斜杠，即’\(‘，’\)’的方式来匹配。

## 命名分组 ##

- 此处的(?P<name>…)，和普通的(?…)基本类似。区别在于，此处由于是给此group命名了，所以，后续（同一正则表达式内和搜索后得到的Match对象中），都可以通过此group的名字而去引用此group。

- group的名字，当前需要是正常的Python标识符，即字母，数字，下划线等，即，没有特殊的字符。

- 同一正则表达式内，每个group的组名，是唯一的，不能重复。

虽然此处group内命名了，但是其仍然和普通的(…) group 分组中一样，可以通过索引号，即group(1),group(2)等等，去引用对应的group的。

很明显，按照正则内被命名的group的顺序，依次地

group(1)==group(name1)

group(2)==group(name2)


----------


**Usage**

- 命了名的group，在当前的正则表达式中，后续被(?P=name)的方式引用；

- re.sub()中后续通过\g<name>方式被引用。

# View #

1. 修改views.py文件

```python
from django.http import HttpResponse

def index(request):
	return HttpResponse("Hello,World.You're at question %s.")

def detail(request,question_id):
	return HttpResponse("Hello,World.You're at question %s." % question_id)
	
def results(request,question_id):
	response="You're looking the ewsults of question %s."
	return HttpResponse(response % question_id)

def votes(request,question_id):
	response="You're voting on question %s."
	return HttpResponse(response % question_id)
```

2. 修改urls.py文件


```python
from django.conf.urls import url
from . import views

urlpatterns=[
	url(r'^$',views.index,name='index'),
	url(r'^(?P<question_id>[0-9]+)/$',views.detail,name='detail'),
	url(r'^(?P<question_id>[0-9]+)/results/$',views.results,name='results'),
	url(r'^(?P<question_id>[0-9]+)/votes/$',views.votes,name='votes')]
```

urls文件中的re匹配用到了上面的re命名组。将匹配到的`[0-9]+`也就是多个数字结果命名为questiob_id。同事调用方法里面相应的view函数，在Browser中显示结果。因为之前已经在整个项目的urls.py文件中包括了polls应用的urls:


`url(r'^polls/',include('polls.urls'))`，所以不需要在此更新


## 实践 ##

- site_address:port/polls/数字/votes -> You're voting on question question_id.

- site_address:port/polls/数字/results -> You're looking the ewsults of question question_id(也就是匹配的数字).


# 编写真正的View #

## 查询展现 ##

可以直接通过查询存储在SQLite数据库中的Data，获取相应的属性数据反映在网页中：

```python
def index(request):
	'''latest_question_list=Question.objects.order_by('-pub_date')[:5]
	template=loader.get_template('polls/index.html')
	context={
		'latest_question_list':latest_question_list,
	}
	return HttpResponse(template.render(context,request))'''
	latest_question=Question.objects.order_by('-pub_date')[:5]
	output=''.join([p.question_text+"  :  "+str(p.pub_date) for p in latest_question])
	return HttpResponse(output)
```

上面实现了将database中所有的question尸体相应属性展现在网页中。


## 使用template ##

使用template模板可以方便的使用html语言设计页面布局，同事在响应函数中传值使用数据：

- 在网站项目的templates/目录下新建polls目录

- 在polls目录下新建index.html

- index.html文件中填充需要修改设计的部分


![](http://peihao.space/img/article/djaogo/django_3_1.png)

同时在view.py中修改pools/index.html对应的view函数：

```python
def index(request):
	latest_question_list=Question.objects.order_by('-pub_date')[:5]
	template=loader.get_template('polls/index.html')
	context={
		'latest_question_list':latest_question_list,
	}
	return HttpResponse(template.render(context,request))
```

或者我们可以直接使用`render`函数：

```python
from django.shortcuts import render

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)
```

render() 函数的第一个参数是一个请求(HttpRequest)对象，第二个参数是需要载入的模板的名字。第三个参数是需要用于渲染模板的上下文字典，这个参数是可选的。函数返回一个 HttpResponse 对象，内容为指定模板用指定上下文渲染后的结果。

因为url配对情况没有发生变化，所以不需要修改。


# 404异常 #

## 手动捕获处理 ##

```python
def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, 'polls/detail.html', {'question': question}
```

在网站项目的templates目录下新建detail.html文件，由于这里只是简单测试下，所以仅仅需要反馈最简答的信息即可：

	{{ question }}

此时，当访问的question_id在DataBase中存在时，question将直接显示在页面中。否则会出现404异常页面。


## 自动捕获 ##

可以直接使用django提供的get_object_or_404()函数：

```python
from django.http import HttpResponse
from .models import Question
from django.shortcuts import render,get_object_or_404
from django.http import Http404

def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})
```


# 去除硬编码以及namespace #

在templates/polls/目录下的index.html文件中，我们定义了polls 应用的首页模板，当访问site_address/polls/时，默认加载site_address/polls/index.html文件中的模板进行匹配。

	<a href="/polls/{{ question.id }}/">{{ question.question_text }}  


在前文中，我们直接使用的是这种absolute url，这对于项目的若耦合目标相违背，django提供了url函数通过在urls.py中定义的url name直接连接代替硬编码：


![](http://peihao.space/img/article/djaogo/django_3_2.png)

其中`url 'detail' question.id`代表的是文字下面的链接地址，url是函数名，detail是url name，对应的是`^()/$`，在本例中就是对应polls，随后的question.id就是不同question的id值，此项与上面的{{ question.id }}对应

其中'detail'代表的是urls.py文件中定义的url name：

`url(r'^(?P<question_id>[0-9]+)/$',views.detail,name='detail')`

之后若是想修改url路径，可以直接在app的urls.py中修改：

`url(r'^specifics/(?P<question_id>[0-9]+)/$')`

此时原来的网页路径将会迁移到site_address/polls/specifics/数字，显示的是question的id为12时choice_text

## app_url命名 ##

在真实的项目实例中，必然会出现多个app应用，多个app应用的view名称可能会出现重叠，此时就应该加上namespace加以区分。

- 在mysite/urls.py文件在注册将不同app的urls.py文件时，直接加入namespace.


- url(r'^polls/', include('polls.urls', namespace="polls"))

- 多个app情况下，模板使用时注意加上namespace进行区分
	
'detail'-->'polls:detail'


 