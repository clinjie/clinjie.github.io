title: 校园网上网认证
date: 2016-02-24 12:23:35
tags: 
- Python
- Requests
categories: Python
---

![](http://7xowaa.com1.z0.glb.clouddn.com/css.jpg)


Python实现上网认证

----------

在学校的同行们应该都知道，目前国内大部分高校的上网采用网络认证系统，这可以简单化不同用户的权限管理，同时对于财务处理方面也有很大的优势。国内类似的系统，例如锐捷，我接触的比较多，通过简单的B/S网页账户登录认证实现上网。这几天，我就尝试使用了抓包工具以及Pyhton的模块做了一个简单的模拟一键登录、一键下线工具。    

<!--more-->

# Pyhton中流行的相关模块 #


## urllib ##

1. urlencode不能直接处理unicode对象，所以如果是unicode，需要先编码，有unicode转到utf8，举例：
```
urllib.urlencode (u'bl'.encode('utf-8'))
```

2. 示例
```python
import urllib       #sohu 手机主页
url = 'http://m.sohu.com/?v=3&_once_=000025_v2tov3&_smuid=\ICvXXapq5EfTpQTVq6Tpz'
resp = urllib.urlopen(url)
page = resp.read()
f = open('./urllib_index.html', 'w')
f.write(page)
print dir(resp)
#结果:
['doc', 'init', 'iter', 'module', 'repr', 'close', 'code', 'fileno', 'fp', 'getcode', 'geturl', 'headers', 'info', 'next', 'read', 'readline', 'readlines', 'url']
print resp.getcode(), resp.geturl(), resp.info(), resp.headers, resp.url
#resp.url和resp.geturl()结果一样
```
3. 编解码示例 urllib.quote和urllib.urlencode都是编码，但用法不一样

```python
s = urllib.quote('This is python')  #编码
print 'quote:\t'+s    ＃空格用%20替代
s_un = urllib.unquote(s)    ＃解码
print 'unquote:\t'+s_un
s_plus = urllib.quote_plus('This is python')  ＃编码
print 'quote_plus:\t'+s_plus            ＃空格用＋替代
s_unplus = urllib.unquote_plus(s_plus)       ＃解码
print 's_unplus:\t'+s_unplus
s_dict = {'name': 'dkf', 'pass': '1234'}
s_encode = urllib.urlencode(s_dict)    ＃编码字典转换成url参数 
print 's_encode:\t'+s_encode

#结果：
quote: This%20is%20python
unquote:   This is python
quote_plus:    This+is+python
s_unplus:  This is python
s_encode:  name=dkf&pass=1234
```
4. urlretrieve() urlretrieve多数适用单纯的只下载的功能或者显示下载的进度等

```
url = 'http://m.sohu.com/?v=3&_once_=000025_v2tov3&_\smuid=ICvXXapq5EfTpQTVq6Tpz'
urllib.urlretrieve(url, './retrieve_index.html')

#直接把url链接网页内容下载到retrieve_index.html里了，适用于单纯的下载的功能。
#urllib.urlretrieve(url, local_name, method)
```

## urllib2 ##

1. urllib2模块定义的函数和类用来获取URL（主要是HTTP的），他提供一些复杂的接口用于处理： 基本认证，重定向，Cookies等。 

2. 常用方法和类 urllib2.urlopen(url[, data][, timeout]) #传url时候，用法同urllib里的urlopen,它打开URL网址，url参数可以是一个字符串url或者是一个Request对象。可选的参数timeout，阻塞操作以秒为单位，如尝试连接（如果没有指定，将使用设置的全局默认timeout值）。实际上这仅适用于HTTP，HTTPS和FTP连接。

```
url = 'http://m.sohu.com/?v=3&_once_=000025_v2tov3&_\smuid=ICvXXapq5EfTpQTVq6Tpz'
resp = urllib2.urlopen(url)
page = resp.read()
```
3. urlopen方法也可通过建立了一个Request对象来明确指明想要获取的url。调用urlopen函数对请求的url返回一个response对象。这个response类似于一个file对象，所以用.read()函数可以操作这个response对象
```
url = 'http://m.sohu.com/?v=3&_once_=000025_v2tov3&_smuid\
=ICvXXapq5EfTpQTVq6Tpz'
req = urllib2.Request(url)
resp = urllib2.urlopen(req)
page = resp.read()
```
4. class urllib2.Request(url[, data][, headers][, originreqhost][, unverifiable])  

Request类是一个抽象的URL请求。5个参数的说明如下: 

- URL——是一个字符串，其中包含一个有效的URL。 
- data——是一个字符串，指定额外的数据发送到服务器，如果没有data需要发送可以为“None”。目前使用data的HTTP请求是唯一的。当请求含有data参数时，HTTP的请求为POST，而不是GET。数据应该是缓存在一个标准的application/x-www-form-urlencoded格式中。urllib.urlencode()函数用映射或2元组，返回一个这种格式的字符串。通俗的说就是如果想向一个URL发送数据（通常这些数据是代表一些CGI脚本或者其他的web应用）。例如在网上填的form（表单）时，浏览器会POST表单的内容，这些数据需要被以标准的格式编码（encode），然后作为一个数据参数传送给Request对象。Encoding是在urlib模块中完成的，而不是在urlib2中完成的。下面是个例子：
```python
import urllib
import urllib2
url = 'http://www.someserver.com/cgi-bin/register.cgi'
values = {'name' : 'Michael Foord',
       'location' : 'Northampton',
       'language' : 'Python' }
data = urllib.urlencode(values)      
req = urllib2.Request(url, data)   #send post
response = urllib2.urlopen(req)
page = response.read()
```
- headers——是字典类型，头字典可以作为参数在request时直接传入，也可以把每个键和值作为参数调用add_header()方法来添加。作为辨别浏览器身份的User-Agent header是经常被用来恶搞和伪装的，因为一些HTTP服务只允许某些请求来自常见的浏览器而不是脚本，或是针对不同的浏览器返回不同的版本。例如，Mozilla Firefox浏览器被识别为“Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11”。默认情况下，urlib2把自己识别为Python-urllib/x.y（这里的xy是python发行版的主要或次要的版本号，如在Python 2.6中，urllib2的默认用户代理字符串是“Python-urllib/2.6。下面的例子和上面的区别就是在请求时加了一个headers，模仿IE浏览器提交请求。

```python
import urllib
import urllib2
url = 'http://www.someserver.com/cgi-bin/register.cgi'
user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
values = {'name' : 'Michael Foord',
        'location' : 'Northampton',
        'language' : 'Python' }
headers = { 'User-Agent' : user_agent }
data = urllib.urlencode(values)
req = urllib2.Request(url, data, headers)
response = urllib2.urlopen(req)
the_page = response.read()
```
标准的headers组成是(Content-Length, Content-Type and Host)，只有在Request对象调用urlopen()（上面的例子也属于这个情况）或者OpenerDirector.open()时加入。两种情况的例子如下： 使用headers参数构造Request对象，如上例在生成Request对象时已经初始化header，而下例是Request对象调用add_header(key, val)方法附加header（Request对象的方法下面再介绍）：

```
import urllib2
req = urllib2.Request('http://www.example.com/')
req.add_header('Referer', 'http://www.python.org/')    
#http是无状态的协议，上一次客户端的请求与下一次客户端到服务器的请求无关系的，多数省略这一步
r = urllib2.urlopen(req)
```
OpenerDirector为每一个Request自动加上一个User-Agent header，所以第二种方法如下（urllib2.buildopener会返回一个OpenerDirector对象，关于urllib2.buildopener类下面再说）：

```
import urllib2
opener = urllib2.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]
opener.open('http://www.example.com/')
```
**urllib2.installopener(opener)和urllib2.buildopener([handler, ...])　**  

installopener和buildopener这两个方法通常都是在一起用,也有时候buildopener单独使用来得到OpenerDirector对象。
installopener实例化会得到OpenerDirector 对象用来赋予全局变量opener。如果想用这个opener来调用urlopen，那么就必须实例化得到OpenerDirector；这样就可以简单的调用OpenerDirector.open()来代替urlopen()。
build_opener实例化也会得到OpenerDirector对象，其中参数handlers可以被BaseHandler或他的子类实例化。子类中可以通过以下实例化：ProxyHandler (如果检测代理设置用)扫描代理会用到，很重要这个, UnknownHandler, HTTPHandler, HTTPDefaultErrorHandler, HTTPRedirectHandler, FTPHandler, FileHandler, HTTPErrorProcessor。

```
import urllib2
req = urllib2.Request('http://www.python.org/')
opener=urllib2.build_opener()
urllib2.install_opener(opener)
f = opener.open(req)
```
如上使用 urllib2.install_opener()设置 urllib2 的全局 opener。这样后面的使用会很方便，但不能做更细粒度的控制，比如想在程序中使用两个不同的 Proxy 设置等。比较好的做法是不使用 install_opener 去更改全局的设置，而只是直接调用 opener的open 方法代替全局的 urlopen 方法。

说到这Opener和Handler之间的操作听起来有点晕。整理下思路就清楚了。    

当获取一个URL时，可以使用一 个opener（一个urllib2.OpenerDirector实例对象，可以由build_opener实例化生成）。正常情况下程序一直通过urlopen使用默认的opener（也就是说当你使用urlopen方法时，是在隐式的使用默认的opener 对象），但也可以创建自定义的openers（通过操作 器handlers创建的opener实例）。所有的重活和麻烦都交给这些handlers来做。    

每一个handler知道如何以一种特定的协议（http，ftp等等）打开url，或者如何处理打开url发生的HTTP重定向，或者包含的HTTP cookie。创建openers时如果想要安装特别的handlers来实现获取url（如获取一个处理cookie的opener，或者一个不处理重定向的opener）的话，先实例一个OpenerDirector对象，然后多次调用.add_handler(some_handler_instance)来创建一个opener。或者，你可以用build_opener，这是一个很方便的创建opener对象的函数，它只有一个函数调用 。build_opener默认会加入许多handlers，它提供了一个快速的方法添加更多东西和使默认的handler 失效。

install_opener如上所述也能用于创建一个opener对象，但是这个对象是（全局）默认的opener。这意味着调用urlopen将会用到你刚创建的opener。也就是说上面的代码可以等同于下面这段。这段代码最终还是使用的默认opener。一般情况下我们用build_opener为的是生成自定义opener，没有必要调用install_opener，除非是为了方便。

```
import urllib2
req = urllib2.Request('http://www.python.org/')
opener=urllib2.build_opener()       ＃ 创建opener对象
urllib2.install_opener(opener)      ＃定义全局默认opener
f = urllib2.urlopen(req)          #urlopen使用默认opener，但是install_opener
#已经把opener设为全局默认了，这里便是使用上面的建立的opener
```

1. 如果只是单纯的下载或者显示下载进度，不对下载后的内容做处理等，比如下载图片，css，js文件等，可以用urlilb.urlretrieve（）
2. 如果是下载的请求需要填写表单，输入账号，密码等，建议用urllib2.urlopen(urllib2.Request())
3. 在对字典数据编码时候，用到的是urllib.urlencode()

## urllib and urllib2 区别 ##

urllib和urllib2模块都做与请求URL相关的操作，但他们提供不同的功能。  

urllib2.urlopen accepts an instance of the Request class or a url, （where as urllib.urlopen only accepts a url 中文意思就是：urllib2.urlopen可以接受一个Request对象或url在接受Request对象时候，并以此可以来设置一个URL的headers

urllib.urlopen只接收一个url    

urllib 有urlencode,urllib2没有，这也是为什么总是urllib，urllib2常会一起使用的原因

## requests ##

1. Requests 使用的是 urllib3，继承了urllib2的所有特性。Requests支持HTTP连接保持和连接池，支持使用cookie保持会话，支持文件上传，支持自动确定响应内容的编码，支持国际化的 URL 和 POST 数据自动编码。 

2. 举例：

```python
import requests

resp = requests.get('http://www.mywebsite.com/user')
userdata = {"firstname": "John", "lastname": "Doe", "password": "jdoe123"}
resp = requests.post('http://www.mywebsite.com/user', params=userdata)
resp = requests.put('http://www.mywebsite.com/user/put')
resp = requests.delete('http://www.mywebsite.com/user/delete')
resp.json()   # 假如返回的是json数据
resp.text     #返回的不是text数据
resp.headers['content-type']  #返回text/html;charset=utf-8
f = open('request_index.html', 'w')
f.write(page.encode('utf8'))          
#test 发现requests抓下来的页面必须要编码\
#写入,（抓下来的是unicode），urllib和urllib2抓下来可以直接写入，
#因为这两者抓下来的page是str
```
3. 其他功能特性

- 国际化域名和 URLs
- Keep-Alive & 连接池
- 持久的 Cookie 会话
- 类浏览器式的 SSL 加密认证 
- 基本/摘要式的身份认证
- 优雅的键/值 Cookies
- 自动解压
- Unicode 编码的响应体
- 多段文件上传
- 连接超时
- 支持 .netrc
- 适用于 Python 2.6—3.4
- 线程安全

4. requests不是python自带的库，需要另外安装 easy_install or pip install

5. requests缺陷:直接使用不能异步调用，速度慢（from others）。官方的urllib可以替代它。


# 通过Requests模块实现 #

最开始我尝试使用的是urllib模块，通过抓包工具获取上网认证的流程。一般正常的使用情况是，我们通过Browser的Get方式，获取服务器的Response，拿到登录界面，然后通过账户、密码的填写，表格POST传递给相应的action处理，然后在获取Response获取认证成功数据。我在做完了这一个工作之后，简化了第一步，直接构造传递表格信息，简化流程，提高运行速度。

```
POST http://***.***.***.***/eportal/userV2.do?method=login&param=true&wlanuserip=***&wlanacname=***&nasip=***&mac=***&t=wirelessv2&url=***&username=***&pwd=*** HTTP/1.1
Host: 172.18.6.30
User-Agent: 
Content-Length: 67
Accept-Encoding: gzip, deflate
Accept: */*
Content-Type: application/x-www-form-urlencoded
Connection: closed
```
通过urllib模块，我没能够将Connection这一状态保持，正常通过浏览器登录，在传递之后，肯定是保持连接存活的，但是通过Python的urllib模块，由于在模块的函数AbstractHTTPHandler.do_open()中已经固化了Connection为closed，所以很难改变。keep-alive 是http persistent connection，urllib 没有实现这个特性，所以不允许 keep-alive。试验后，上网认证必须保持keep-alive，否则的话就会提示没有这个设备，不能认证成功。    

我查阅了相关资料，有几种解决方案：

- httplib

- urlgrabber

- Requests

最后我就尝试使用了Requests模块，相当的简单方便。学校在认证信息传递过程的POST操作过程中，并没有将先关信息加密处理，省去了我的很多工作。


```python
postData = {'username' : '***',
            'usernameHidden':'',
            'authorMode':'',
            'pwd' : '***'}#自己填充


#构造header，一般header至少要包含一下两项。这两项是从抓到的包里分析得出的。
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 UBrowser/5.5.10106.5 Safari/537.36',
           'Referer' : 'http://172.18.6.30/',
           'Connection':'keep-alive',
           'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
           'Accept-Encoding':'gzip, deflate'}

posturl='http://172.18.6.30/eportal/userV2.do?method=login&param=true&wlanuserip=4a74b7a4b9aa0b72c9f20758e1b35282&wlanacname=353477f414861cdd&ssid=15e792de8d103cfd&nasip=704b71fc82aa0c88911e9f71944eba43&mac=aad9ba78888755209ff8e82016aa5765&t=wireless-v2&url=f58cd7a67bbfecbcf3027f3e4bf7b3807231ca007bf7eab9a0a21ad866eb54c0ca6c6fc25773bb30&username=***&pwd=***'
#上面的url是通过抓包获得
```  

然后做了一个简单的UI，打包成win平台可执行程序

![](http://7xowaa.com1.z0.glb.clouddn.com/login.png)