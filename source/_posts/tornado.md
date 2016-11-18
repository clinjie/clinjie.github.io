title: Tornodo入门
date: 2016-11-14 22:28:30
toc: true
tags:
- python
- Tornodo
categories: python
---


# 引言 #

首先来谈谈c10k问题。所谓c10k问题，指的是服务器同时支持成千上万个客户端的问题，也就是concurrent 10000 connection。由于硬件成本的大幅度降低和硬件技术的进步，如果一台服务器同时能够服务更多的客户端，那么也就意味着服务每一个客户端的成本大幅度降低，从这个角度来看，c10k问题显得非常有意义。

Tornado在设计之初就考虑到了性能因素，旨在解决C10K问题，这样的设计使得其成为一个拥有非常高性能的框架。此外，它还拥有处理安全性、用户验证、社交网络以及与外部服务（如数据库和网站API）进行异步交互的工具。
<!--more-->
# 推荐的平台 #

在windows下实现tornado的异步并没有什么障碍，但由于在windows下的异步是靠select来支持的，鉴于windows的最大512的文件操作符限制，异步并行能力理论无法超过甚至接近这个上限（c10k更无从谈起），实际上如果你的tornado中有阻塞操作的话，这个数值还会进一步降低。这样完全发挥不出来tornado的优势。同理，nginx在windows下也有同样的性能尴尬。二来呢，tornado多进程机制在windows下无法使用，手动实现的话又需要多个端口。非常鸡肋，所以一般做测试、运行的话还是推荐在类Unix下，如linux或者max机上，开发时可以拿win平台开发

# 入门实例 #

与Django类似，使用tornado开发同样是使用re这呢规则表达式对不同请求区分转发：

```python
import textwrap

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options
define("port", default=8002, help="run on the given port", type=int)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        greeting = self.get_argument('greeting', 'Hello')
        self.write(greeting + ', friendly user!\r\n')

class ReverseHandler(tornado.web.RequestHandler):
    def get(self, input):
        self.write(input[::-1]+"\r\n")

class WrapHandler(tornado.web.RequestHandler):
    def post(self):
        text = self.get_argument('text')
        width = self.get_argument('width', 40)
        self.write(textwrap.fill(text, int(width)))
        
if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        handlers=[
            (r"/reverse/(\w+)", ReverseHandler),
            (r"/wrap", WrapHandler),
			(r'/'，IndexHandler）
        ]
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
```

上面的例子中，使用了两种最常用的http请求方式，get和post，get形式的request数据直接在url后面以`?`开始`&`连接`=`匹配键值对,post方式以postdata的形式封装成数据发送给服务器

1. `IndexHandler`获取url中key为'ge=reeting'的value并填充到后面返回给浏览器，请求形式:

`curl http://localhost:8002/?greeting=clinjie`

返回：`clinjie, friendly user!`

注意的是，如果没有获取到名为greeting的键值，则会使用默认字符串Hello

2. `ReverseHandler`同样是处理get请求，不过在函数定义的时候有区别：`input`，这个参数将包含匹配处理函数正则表达式第一个括号里的字符串。如果正则表达式中有一系列额外的括号，匹配的字符串将被按照在正则表达式中出现的顺序作为额外的参数传递进来。

`curl http://localhost:8002/reverse/peihao.space`

这里re正则parttern为`/reverse/(\w+)`，显然匹配的是`peihao.space`，input的值获取之后反转返回给client

3. `WrapHandler`处理post请求，这里字符串的处理使用的是textwrap模块，可以方便的进行段落填充，并且设置每行的最大值

`curl http://localhost:8001/wrap -d text=Lorem+ipsum+dolor+sit+amet,+consectetuer+adipiscing+elit`


# 异步执行 #

上面的例子中，修改IndexHandler类：

```python
import time
class IndexHandler(tornado.web.RequestHandler):
	def get(slef):
		time.sleep(10)
		greeting=self.get_argument('greeting','Hello')
		self.write(ge=reeting+',*******')
```

其他不用修改，此时我们按顺序在两个terminal中请求

`curl http://localhost:8002/?greeting=clinjie`

`curl http://localhost:8002/reverse/home`

可以发现，虽然我们执行的时间间隔非常小，不会超过3s，但是由于第一个请求被阻塞了，第二个很简单可以直接返回数据的请求也无法立刻执行，只能等待第一个请求执行完毕后开始执行后面的。

tornado与其他web framework最出彩的就是对于异步处理支持度很高。

## tornado.web.asynchronous注解 ##

在类前面使用`@tornado.web.asynchronous`装饰注解，此后命中匹配这个类的连接将会被认为是长连接(long connection)，保持连接开启。注意这里很重要，tornado默认是在当前方法结束之后就会将连接关闭，但是使用异步情况下，我们将会使用callback function，必须要保持连接开启

直到某些到达状态（例如接受response）时都在等待。由于保证了长连接的状态，我们必须显式的执行self.finish关闭连接，否则连接是不会被关闭的，我们会一直等待，无法收到数据

在类前面加入装饰器之后这个程序还是不能达到我们想要的效果，还要在函数中定义回调函数并在下面实现

`curl http://localhost:8002/?greeting=clinjie`


修改下：

```python
class IndexHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		do sth...
		tornado.ioloop.IOLoop.instance().add_timeout(time.time() + 5, callback=self.on_response)
	def on_response(self):
		#self.write(self.greeting+',*******')
		do sth...
		self.finish()
```

终于可以搞了！

新版本的tornado支持yield生成器，无需定义回调函数：

```python
#@tornado.web.asynchronous不用了
@tornado.gen.coroutine
def get(self):
    yield tornado.gen.Task(tornado.ioloop.IOLoop.instance().add_timeout, time.time() + 5)
    self.write("when i sleep 5s")
```

上面可以看到，要实现异步执行效果，都没有使用`time.sleep(m)`方法，因为time.sleep方法是线程阻塞的，而我们使用asynchronous或者coroutine这类装饰器的就是将耗时的工作变成异步回调/协程状态保存的（否则根本就没有意义），这里只能另辟蹊径，使用异步的定时执行器：`tornado.ioloop.IOLoop.instance().add_timeout`。

基于IOLoop的，当我们get url进入get方法，耗时任务通过异步回调或者协程处理，底层通过epoll或者kqueue、select执行，但是你要来个time.sleep这种阻塞方法那就没得玩了，所以还是通过将定时器加入到IOLoop中实现类似sleep的效果