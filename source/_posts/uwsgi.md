title: uwsgi
date: 2016-11-16 11:27:38
toc: true
tags: 网络
categories: 网络
---
# wsgi #

先来讲讲Web应用，抛开dns、网络连接这些先不谈，我们只看服务器与浏览器client之间，静态Web应用一般是这样的流程：

1. 浏览器发送一个http请求

2. 服务器收到request，生成或者找到请求的文件

3. 服务器将html文件作为response的body部分返回/无需渲染文件直接返回

4. 浏览器收到响应后，从response取出数据并填充、渲染

类似Apache、Nginx这类static server最擅长干的事情，就是我们提前将浏览器要访问的html页面、static文件（img、css、js）等放到静态服务器的指定位置，服务器接受请求返回文件
<!--more-->
动态服务器的话因为要根据请求的url解析并生成数据返回给浏览器，上面的一些步骤就需要我们自己实现。

>不过，接受HTTP请求、解析HTTP请求、发送HTTP响应都是苦力活，如果我们自己来写这些底层代码，还没开始写动态HTML呢，就得花个把月去读HTTP规范。

>正确的做法是底层代码由专门的服务器软件实现，我们用Python专注于生成HTML文档。因为我们不希望接触到TCP连接、HTTP原始请求和响应格式，所以，需要一个统一的接口，让我们专心用Python编写Web业务。

>这个接口就是WSGI：Web Server Gateway Interface。


WSGI接口定义非常简单，它只要求Web开发者实现一个函数，就可以响应HTTP请求。

```python
#app.py
def application(environ,start_response):
	start_response('200 OK',[('Content-Type','text/html')])
	body='<head><title>hiahia</title><body><h1>Hello %s</h1></body></head>' % (environ['PATH_INFO'][1:] or 'world')
	return [body.encode('utf-8')]
```

这个函数是被wsgi服务器调用，跑在wsgi服务器上的，接受两个参数：

- environ

包含所有HTTP请求信息的dict对象，上面使用的environ['PATH_INFO']就是我们请求的服务器地址，例如服务器跑在本机端口8001上:

`curl http://localhost:8001/hiahiahia/hiahiahia`

那么此时就会返回 Hello hiahiahia/hiahiahia，如果是直接请求/，会返回默认设置的'world'

- start_response

发送HTTP响应的函数

application()函数中，调用：`start_response('200 OK', [('Content-Type', 'text/html')])`
就发送了HTTP响应的Header，注意Header只能发送一次，也就是只能调用一次start_response()函数。start_response()函数接收两个参数，一个是HTTP响应码，一个是一组list表示的HTTP Header，每个Header用一个包含两个str的tuple表示。多个元祖之间以逗号分开，填充到list中

然后，函数的返回值b'<h1>Hello, web!</h1>'将作为HTTP响应的Body发送给浏览器。


有了WSGI，我们关心的就是如何从environ这个dict对象拿到HTTP请求信息，然后构造HTML，通过start_response()发送Header，最后返回Body。

整个application()函数本身没有涉及到任何解析HTTP的部分，也就是说，底层代码不需要我们自己编写，我们只负责在更高层次上考虑如何响应请求就可以了。

application()函数必须由WSGI服务器来调用，我们这里简单测试就用python自带的wsgiref

```python
#server.py
from wsgiref.simple_server import make_server
from app import application
httpd=make_server('',8001,application)
httpd.serve_forever()
```

无论多么复杂的Web应用程序，入口都是一个WSGI处理函数。HTTP请求的所有输入信息都可以通过environ获得，HTTP响应的输出都可以通过start_response()加上函数返回值作为Body。


# uWSGI #

uwsgi是uWSGI服务器自创的一种协议，是一种线路协议而非类似wsgi的通信协议。

uWSGI是实现了WSGI、uwsgi和http协议的服务器

## django+uWSGI+nginx ##

这里吧django、uWSGI和nginx的关系梳理一下，网络上有大把的文章都是在描述这三者怎么搭载、怎么执行的，却没有好好介绍之间的联系：


Django实际上只是一个流行的开源框架，因为其高效、便捷全面的开发流程收到欢迎；

nginx为Django Project提供反向代理服务，是对外服务的接口，浏览器通过url请求服务器的时候，请求首先会经过nginx，nginx将请求分析，如果是静态文件则直接返回可用的静态文件，动态网页就转发给uwsgi；

uwsgi收到请求后处理成wsgi能够接受的格式，wsgi根据配置文件使用app的函数，然后把处理后的数据在打包成uwsgi接受的格式、转发给nginx->传回给浏览器

从上面的流程中可以看到，实际上nginx做的处理静态文件请求这件事，uwsgi也是能做的，那么为什么还要用nginx呢？

1. 对于静态文件的处理，nginx要比uwsgi好得多

2. 程序不希望被浏览器访问到，而是通过nginx,nginx只开放某个接口，uwsgi本身则是内网接口，这样运维人员在nginx上加上安全性的限制，可以达到保护程序的作用

3. nginx可以做反向映射，一个uwsgi服务器可能不能保证程序的运行，放到多个服务器上，这样通过nginx配置文件中配置后，不同的app转发到不同的uwsgi上。


关于反向映射，可以看这张图：

![](http://peihao.space/img/article/proxy.jpg)

对于普通代理来讲，代理机与client(browser)属于同一个域，服务器将他们视为整体，代理的是client；

反向代理与真正的服务器在一个域，属于同一局域网，client将他们视为整体，代理的是后面多台服务器，主要有cache、安全性以及负载平衡方面的考虑
