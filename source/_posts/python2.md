title: Python学习(二)
date: 2016-1-1 17:39:55
tags: 
- python
categories: python
---
接着我的上篇文章，[Python学习(一)](http://chuangwailinjie.github.io/2015/12/20/python/)这篇文章，到目前为止，学习到的知识都是和解释器自带的数据结构打交道，程序与外部的交互知识通过input、print函数，这篇文章以及以后的内容会更多在这些方面倾斜。

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_python_main.jpg)

<!--more-->

文件素材
---

open函数用来打开文件，语法如下：

```
open(name[,mode[,buffering]])
```
open函数使用一个文件名作为唯一的强制参数，然后返回一个文件对象。模式mode和缓冲buffering参数都是可选的。下面是open函数中模式参数的常用值:


- 'r'---读模式(不提供参数时的默认选择)
- 'w'---写模式
- 'w'---写模式
- 'a'---追加模式
- 'b'---二进制模式(可添加到其他模式中使用)
- '+'---读/写模式(可添加到其他模式中使用)

'+'参数可以应用到其他任何模式中，指明读和写都是允许的，比如'r+'能在打开一个文本文件用来读写时使用

'b'模式给变处理文件的方法，普通情况下，Python嘉定处理的是文本文件（包含字符），但是如果处理的是其他类型的文件，比如说是图形、视频文件，就乐意选用此参数

open的第3个参数控制着文件的缓冲。如果参数是0或者是False，IO就是无缓冲的，所有的读写操作都是直接针对硬盘，如果是1或者是True，IO就是有缓冲的。，意味着Python使用暂时使用内存代替硬盘，让程序更快，只有使用flush或者close方法才会将缓冲写入硬盘。如果参数是大于1的数值，代表缓冲区的大小(B)，-1或者任意负数则是使用默认缓冲区大小。

基本文件方法:
---

类文件对象是支持一些文件的方法的对象（有时候也称为流），比如file方法，更重要的是支持read、write方法。

UNIX中的管式输出:

```
#data.txt内容
My name is chuangwailinjie ,and I want to make friends with u.

#hello.py内容
import sys
text=sys.stdin.read()
words=text.split()
wordcount=len(words)
print('Wordcount:',wordcount)
#在终端中输入
$ cat data.txt|python hello.py
#运行结果
Wordcount:12
```


- cat data.txt		：吧data.txt的内容写到标准输出(sys.stdout)



- python hello.py  	：运行了Python脚本hello.py，脚本从标准输入读，结果写入标准输出



- 管道符号 '|'			 :管道符号讲一个命令的标准输出和下一个命令的标准输入连接在一起.

如此，就知道hello.py会从它的sys.stdin中读取数据(从data.txt写入),并把结果写入它的sys.stdout中.

如果想要确保文件对象被关闭，有下面两种方法：

1. 使用try/except/finally块，并且在finally自剧中调用close方法.

2. 使用with语句.with语句可以打开文件并且复制到变量上面，之后就可将数据写入具体中的文件或执行其他操作，文件在语句结束后自动关闭.

```
with open('data.txt') as file:
	file.read()#或者其他文件操作
#输出结果


#基本的文件使用方法：
f=open('data.txt')
#这里length是指想要读取的字节数，要注意的是虽然python使用utf-8但是依然无法通过普通的read(n)
#正常显示汉字信息
f.read(length)
#读取整个文件的信息
file.read()
#readline()函数，逐行获取文件内容
#一次性逐行获取内容，并分行将信息储存到序列中
file.readlines()
file.close()
#当文件的打开模式设置为包括写权限(w、+)时，可以进行写操作
file=open('data.txt','w')
#虽然文件操作没有writeline函数，但是可以通过在字符串中添加换行符达到相同的目的
file.write('this is\njust a\ntest')
#还有一个常用的写方法
file.writelines(#需要写的文本序列)
file.close()
```


Python的GUI

----------

Python有很多流行的跨平台GUI模块，Tkinter、wxPython、Jython等等。这些模块可以协助我们打造很多精美的用户界面接口。本章主要介绍TKinter的使用，原来比较流行的wxpython最高只支持到python2.x.  


Tkinter模块("Tk 接口")是Python的标准Tk GUI工具包的接口.Python使用Tkinter可以快速的创建GUI应用程序。
由于Tkinter是内置到python的安装包中、只要安装好Python之后就能import Tkinter库、而且IDLE也是用Tkinter编写而成、对于简单的图形界面Tkinter还是能应付自如。   

创建一个GUI程序
1、导入Tkinter模块
2、创建控件
3、指定这个控件的master， 即这个控件属于哪一个
4、告诉GM(geometry manager)有一个控件产生了。

```
import tkinter
top = Tk()
# 进入消息循环
top.mainloop()
```

**两个简单的列表控件 **   


```
from tkinter import *
list1=['C','C++','Java','Python']
list2=['Python','Java','C++','C']
root=Tk()

listbox=Listbox(root)
for item in list1:
	listbox.insert(0,item)
listbox1=Listbox(root)
for item in list2:
	listbox1.insert(0,item)
listbox.pack()
listbox1.pack()
root.mainloop()
```


Tkinter 组件

----------
Tkinter的提供各种控件，如按钮，标签和文本框，一个GUI应用程序中使用。这些控件通常被称为控件或者部件。
目前有15种Tkinter的部件。我们提出这些部件以及一个简短的介绍，在下面的表:  

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_tktokit.jpg)



Python与数据库的支持
---

支持SQL标准的可用数据库有很多，其中多数在Python中都有对应的客户端模块。在提供相同功能的不同模块之间进行切换的问题通常是他们的接口API不同，为了解决Python中各种数据库模块间的兼容问题，现在已经通过了一个标准的DB API。每个数据库模块都支持一下三种全局变量：

```
apilevel		#所使用的Python DB API版本
threadsafety	#模块的线程安全等级
paramstyle		#在SQL查询中使用的参数风格
```

这里的线程安全性等级是个取值为0~3的整数。0表示线程安全不共享模块，3表示模块是完全线程安全的。1表示线程本身可以共享模块，但不对连接共享。


**异常**

下面是Python为DB提供的一些标准异常类：

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_db_error.jpg)


**连接**

为了使用基础的数九系统，首先必须连接到它。这个时候需要使用具有恰当名称的connect函数，该函数有多个参数，二聚体使用哪个参数取决于数据库。API推荐一下参数作为数据库模块连接函数的参数，并以顺序输入.

```
dsn			数据源名称，给出该参数表示数据库依赖		必选
user		用户名								可选
password	用户密码								可选
host		主机名								可选
database	数据库名								可选
```

当正确连接到数据库之后，在使用connect()函数之后会返回一个句柄，使用此句柄可以进行其他函数操作。其他有关的函数:  



```
close()			关闭连接后，连接对象和他的游标均不可用
commit()		如果支持的话就提交挂起的事务，否则不做任何事
rollback()		回滚挂起的事务
cursor()		返回连接的游标对象
```

**SQLite和PySQLite**  

如果你曾经经历过安卓开发，一定对SQLite这个数据库不陌生。小型的数据库引擎SQlite，不需要作为独立的服务器运行，并且不基于集中式数据库存储机制，而好似直接作用于本地文件，所以上手非常容易。  

在Python3.x版本中，SQLite的一个优势在于它的一个包装（PySQLite）已经被包括在标准库内。


**SQLite的简单入门**  
```
#将SQlite作为名为sqlite3的模块导入
import sqlite3
#创建一个到数据库文件的连接，如果文件不存在就会被创建
conn=sqlite3.connect('firstdb.db')
#之后使用conn这个对象可以对数据库进行操作
#获取连接的游标，这些游标用来执行SQL查询
curs=conn.cursor()
#完成查询并且做出某些更改后确保已经进行了提交，这样才能确保修改真正保存在数据库文件
conn.commit()
conn.close()
```


**数据库应用程序示例**  
建立一个小型营养成分数据库作为示例程序，程序基于USDA的营养数据实验室提供的数据，数据文件[点此下载](https://www.ars.usda.gov/SP2UserFiles/Place/80400525/Data/SR/SR28/dnload/sr28abbr.zip)，国外的服务器，所以可能回需要梯子操作。


ABBREV.txt文件中的数据每行都有一个数据记录，字段以脱字符(^)进行分割。数字字段直接包含数字，而文本字段由波浪号（~）括起来的字符串。
使用line.split('^')可以很轻松的把这样一行文字解析为多个字段。如果字段以波浪号开始，就是个字符串，使用field.strip('~')获取字段的有效值。

根据ABBREV.txt的数据建表  

```
#通过调用curs.execute执行INSERT语句并将文本字段中的值插入到数据库
import sqlite3
def convert(value):
	if value.startswith('~'):
		return value.strip('~')
	if not value:
		value='0'
	return float(value)
conn=sqlite3.connect('food.db')
curs=conn.cursor()
curs.execute('''
	CREATE TABLE food(
		id    TEXT    PRIMARY KEY,
		desc  TEXT,
		water FLOAT,
		kcal  FLOAT,
		fat   FLOAT,
		ash   FLOAT,
		carbs FLOAT,
		fiber FLOAT,
		sugar FLOAT
	)
	''')
query='INSERT INTO food VALUES(?,?,?,?,?,?,?,?,?)'
for line in open('ABBREV.txt'):
	fields=line.split('^')
	#这里要注意的是，因为提供的数据一行有很多数值，我们需要的只有在表中定义的列数，所以只使用前9列
	vals=[convert(f) for f in fields[:9]]
	curs.execute(query,vals)
conn.commit()
conn.close()
```

**搜索和展示数据**

使用数据库很简单，创建连接并获得该链接的游标，使用execute方法执行SQL查询，用fetchall提取结果。  




```
import sqlite3,sys
conn=sqlite3.connect('food.db')
curs=conn.cursor()
#这里使用sys.argv[1]获取输入的query指令，sys.argv[0]是 
#'python hello.py'
query='select * from food where %s' % sys.argv[1]
curs.execute(query)
#curs.description存储的是关于表没列属性的一些信息，序列包裹着元组，子序列的第一个值就是标的属性名称
names=[f[0] for f in curs.description]
#curs.fetchall()存储的是根据query语句获得的纯数据，形式也是序列包裹着元组，因为属性的数目是确定的，用元组
for row in curs.fetchall():
	for pair in zip(names,row):
		print('%s:%s' % pair)
	print()
#在终端中输入如下命令
$ python hello.py 'kcal <= 100 AND fiber >=10 order by sugar'
#在终端中会有滚屏显示数据
```

网络编程
---
**socket模块**  
在网络编程中的一个基本组件就是套接字，套接字主要是两个程序之间的信息通道。程序通过网络连接分布在不同的计算机上面，通过套接字相互发送信息。在Python中的大多数网络编程都隐藏socket模块的基本细节，  
套接字包括服务器套接字、客户端套接字：  

服务器套接字创建之后，让他等待连接，这样他就在某个网络地址（IP+Port）处监听网络   

客户机套接字只是简单的连接，完成事务、断开连接  

服务器端套接字使用bind方法后，在调用listen方法去监听这个给定的地址。客户端套接字使用connect方法连接到服 务器坚监听的地址。服务器端可以使用socket.gethostname得到当前主机名  

listen方法之后一个参数，即服务器未处理的连接的长度，也就是允许排队等待的连接数目，这些连接在停止接收之前等待接收。   

服务器端套接字开始监听后，他就可以接收客户端的连接。这个步骤使用accept方法来完成，方法会阻塞直到客户端的连接，然后该方法返回一个格式为(client,address)的元组，client是客户端的套接字。   

套接字有两个方法：send和recv来传输接收数据。  

一个简单的客户端、服务器端示例:
```
#服务器端
import socket
s=socket.socket()
host=socket.gethostname()
s.bind((host,1224))
s.listen(3)
while True:
	c,addr=s.accept()
	print('get connect from',addr)
	#Python3.x以上要求send流为字节化字符串
	c.send('Thx your connect'.decode('utf-8'))
	c.close()
#客户端
import socket
s=socket.socket()
host=socket.gethostname()
s.connect((host,1224))
#加上'.decode('utf-8')是为了将字节字符串正常显示'
print(s.recv(1024).decode('utf-8'))
```

**urllib模块**  

这个模块能让通过网络访问文件，通过简单的函数调用，几乎可以吧任何URL所指的东西用作程序的输入。

```
import urllib.request
#获取存储在本机的文本信息
localapp=urlopen(r'file:c:\key.txt')
data=localapp.read()
print(data.decode('utf-8'))
#获取网络信息
webapp=urlopen('http://www.python.org')
data=wepapp.read()
print(data.decode('utf-8'))
```

urllib.request模块提供了获取远程文件的方法，我们可以通过调用它实现简单的下载器:   

```
import urllib.request
#这里以前面提到的USDA的营养数据实验室提供的数据文件作为示范,由于是国外的数据文件，需要vpn或者能够直连代理
>>> urllib.request.urlretrieve('https://www.ars.usda.gov/SP2UserFiles/Place/8040
0525/Data/SR/SR28/dnload/sr28abbr.zip',r'c:\123.zip')
#函数调用之后返回的信息
('c:\\123.zip', <http.client.HTTPMessage object at 0x02E0ACD0>)
#现在下载的文件就保存在本机电脑的硬盘上
```

**socketserver模块**

SocketServer包含了4个基本的类：

1. 针对TCP套接字的TCPServer

2. 针对UDO数据包套接字的UDPServer

3. UnixStreamServer

4. UnixDatagramServer

为了写一个使用SocketServer框架的服务器，大部分代码会在一个请求处理程序中。每当服务器收到一个客户端的连接请求，就会实例化一个请求处理程序，并且处理方法会在处理请求时被调用。具体使用那个方法取决于特定的服务器和使用的处理程序类。  

基本的BaseRequestHandler类所有的操作都放在了处理器的一个叫做handle的方法中，当有客户消息进入的时候,方法会被服务器调用。这个方法会访问属性self.request中的客户端套接字，如果使用的是流(例如TCPServer)那么可以使用StreamRequestHandler类，创建两个新属性，self.rfile用于读取，self.wfile用于写入。然会就可以使用这类文件对象和客户机进行通信.

socketserver(在Python2.*中的是SocketServer模块)是标准库中一个高级别的模块。用于简化网络客户与服务器的实现（在前面使用socket的过程中，我们先设置了socket的类型，然后依次调用bind(),listen(),accept()，最后使用while循环来让服务器不断的接受请求。而这些步骤可以通过socketserver包来简化。）。模块中，已经实现了一些可供使用的类。

我们将再次实现之前的那个基本TCP的例子。你会注意到新实现与之前有很多相似之处，但你也要注意到，现在很多繁杂的事情已经被封装好了，你不用再去关心那个样板代码了。例子给出的是一个最简单的同步服务器。

为了要隐藏实现的细节。我们现在写程序时会使用类，这是与之前代码的另一个不同。用面向对象的方法可以帮助我们更好的组织数据与逻辑功能。你也会注意到，我们的程序现在是“事件驱动”了。这就意味着，只有在事件出现的时候，程序才有“反应”。

在之前的服务循环中，我们阻塞等待请求，有请求来的时候就处理请求，然后再回去继续等待。现在的服务循环中，就不用在服务器里写代码了，改成定义一个处理器，服务器在收到进来的请求的时候，可以调用你的处理函数。



- BaseServer 　　　           					包含服务器的核心功能与混合(mix-in)类的钩子功能。这个类用于派生，不要直接生成这个类的类对象，可以考虑使用 TCPServer 和UDPServer。 

- TCPServer/UDPServer     						基本的网络同步 TCP/UDP 服务器
 
- UnixStreamServer/UnixDatagramServer       		基本的基于文件同步 TCP/UDP 服务器
 
- ForkingMixIn/ThreadingMixIn            		实现了核心的进程化或线程化的功能，用于与服务器类进行混合(mix-in)，以提供一些异步特性。不要直接生成这个类的对象
 
- ForkingTCPServer/ForkingUDPServer         		ForkingMixIn 和 TCPServer/UDPServer 的组合
  
- ThreadingTCPServer/ThreadingUDPServer     		ThreadingMixIn 和 TCPServer/UDPServer 的组合  

- BaseRequestHandler       						包含处理服务请求的核心功能。只用于派生新的类，不要直接生成这个类的对象，可以考虑使用StreamRequestHandler或DatagramRequestHandler
 
- StreamRequestHandler/DatagramRequestHandler   TCP/UDP 服务器的请求处理类的一个实现  


```
#使用socketserver重新创建简易服务器
from socketserver import TCPServer,StreamRequestHandler
from time import ctime
class Handler(StreamRequestHandler):
	def handle(self):
		addr=self.request.getpeername()
		print('got connect from',self.client_address)

		self.wfile.write(('[%s] %s' %(ctime(),self.rfile.readline().decode('utf-8'))).encode('utf-8'))		
server=TCPServer(('',1234),Handler)		
server.serve_forever()
#客户端代码，依然使用socket模块
import socket
while True:
	client=socket.socket()
	host=socket.gethostname()
	client.connect((host,1234))
	data=input('-->')
	if not data:
		break
	data=(data+'\r\n').encode('utf-8')
	client.send(data)
	data=client.recv(1024).decode('utf-8')
	if not data:
		break
	print(data.strip())
	client.close()
```

**多连接**

前面提到的服务器解决方案都是同步的：一次只能连接一个客户机并处理它的请求。  

有3种方法能够实现多连接模式：  

- 分叉forking

- 线程thread

- 异步I/O asynchronous

通过对socketserver服务器使用混入类(mix-in class)，派生进程和线程很容易处理。即使要自己实现它们，这些方法也很容易使用。它们确实有缺点：分叉占据资源，并且如果有太多的客户端时分叉不能很好分叉（尽管如此，对于合理数量的客户端，分叉在现代的UNIX或者Linux系统中是很高效的，如果有一个多CPU系统，那系统效率会更高）；线程处理能导致同步问题。使用socketserver框架创建分叉或者线程服务器非常简单。   

分叉是一个UNIX术语，当分叉一个进程(一个运行的程序)时，基本上是复制了它，并且分叉后的两个进程都是从当前的执行点继续运行，并且每 个进程都有自己的内存副本。一个进程成为父进程，另一个进程成为子进程。  

当一个使用分叉的服务器中，每一个客户机连接都利用分叉创在一个子进程。父进程继续监听新的连接，同时子进程处理客户端。当客户端的请求结束时，子进程就退出了。分叉的晋城市并行运行的，所以客户端之间不必互相等待。  

线程是轻量级的进程或者子进程，所有的线程都存在与相同的进程中，共享内存。资源消耗的下降伴随一个缺陷：因为线程共享内存，所以必须确保他们的变量不会冲突，这些都是同步问题。

Tips:现代操作系统中windows不支持分叉

1.  分叉服务器


```
#windows不支持分叉
from socketserver import (TCPServer as TCP, StreamRequestHandler as SRH,ForkingMixIn as FMI)   #变动位置  
from time import ctime  
HOST = ''  
PORT = 1234  
ADDR = (HOST, PORT)  
class Server(FMI, TCP):                                                                         
#变动位置  
    pass  
class MyRequestHandler(SRH):  
    def handle(self):  
        print ('已经连接:', self.client_address)  
        self.wfile.write(('[%s] %s' % (ctime(), self.rfile.readline().decode("UTF-8"))).encode("UTF-8"))  
tcpServ = Server(ADDR, MyRequestHandler)                                                         #变动位置  
print ('等待新的连接。。。。')  
tcpServ.serve_forever()  
```

2. 多线程SocketServer服务器  


```
from socketserver import (TCPServer as TCP, StreamRequestHandler as SRH,ThreadingMixIn as TMI)   #变动位置  
from time import ctime  
HOST = ''  
PORT = 1234  
ADDR = (HOST, PORT)  
class Server(TMI, TCP):                                         #变动位置  
    pass  
class MyRequestHandler(SRH):  
    def handle(self):  
        print ('已经连接:', self.client_address)  
        data=self.request.recv(1024).strip().decode('utf-8')
        self.wfile.write(('[%s] %s' % (ctime(), data)).encode("UTF-8"))  
tcpServ = Server(ADDR, MyRequestHandler)                        #变动位置  
print ('等待新的连接。。。。')  
tcpServ.serve_forever() 
#对应的客户端代码
import socket
s=socket.socket()
host=socket.gethostname()
s.connect((host,1234))
s.send('I am connecting successful!'.encode('utf-8'))
print(s.recv(1024).decode('utf-8'))
```


3. 带有select和poll的异步I/O

当一个服务器与一个客户端通信时，来自客户端的数据可能是不连续的。如果使用分叉或者线程处理，这些没有问题。因为当一个程序在等待数据，另一个并行的程序可以继续处理他们自己的客户端。另外的方法就是只处理在给定时间内真正要进行通信的客户端，不需要一直监听，然后把它方法其他客户端的后面。  

这就是asyncore/asynchat框架和Twisted框架采用的方法，这种功能的基础是select/poll函数。（poll函数只能在unix系统中使用，poll函数的伸缩性相对性要好）

select函数需要3个序列作为必选参数，此外还有一个以秒为单位的超时时间作为可选。这些参数都是文件描述符整数，或者是带有返回这样整数的fileno方法的对象。这些就是我们等待的连接。3个序列分别用于输入、输出以及异常情况。如果没有给定超时时间，则默认为阻塞方式，如果超时时间为0，就是一个连续的poll，不阻塞。select的返回值是3个序列，每个代表相应参数的活动子集。  

下面的示例代码展示了一个使用select的为很多连接服务的服务器。服务器套接字本身被提供给select，这样select就能在准备接受一个新的连接时发出通知。服务器是一个简单的记录器，输出来自客户机的所有数据。


```
import socket,select
s=socket.socket()
host=socket.gethostname()
port=1234
s.bind((host,port))
s.listen(5)
inputs=[s]
while True:
	#返回相应参数的活动子集
	rs,ws,es=select.select(inputs,[],[])
	for r in rs:
		if r is s:
			#如果是刚join的客户机，就将创建的socket加入到inputs参数
			c,addr=s.accept()
			print('Got connection from',addr)
			inputs.append(c)
		else:
			try:
				data=r.recv(1024)
				disconnected=not data
			except socket.error:
				disconnected=True
			if disconnected:
				print(r.getpeername(),'disconnected')
				inputs.remove(r)
			else:
				print(data.decode('utf-8'))
#客户端的代码参考上面
```

可以看出来，通过一个While True跟一个for循环，逐次的处理客户机的事件。  
通过测试代码可以打印出来rs中的信息:  


```
[<socket.socket fd=296, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREA
M, proto=0, laddr=('192.168.252.1', 1234)>]
Got connection from ('192.168.252.1', 4451)
[<socket.socket fd=364, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREA
M, proto=0, laddr=('192.168.252.1', 1234), raddr=('192.168.252.1', 4451)>]
I am connecting successful!
```

inputs中保存的是服务器的依次socket、以及服务器与客户机连接创建的socket信息。  

而通过select函数返回的则是一一对应的关于socket的信息。如果for循环的是服务器socket，则处理它的客户机加入事件，否则则处理客户机的桥梁socket的会话消息


   
**poll方法的使用**  
poll方法使用起来币select方法较简单。在调用poll时候=，会得到一个poll对象，然后可以使用poll对象的register方法注册一个文件描述符（或者带有fileno方法的对象）。注册后可以使用register方法注册一个文件描述符。   
poll方法有一个可选的超时时间参数，并得到一个（fd，event）格式列表。其中fd是文件描述符，event则告诉你发生了什么，event是一个位掩符码(bitmask),就是一个整数，整数的每一位都会对应不同的事件，可以使用按位与&操作符进行检测某件事件是否发生。    


----------
pollin				读取来自文件描述符的数据
pollpri				读取来自文件描述符的紧急数据
pollout				文件描述符已经准备好数据，写入时候不会发生阻塞  
pollerr				与文件描述符有关的错误情况    
pollhup				挂起，链接丢失    
pollnyal			无效请求，链接没有打开  
----------


```
#使用poll方法重写select方法实现的serversocket
#在Windows系统下面不适用
import socket,select
s=socket.socket()
host=socket.gethostname()
port=1234
#socket.bind方法的参数是一个元组
s.bind((host,port))
#fd是一个字典映射，键和值分别是文件描述符(ints)和套接字的映射
fdmap={s.fileno():s}
#表示监听数目最多为5个
s.listen(5)
#poll方法实现的原理还是select模块，不过相比select更加灵活。不需要一直监听，只需要监听一会，然后将此服务器信息放在消息队列的末尾，等待再次处理
#p是select模块的poll对象
p=select.poll()
#通过p.register方法将套接字对象添加到监听的套接字列表
p.register(s)
while True:
	#将文件描述符以及事件返回
	events=p.poll()
	for fd,event in events:
		if fd in fdmap:
			#如果是服务器套接字的文件描述符，则获取与服务器连接的主机信息
			c,addr=s.accept()
			print("Got connection from",addr)
			#将新加入的套接字添加到监听列表
			p.register(c)
		elif event & select.POLLIN:
			#如果是其他主机通过其他套接字发送的数据，信息获取
			data=fdmap[fd].recv(1024)
			if not data:
				print(fdmap[fd].getpeername(),disconnction)
				p.unregister(fd)
				del fdmap[fd]
		else:
			print(data)
```


----------
**编写Twisted服务器**   

前面编写的基本套接字服务器都是显式的，其中有一些很清楚的事件循环，用来查找新的连接和新数据，但是基于socketserver的服务器有一个隐式的循环，在循环中服务器查找连接并为每个连接创建一个处理程序，但处理程序在读取数据时必须是显式的。Twited以及asyncore/asynchat框架使用一个甚至多个基于事件的方法。要编写基本的服务器，就要就要实现处理比如新客户端连接、新数据到达以及一个客户端断开连接等事件的时间处理程序。具体的类能通过基本类简历更精炼的事件，比如包装”数据到达“事件、收集数据直到新的一行，然后触发”一行数据到达“事件。     

事件处理程序在一个协议protocol中定义，在一个新的连接到达时，同样需要一个创建这种协议对象的工厂，但如果只是想要创建一个通用的协议类实例，那么可以使用Twited自带的工厂。factory类在twisted.internet.protocol模块中。当编写自己的协议时候，要使用和超类一样的模块中的protocol。得到了一个连接后，事件处理程序connectionMade就会被调用；丢失了一个连接后，connetctionLost会被调用。来自客户端的数据是通过处理程序dataReceived接收的。不能把事件处理策略把数据发回到客户端，如果要实现此功能，可以使用对象self.transport，这个对象有一个write方法，也有一个包含客户机地址（hostname+port）的client属性。  

这里只设计一点设置，必须实例化factory，还要设置它的protocol属性，这样它在和客户机通信时就知道是用什么协议（自定义协议）。然后就开始在给定的端口处使用工厂监听，这个工厂要通过实例化协议对象来准备处理连接。程序使用的是reactor中的listenTCP函数来监听，最后通过调用同一个模块中的run函数启动服务器。

```
#Tips: Twisted并非是python提供的标准模块，所以需要在第三方网站中下载，目前支持的最高版本为python2.7
#作为监听实例对象
from twisted.internet import reactor
from twisted.internet.protocol import Protocol，Factory
class SimpleLogger(Protocol):
	def connectionMade(self):
		print('GOt connection from',self.transport.client)
	def connectionLost(self,reason):
		print(self.transport.client,'disconnected')
	def dataReceived(self,data):
		print(data)
factory=Factory()
factory.protocol=SimpleLogger
#监听函数
reactor.listenTCP(1234,factory)
#Twisted主服务器循环
reaction.run()
```


## Python与万维网 ##

----------

**屏幕抓取技术**   

屏幕抓取是程序下载网页并提取信息的过程。如果涉及的网页时动态变化的，那么这项技术将更加有用，正常的情况下，使用urllib和re就可以很方便的测试这项技术。



```
from urllib.request import urlopen
import re
p=re.compile('<a href="(.*)" title=".*">(.*)</a>');
text=urlopen('https://www.python.org/community/jobs/').read().decode('utf-8');
for url,name in p.findall(text):
	print('%s (%s)' % (name,url))
#输出
Skip to content (#content)
Sign In (/accounts/login/)
About (/about/)
Applications (/about/apps/)
Quotes (/about/quotes/)
Getting Started (/about/gettingstarted/)
Help (/about/help/)
Downloads (/downloads/)
All releases (/downloads/)
Source code (/downloads/source/)
Windows (/downloads/windows/)
Mac OS X (/downloads/mac-osx/)
Other Platforms (/download/other/)
License (https://docs.python.org/3/license.html)
Alternative Implementations (/download/alternatives)
Documentation (/doc/)
Docs (/doc/)
Audio/Visual Talks (/doc/av)
Beginner&#39;s Guide (https://wiki.python.org/moin/BeginnersGuide)
Developer&#39;s Guide (https://docs.python.org/devguide/)
FAQ (https://docs.python.org/faq/)
Non-English Docs (http://wiki.python.org/moin/Languages)
PEP Index (http://python.org/dev/peps/)
Python Books (https://wiki.python.org/moin/PythonBooks)
Community (/community/)
Diversity (/community/diversity/)
IRC (/community/irc/)
Mailing Lists (/community/lists/)
Python Conferences (/community/workshops/)
Special Interest Groups (/community/sigs/)
Python Wiki (https://wiki.python.org/moin/)
Python Logo (/community/logos/)
Merchandise (/community/merchandise/)
Community Awards (/community/awards)
Success Stories (/about/success/)
Arts (/about/success/#arts)
Business (/about/success/#business)
Education (/about/success/#education)
Engineering (/about/success/#engineering)
Government (/about/success/#government)
Scientific (/about/success/#scientific)
Software Development (/about/success/#software-development)
News (/blogs/)
Python News (/blogs/)
Community News (http://planetpython.org/)
PSF News (http://pyfound.blogspot.com/)
PyCon News (http://pycon.blogspot.com/)
Events (/events/)
Python Events (/events/python-events/)
User Group Events (/events/python-user-group/)
Python Events Archive (/events/python-events/past/)
User Group Events Archive (/events/python-user-group/past/)
Submit an Event (https://wiki.python.org/moin/PythonEventsCalendar#Submitting_an
_Event)
Applications (/about/apps/)
Quotes (/about/quotes/)
Getting Started (/about/gettingstarted/)
Help (/about/help/)
All releases (/downloads/)
Source code (/downloads/source/)
Windows (/downloads/windows/)
Mac OS X (/downloads/mac-osx/)
Other Platforms (/download/other/)
License (https://docs.python.org/3/license.html)
Alternative Implementations (/download/alternatives)
Docs (/doc/)
Audio/Visual Talks (/doc/av)
Beginner&#39;s Guide (https://wiki.python.org/moin/BeginnersGuide)
Developer&#39;s Guide (https://docs.python.org/devguide/)
FAQ (https://docs.python.org/faq/)
Non-English Docs (http://wiki.python.org/moin/Languages)
PEP Index (http://python.org/dev/peps/)
Python Books (https://wiki.python.org/moin/PythonBooks)
Diversity (/community/diversity/)
IRC (/community/irc/)
Mailing Lists (/community/lists/)
Python Conferences (/community/workshops/)
Special Interest Groups (/community/sigs/)
Python Wiki (https://wiki.python.org/moin/)
Python Logo (/community/logos/)
Merchandise (/community/merchandise/)
Community Awards (/community/awards)
Success Stories (/about/success/)
Arts (/about/success/#arts)
Business (/about/success/#business)
Education (/about/success/#education)
Engineering (/about/success/#engineering)
Government (/about/success/#government)
Scientific (/about/success/#scientific)
Software Development (/about/success/#software-development)
News (/blogs/)
Python News (/blogs/)
Community News (http://planetpython.org/)
PSF News (http://pyfound.blogspot.com/)
PyCon News (http://pycon.blogspot.com/)
Python Events (/events/python-events/)
User Group Events (/events/python-user-group/)
Python Events Archive (/events/python-events/past/)
User Group Events Archive (/events/python-user-group/past/)
Submit an Event (https://wiki.python.org/moin/PythonEventsCalendar#Submitting_an
_Event)
Developer&#39;s Guide (http://docs.python.org/devguide/)
Issue Tracker (http://bugs.python.org/)
python-dev list (https://mail.python.org/mailman/listinfo/python-dev)
Core Mentorship (http://pythonmentors.com/)
```


这段代码并不是完全可读的，对于更复杂的HTML代码和查询来说，表达式会变得乱七八糟并且不可维护。   

程序对于CDATA部分和字符实体&amp;之类的HTML特性是无法处理的，如果碰到了这类特性，程序很有可能会失败。    

正则表达式被HTML源代码约束，而不是取决于更抽象的结构，这就意味着网页结构中很小的改变就会导致程序中断。   

**Tidy和XHTML解析**   
 
Python标准库中有很多支持结构化格式的库，例如HTML和XML。XHTML是HTML最新的方言，是XML的一种形式。对于包含正确而且有效的XHTML的网页方言，解析的工作一定相当加单，问题在于很多人在使用HTML的时候并不标准，而很多浏览器对于这些语法问题都相当的宽容，并且会尽最大努力渲染最混乱且无意义的HTML。    

标准库中解析HTML的一般方法是基于事件的，所以需要编写像解析器一样顺序处理数据的时间处理程序。标准库模块sgmllib和htmllib可以用这种方式解析非常混乱的HTML，但是如果希望提取基于文档结构的数据（例如在第二个二级标题下的第一个项目），那么在确实标签的情况下可能会比较复杂。这里介绍另外一种办法：Tidy    

Tidy是用来修复不规范而且随意的HTML的工具，能够以相当智能的方法修复一般错误。Tidy当然不可能修复HTMl文件中的苏有问题，但是它能够至少保证所有被修复过的HTML文件语法正确，保证正确的嵌套结构。这样修复之后再处理解析，工作量就会大大降低。  

最新发布的Tidy版本一般都放在github的repository上面，可以自行搜索获取安装，同时要下载一个Tidy的Python包装，例如uTidyLib、mxTidy。
需要注意的是mxTidy也是只支持到python2.x版本。下面通过Tidy的subprocess模块或者其他包含popen函数的模块运行Tidy程序：    



```
from subprocess import Popen. PIPE
text=open('messy.html').read()
tidy=Popen('tidy',stdin=PIPE,stdout=PIPE,stderr=PIPE)
tidy.stdin.write(text)
tidy.stdin.close()
#由于只能在python2.x版本中使用Tidy，所以这里是用的python语法也是2.x时代
print tidy.stdout.read()
```


之后我们可以将通过Tidy解析过得html内容或者其他标准XHTML、HTML内容使用HTMLParser模块（需要注意的是，这里并不是htmllib中的HTMLParser类）。使用HTMLParser的意思就是继承他，并且对handle_starttage或handle_data等事件处理方法进行覆盖。

![](http://7xowaa.com1.z0.glb.clouddn.com/htmlparser.png)

如果只是需要正常的屏幕截取，一般不需要实现所有的解析器（事件处理程序）回调，也可能不用创造整个文档抽象表示法来查找自己需要的内容。

```
from urllib import urlopen
from HTMLParser import HTMLParser
class Scraper(HTMLParser):
	in_li=False
	in_link=False
	def handle_starttag(self,tag,attrs):
		attrs = dict(attrs)
		if tag== 'li':
			self.in_li=True

		if tag=='a' and 'href' in attrs:
			self.in_link=True
			self.chunks=[]
			self.url=attrs['href']
	def handle_data(self,data):
		if self.in_link:
			self.chunks.append(data)
	def handle_endtag(self,tag):
		if tag=='li':
			self.in_li=False
		if tag=='a':
			if self.in_li and self.in_link:
				print '%s ,(%s)' % (''.join(self.chunks),self.url)
			self.in_link=False
text=urlopen('https://python.org/community/jobs').read().decode('utf-8')
parser=Scraper()
parser.feed(text)
parser.close()
```


----------
现在介绍另外一种较轻量级的抓取模块Beautuful Soup   

Beaytiful Soup是个小模块，用来解析和检查经常在网上看到的那类乱七八糟而且极为不规范的HTML，下载完成后将BeautifulSoup.py文件放置在python安装目录中专门存放第三方模块的site-packages文件夹中。捉着直接使用pip命令安装第三方库，pip等工具的安装可以浏览[这里](http://www.cnblogs.com/zdz8207/p/python_learn_note_16.html "这里")。放置完成后，我们开始进行一个简单的测试：

```
from bs4 import BeautifulSoup #process html
html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>
<p class="story"><a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>
and they lived at the bottom of a well.</p>
<p class="story">...</p>
"""
soup = BeautifulSoup(html_doc)
print(soup.find_all('title'))
print(soup.find_all('p','title'))
print(soup.find_all('a'))
print(soup.find_all(id="link2"))
print(soup.find_all(id=True))
#输出结果
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>
<p class="story"><a class="sister" href="http://example.com/elsie" id="link1">El
sie</a>
and they lived at the bottom of a well.</p>
<p class="story">...</p>
</body></html>
```

如上面的代码，可以看出来，本来的原始信息是不正规的，不符合Html语法，但是经过BeautifulSoup函数处理之后输出返回，是格式化的正确修饰信息。当然，BeautifulSoup的强大之处在于对于网页各部分元素、属性的查找。在我另外一篇文章中这方面设计的比较多。[戳这里](chuangwailinjie.github.io/2016/01/22/BeautifulSooup/ "Python抓取豆瓣电影排行")


**使用CGI创建动态网页**   
前面讲的都是客户端技术，现在来开始看服务器端。CGI（Common Gateway Interface,通用网页接口）。CGI是网络服务器可以将查询（一般来说是通过Web表单）传递到专门的程序（比如Python等）中并且在网页上显示结果的标准机制。它是创建万维网应用程序而不用编写特殊用途的应用服务器的简单方法。     

Python CGI程序设计的关键工具是cgi、cgitb模块。    



1. CGI程序应该放在通过网络可以访问的目录中，并且将他们标识为CGI脚本，这样网络服务器就不会将普通源代码作为网页处理。


- 将脚本放在叫做cgi-bin的子目录中.

- 将脚本文件的扩展名改为.cgi. 


2. 当把脚本放在正确位置之后，需要在脚本的开始处增加pound bang行。这一步是至关重要的，如果没要这行标识，网络服务器就不知道如何执行脚本。脚本可以用其他语言来写，比如Perl、Ruby。一般来讲，只要加上这句

```
#!/usr/bin/env python
```

这一这行文字是以UNIX风格填写的，前面无空行、结尾以'\n'而非'\r\n'.在Windows中，可以使用Python二进制版本的全路径：

```
#!C:\Python34\python.exe
```


3. 要做的最后一件事情就是这只合适的文件许可。确保每个人都可以读取和执行脚本文件，同时要确保这个文件只能由你写入。（就是在Linux中修改文件的权限）修改文件许可的Linux命令式chmod，只要运行下列命令
	
	chmod 755 somescript.cgi

即将文件权限设置为只能由本用户全部操作，而用户组以及其他用户只享有r、w权限，无x执行权限。在做好这些准备之后，应该能够将脚本作为网页打开、执行。


----------
下面开始进行一些简单的CGI脚本演示：

```
#!usr/bin/env python

print('Content-type: text/plain')
print()#打印空行以结束首部

print('Hello,world!')
```

将我们需要放置的服务器配置完成后（[/2016/01/25/python_cgi/](/2016/01/25/python_cgi/ "Python CGI初体验")）,就可以通过正确的URL访问我们的CGI程序。   


**使用cgitb调试**   

有时候编程的错误会让程序因为没有捕捉到异常而已堆栈跟踪终止。当通过CGI运行程序时，这种情况很有可能会得到由服务器返回的无帮助错误信息。cgitb，适用于CGI回溯的模块，导入它并且调用enable函数，就能够包含出错信息的有用的网页。
 
```
#!C:\Python34\python.exe
import cgitb; cgitb.enable()

print('Content-type: text/html')
print()#打印空行以结束首部

print(1/0)
print('Hello Python!')
```
将源代码文件保存在htdocs根目录或其他可访问目录下，访问执行。生成如下信息：

```
ZeroDivisionError	Python 3.4.3: C:\Python34\python.exe
Tue Jan 26 00:38:18 2016
A problem occurred in a Python script. Here is the sequence of function calls leading up to the error, in the order they occurred.

 D:\xampp\htdocs\test.py in ()
      4 print('Content-type: text/html')
      5 print()#打印空行以结束首部
      6 
=>    7 print(1/0)
      8 print('Hello Python!')
builtin print = <built-in function print>
ZeroDivisionError: division by zero 
      args = ('division by zero',) 
      with_traceback = <built-in method with_traceback of ZeroDivisionError object>
```

**使用CGI模块**

到目前为止，程序只能产生输出，而不接受任何形式的输入。输入是通过HTML表单提供给CGI脚本的键值对，可以使用cgi模块的FiledStorage类从CGI脚本中获取这些字段。    

当创建FieldStorage实例时，他会从请求中获取输入变量，然后通过字典接口将他们提供给程序。FieldStorage的值可以通过普通的键查找方式访问。例如想要知道名为'name'的值，可以这样

```
form = cgi.FieldStorage()
name = form['name'].value
#或者如下操作
form = cgi.FieldStorage()
name = form.getvalue('name','Unkonwn')
#这里提供了一个默认值'Unkonwn'，如果不提供的话，就会将None作为默认值提供
```

下面是一个上面示例的扩展版本，在同一个页面内添加一个form表单，尝试改变属性名'name'的值，然后提交，表单的action是页面文件本身。当没有提交的时候，页面显示程序提供的默认值。

```
#!C:\Python34\python.exe
import cgi
form = cgi.FieldStorage()
name = form.getvalue('name','Python')
print('Content-type: text/html')
print()#打印空行以结束首部


print('''
	<html>
		<head>
			<title>Greeting Page</title>
		<head>
		<body>
			<h1>Hello,%s!</h1>

			<form action="test.py">
			Change name<input type="text" name="name"/>
			<input type="submit"/>
			</form>
		</body>
	</html>
	''' %name)
```

**Mod_Python**   

mod_python是apache组织的一个项目，通过它，可以开发psp或cgi，mod_python功能强大，速度快，是非常优秀的web开发工具。mod_python的一个最主要优点就是在性能上超越传统CGI。   


Apache分阶段的处理请求(比方说：读取请求,解析header, 检查存取路径,等等)。这些阶段能被称为"处理器"(handler)的函数实现。传统上, "处理器"是由C语言编写，并编译成Apache的模块。Mod_python提供了一个通过Python写的Apache处理器的来扩展Apache功能的方法。关于Apache请求处理过程的详尽描述，请参阅 Apache API Notes, 也可以参阅 Mod_python - Integrating Python with Apache。
为了轻松地从CGI移植，一个标准的mod_python处理器提供了模拟的CGI环境，允许用户在不对代码做任何修改的情况下，使遗留的脚本运行在mod_python下(大多数情况)。  


mod_python可以让Python解释器直接成为Apache的一部分，这样一来就可以在程序中应用很多很酷的东西。它提供了Python中编写Apache处理程序的功能，使用mod_python处理程序框架可以访问丰富的API，深入Apache内核。 


- CGI处理程序，允许使用mod_python解释器运行CGI脚本，执行速度会有相当大的提高。

- PSP处理程序，允许用HTML以及Python代码混合编程创建可执行网页（executable web page）或者Python服务器页面（Python Server Page）。

- 发布处理程序（Publisher Handler），允许使用URL调用Python函数。  

更多的信息，我就不在这里叙述了。想要了解的可以自行在网络上获取。

 