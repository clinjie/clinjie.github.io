title: Django初识5
date: 2016-09-17 12:24:06
tags:
- python
categories: python
---

测试相关

----------
自动化测试是由某个系统帮你自动完成的。当你创建好了一系列测试，每次修改应用代码后，就可以自动检查出修改后的代码是否还像你曾经预期的那样正常工作。你不需要话费大量时间来进行手动测试。

# 实例 #

在这个系列文章的第一部分，我们在poll投票应用中定义了一个Question model方法，返回当前投票问题是否是最近创建的，如果创建时间与当前时间相差不到24小时，则返回True.

```python
def was_published_recently(self):
		return self.pub_date>=timezone.now()-datetime.timedelta(days=1)
```
<!--more-->
很明显，这里有一个Bug，就是当我们手动修改问题的创建时间（实际操作可以在创建问题的构造函数修改，或者直接在项目后台修改）为未来时间，即timezone.now+的情况，方法依然会返回True.

```python
>>> p=Question.objects.get(question_text='debug')
>>> p
<Question: debug>
>>> p.was_published_recently()
True
>>> p.pub_date
datetime.datetime(2016, 9, 22, 3, 29, 57, tzinfo=<UTC>)
>>> from django.utils import timezone
>>> timezone.now()
datetime.datetime(2016, 9, 17, 3, 43, 47, 450885, tzinfo=<UT
C>)
```

手动将question_text为debug的Question对象pub_date时间修改为当前时间往后数5天，当我们测试was_published_recently()方法时，依然会反悔True.明显，这与我们的设计初衷不符合。


# 使用代码检测漏洞 #

Django应用的额测试写在应用的test.py文件中，测试系统自动在所有以test开开头的文件中寻找bong执行测试代码。

## 测试初体验 ##

下面我们就在头片应用polls/目录下的test.py文件中尝试test：

```python
import datetime
from django.utils import timezone
from .models import Question

class QuestionMethodTests(TestCase):
	def test_was_published_recently_with_future_question(self):
		time=timezone.noew()+datetime.timedelta(days=30)
		future_question=Question(pub_date=time)
		self.assertEqual(future_question.was_published_recently(),False)
```

在网站项目的根目录下启动终端：

```python
$ winpty python manage.py test polls
Creating test database for alias 'default'...
F
============================================================
==========
FAIL: test_was_published_recently_with_future_question (poll
s.tests.QuestionMethodTests)
------------------------------------------------------------
----------
Traceback (most recent call last):
  File "E:\djangosite\mysite\polls\tests.py", line 10, in te
st_was_published_recently_with_future_question
    self.assertEqual(future_question.was_published_recently(
),False)
AssertionError: True != False

------------------------------------------------------------
----------
Ran 1 test in 0.002s

FAILED (failures=1)
Destroying test database for alias 'default'...
```

- python manage.py test polls 将会寻找 poll 应用里的测试代码

- 它找到了一个 django.test.TestCase 的子类

- 它创建一个特殊的数据库供测试使用,与我们正常使用的数据库不同，在测试完成之后，数据将会自动销毁

- 它在类中寻找测试方法——以 test 开头的方法。

- 在 test_was_published_recently_with_future_question 方法中，它创建了一个 pub_date 值为未来第 30 天的 Question 实例。

- 然后使用 assertEqual() 方法，发现 was_published_recently() 返回了 True，而我们希望它返回 False


为了做对比，我使用离当前时间前30小时作为问题发布时间：

```python
def test_was_published_recently_with_future_question(self):
		time=timezone.now()+datetime.timedelta(hours=30)
		future_question=Question(pub_date=time)
		self.assertEqual(future_question.was_published_recently(),False)

$ winpty python manage.py test polls
Creating test database for alias 'default'...
.
------------------------------------------------------------
----------
Ran 1 test in 0.001s

OK
Destroying test database for alias 'default'...
```

同时，我们应该修改views.py文件，将显示的返回集合修改。

```python
def get_queryset(self):
	return Question.objects.order_by('-pub_date')[:5]

--->>


def get_queryset(self):
	return Question.objects.filter(pub_date_lte=timezone.now()).order_by('-pub_date')[:5]
```

## 更全面的测试 ##

实际上，光是问题发布时间方面，如果想要更全面的测试，以上的测试还是不够的，我们需要未来时间的测试，一天之前时间的测试，以及一天之内时间的测试。


我们在上面实现了未来时间的测试，下面是剩余两项的测试：

```python
from django.test import TestCase
import datetime
from django.utils import timezone
from .models import Question

class QuestionMethodTests(TestCase):
	def test_was_published_recently_with_future_question(self):
		#按照设计，应该返回False
		time=timezone.now()+datetime.timedelta(days=30)
		future_question=Question(pub_date=time)
		self.assertEqual(future_question.was_published_recently(),False)
	def test_was_published_recently_with_old_question(self):
		#按照设计，应该返回False
		time=timezone.now()-datetime.timedelta(days=30)
		old_question=Question(pub_date=time)
		self.assertEqual(old_question.was_published_recently(),False)
	def test_was_published_recently_with_recent_question(self):
		#应该返回True
		time=timezone.now()-datetime.timedelta(hours=1)
		recent_question=Question(pub_date=time)
		self.assertEqual(recent_question.was_published_recently(),True)


$ winpty python manage.py test polls
Creating test database for alias 'default'...
...
------------------------------------------------------------
----------
Ran 3 tests in 0.003s

OK
Destroying test database for alias 'default'...

```

