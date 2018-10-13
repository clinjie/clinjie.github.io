title: tornado2
date: 2016-11-16 20:13:29
tags: tornado
categories: tornado
---
# 模板基础 #
与之前的Django类似的是，tornado同样是使用了MVT模式，通过模板渲染网页，tornado服务器端提取数据填充到模板文件中返回给client

前面我们为了测试tornado异步框架以及最简单的request-response流程，没有使用Template，仅仅是简单的直接self.write写入到输出流返回给client

## py流程 ##
实际的开发流程中，都会用到template模板，类似下面：
<!--more-->
```python
import os.path
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httpserver

from tornado.options import options,define
define('port',default=8001,helo='plz run on the given port',type=int)
class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')
class PoemHandler(tornado.web.RequestHandler):
    def post(self):
        no1=self.get_argument('no1')
        no2=self.get_argument('no2')
        no3=self.get_argument('no3')
        verb=self.get_argument('verb')
        self.render('poem.html',no1=no1,no2=no2,no3=no3,verb-verb)

if __main__=='__main__':
    tornodo.options.parse_command_line()
    app=tornado.web.Application(
    handler=[(r'/',IndexHandler),
        (r'/poem',PoemHandler)]
        template_path=os.path.join(os.path.dirname(__file__),'templates')
    )
    http_server=tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
```

使用template之后，使用self.render代替了原有的self.write,render，提交给指定的html模板文件，并在方法中设置会在htlm文件中用到的context，然后tornodo就会把数据添到html文件中，之后把这个转换后的html文件作为response的body部分返回。

这里用到了模板文件，发现这里是直接在render方法中使用文件名，也就是相对路径，因为我们在将所有需要监听的url加入到循环事件之前已经将template_path设置好了：

`tempalte_path=os.path.join(os.path.dirname(__file____),'templates')`


## 模板文件 ##

前面的os.path.dirname(__file__)是将当前文件的目录提取出来，如果我们在执行这个程序的时候使用的是相对文件路径，那么返回的当然也是相对路径，总之就是返回可以识别的路径，然后后面加上'templates'这个目录名称，这个目录是提前创建好的，里面有两个模板文件：index.html和poem.html

index.html文件是很简单的一个包含form表格的html:

```html
<!--简单的写一个大题流程-->
<body>
    <form action="/poem" method="post">
        <p><input type="text" name="no1"></p>
        <p><input type="text" name="no2"></p>
        <p><input type="text" name="no3"></p>
        <p><input type="text" name="verb"></p>
        <input type="submit">
    </form>
</body>
```
可以看到，我们的表单action是/poem，也就是说同构submit按钮提交会转给server_adderss:port/poem这个路径处理，正好对用着我们在Application中设置的url，`(r'/poem',PoemHandler)`，这里，实际上index.html完全就是普通的html文件，跟正常的文件没有丝毫区别


然后是使用模板流程的poem.html
```html
<body>
    no1 --- {{no1}}
    no2 --- {{no2}}
    no3 --- {{no3}}
    verb --- {{verb}}
</body
```
这里就用到了模板文件中常用的数据占位符号`{}`


我们在往上面的PoemHandler类的post方法看看那：

```python
def post(self):
    no1=self.get_argument('no1')
    no2=self.get_argument('no2')
    ...
    self.render('poem.html',no1=no1,no2=no2,no3=no3,verb=verb)
```
由于是使用的post方法提交的转到的/poem页面，我们这里使用的是post方法处理数据（其他方法没有用）

self.get_argument这个方法没什么好讲的，简单通俗，从post发来的信息中听过argument name提取数据，这里的参数名就是index.html表格中的input name="..." 这个

`self.render('poem.html',no1=no1....)`

这里传递的context一定要设置好，即使我们在这里故意使用了相同的参数name，如果不在render方法中设置，服务器会认为你传递的是空的context，就像IndexHandler中的get方法一样，不需要使用context。

我们在模板文件中用两个大括号包裹的就是设置的context的左值，右值是我们之前处理的数据。


# 模板扩展 #

tornado中的模板扩展，包括extens和block块使用与Django都很相似，因为有前面的知识，这里我们简单过一下

## extends ##

原始的base文件base.html中使用的所有tag、layout、css、js内容都能够在使用扩展命令的其他模板文件中直接使用：

`{ % extends base.html % }`

这一点与Django完全一致

## block ##

只是继承原始的文件有什么用呢，一定要重写某些部分，够则与原始文件毫无二致，这需要2个步骤：

1. 在原始需要扩展的base.html中的某些需要替换部分使用`{ % block block_name % }{ % end % }`

2. 在扩展的文件中`{ % extends base.html % }`

3. 在扩展的文件中重写`block_name`部分

- base.html

```html
<!--base.html-->
hiahiahia
{ % block content % }
    I am the base.html
{ % end % }
```
- override.html

```html
<!--override.html-->
{ % extends "base.html" % }
{ % block content % }
I am the override.html
{ % end % }
```
override.html文件继承base.html文件内容，在content block块中修改相应的内容

Tips:因为在base.html中我们定义的是完整的html标签，我们不可能破坏了原有的整体布局，当然也可以在块中继续使用html标签、引用css、js等

这样我们在分别请求对应的url后会发现显示的不同的内容

与Django做对比，Django模板中也有block部分，使用也相当相似：

`{ % block content % }{ % endblock % }`

在Django中因为要与for循环的结束符号`{ % endfor % }`作出区别，没有直接使用end，而是选择了endblock，其他的毫无区别
