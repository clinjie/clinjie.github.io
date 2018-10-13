title: session教务数据
date: 2016-03-08 22:23:35
tags: Python
categories: Python 
---

# 前言 #

![](http://file.koolearn.com/20150326/14273404312699.png)

之前写过一篇文章[校园网上网认证](/2016/02/24/Internet_authentication/),是讲我在校园里通过python实现子的那个上网登录，后来我在这个基础上增加了账号密码存储功能。到这里可能大家又会想到这是上一篇的延续，实际上并不是。在那篇文章里面，我在尝试了几种网络模块之后选择了Requests，它基于urllib3，隐式的在内部实现了很多特性。

在[Selenium模拟测试教务数据](/2016/02/27/selenium/)这篇文章中，我说过，<!--more-->尝试了很长时间，一直不能通过python网络模块模拟获取教务信息，在那时候我就知道是因为cookie机制的不熟悉，因为在requests使用了cookie之后可以访问需要cookie的第一个界面，但之后需要相同cookie的页面全都无法访问。见猎心起，我用了大名鼎鼎的Selenium模拟浏览器登录，并成功获取了想要的信息。

这几天，查阅文档时候，偶然发现了Requests模块的session对象，会话对象可以跨请求保持某些参数。它也会在同一个Session实例发出的所有请求之间保持cookies。这正是我需要的！

# 基本方法 #

## 跨请求保持 ##

```python
s = requests.Session()

s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')
r = s.get("http://httpbin.org/cookies")

print(r.text)
# '{"cookies": {"sessioncookie": "123456789"}}'
```

在不同的请求里，可以发现cookie没有变化，这就是跨请求保持参数。

## 会话层数据合并 ##

```python
s = requests.Session()
s.auth = ('user', 'pass')
s.headers.update({'x-test': 'true'})

# both 'x-test' and 'x-test2' are sent
s.get('http://httpbin.org/headers', headers={'x-test2': 'true'})
```

会话也可用来为请求方法提供缺省数据。这是通过为会话对象的属性提供数据来实现的,任何你传递给请求方法的字典都会与已设置会话层数据合并。方法层的参数覆盖会话的参数。

## 剔除参数 ##

有时你会想省略字典参数中一些会话层的键。要做到这一点，你只需简单地在方法层参数中将那个键的值设置为 None ，那个键就会被自动省略掉。

# 一些经验 #

任何时候调用requests.*()你都在做两件主要的事情。其一，你在构建一个 Request 对象， 该对象将被发送到某个服务器请求或查询一些资源。其二，一旦 requests 得到一个从 服务器返回的响应就会产生一个 Response 对象。该响应对象包含服务器返回的所有信息， 也包含你原来创建的 Request 对象。如下是一个简单的请求，从Wikipedia的服务器得到 一些非常重要的信息:

`r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')`

如果想访问服务器返回给我们的响应头部信息，可以这样做:

`r.headers`

然而，如果想得到发送到服务器的请求的头部，我们可以简单地访问该请求，然后是该请求的头部:

`r.request.headers`

# 将Selenium版本改进 #

有了上面的内容，我们可以很轻松的通过会话对象(`requests.session()`)保持cookie，进而访问我需要的教务信息。

```python
# -*- coding: utf-8 -*-
import requests
import time
from lxml import etree

times=time.time()

#新建一个会话对象
myRequests=requests.session()

#设置重复的request header
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0',
           'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
           'Accept-Encoding':'gzip, deflate',
           'Content-Type': 'application/x-www-form-urlencoded'}
myRequests.headers.update(headers)


posturl='****************'
postData = {'UserStyle' : 'student',
            'user':'********',
            'password' : '********'}

#在这里增添不同的请求参数
request1 = myRequests.post(posturl, postData, headers={'Referer' : '*******'})


geturl='*******************'
request3=myRequests.get(geturl,headers={'Referer' : '*************'})
request3.encoding='gb2312'

#网页信息处理、排版
dom=etree.HTML(request3.text)
names=dom.xpath('/html/body/table/tr/td[3]/text()')
socres=dom.xpath('/html/body/table/tr/td[5]/text()')
rates=dom.xpath('/html/body/table/tr/td[7]/text()')
assert(len(names) == len(socres)==len(rates))
results=zip(names,socres,rates)
for item in results:
    print(item[0],item[1].strip(),item[2])

print(time.time()-times)
```

上面就是烦扰我很长时间的问题，通过会话对象session可以很容易的管理跨请求的一些参数。通过时间对比，网络顺畅情况下，程序跑一遍可以达到数百毫秒，而使用Selenium最快的伪浏览器模拟，也需要3s以上。