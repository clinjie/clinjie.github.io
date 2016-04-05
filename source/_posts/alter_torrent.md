title: 洗白BT文件
date: 2016-03-16 22:23:35
toc: true
tags: 
- torrent
- 编码
categories: torrent 
---

![](http://www.bt.com.au/images/homepage/panotile001.jpg)

# 写在前面 #

接着上篇文章，[torrent文件编码](/2016/03/14/torrent/).在`torrent文件编码`这篇文章的开始我就说过，种子文件对于青年男士有着巨大的诱惑力。我也不例外，由于国内文化教育方面抓的比较紧，所以某些领域的文件信息无法通过种子文件离线下载、进入高速通道。这个实现的原理很简单，直接通过扫描种子文件的tracker、服务器地址显然不可取，那就遍历<!--more-->torrent包含的文件名吧，这些文件往往会有很多露骨的字眼，净网行动进行了这么多年，文化教育领域对付这一套显然很有心得。

下面我们就先看一下torrent文件包含的文件吧，当然不是通过BT下载器：）

# libtorrent #

不造轮子，从我做起。网络上已经有大牛们制作的torrent库，其中最流行的应该就是libtorrent。  

*LibTorrent 是一个C++ 语言的 BitTorrent 开发库，支持 Linux/Unix 系统。旨在提供高性能和良好代码风格的 BT 开发包。该开发包与其他包不同的是，它直接通过网络堆栈抓取文件页，因此性能是官方客户端的三倍。*

libtorrent的python版本：

**Building the libtorrent python bindings will produce a shared library (DLL) which is a python module that can be imported in a python program.**

libtorrent API的中文翻译[戳这里](http://ksharpdabu.ctfile.com/file/18920987),当然没有python版本的API文件，不过既然已经安装了libtorrent的python binding，熟悉C++的API也是必做的一步。有条件的筒子们还是建议去读英文版的API吧[Here](http://www.libtorrent.org/)，虽然我也不知道为什么这样推荐。

# torrent_info #

上篇文章已经介绍了torrent文件包含的基本结构，一般来讲，简单的torrent文件有以下内容:

- info

包含文件的信息files、torrent显示的文件名name、发行商publisher-url。注意这里torrent文件名并不是那个我们可以简单通过重命名定义的name，而是torrent指向的那个大的文件或者文件夹名。

- comment

种子文件的注释

- encoding

目前一般为utf-8

- creation date

该关键字对应的值存放的是种子文件创建的时间

- announce-list

存放的是备用Tracker的URL

- created by

值存放生成种子文件的BT客户端软件的信息，如客户端名、版本号

- nodes

包含一系列ip和相应端口的列表，是用于连接DHT初始node。

- announce

Tracker的URL

其中我们最常用的信息就是`info`字段，里面包含我们需要的大部分信息。

种子文件分为单文件种子以及多文件种子：

## 单文件 ##

- name

要下载的文件名字

- length

要下载文件的大小（单位为byte）

- piece length

要下载文件按照piece length指定大小分片，此处指明单个分片大小。

- pieces

存储每个分片的SHA1值(每个SHA1的hash长度为20byte)

## 多文件 ##

- files  

表示该torrent为多文件形式，每个文件都是dictionary类型数据表示。 

- name

表示多个文件存储在以name命名的文件夹。 

- length

要下载文件的大小（单位为byte） 

- path

指出要下载文件存储相对于name字段表示的文件夹的位置。    

假设name为dir1，此时： 

1. 如果path值为file1.rmvb，表示file1.rmvb的存储路径为dir1\file1.rmvb  

2. 如果path值为dir2\file1.rmvb，表示file1.rmvb的存储路径为dir1\dir2\file1.rmvb

- piece length

要下载文件安装piece length指定大小分片，此处指明单个分片大小。 

- pieces

存储每个分片的SHA1值（每个SHA1的hash长度为20字节）



下面是子啊python下使用libtorrent库对torrent文件的操作:

```python
# -*- coding: utf-8 -*-
import libtorrent as lt

bt=lt.torrent_info(filepath)

bt.files()
#返回一个包含文件的列表

bt.nodes()
#返回DHT初始node

bt.name()
#返回torrent文件名

bt.pieces()
#分片SHA1值
```

# 洗白 #

```python
s= lt.bdecode(open(filepath, 'rb').read())
#通过对应的解码算法获取torrent文件的内容

# 修改说明文件
for item in s:
    if len(re.findall('comment.*?',item)):
        s[item]=str(s[item].__hash__())

#修改torrent文件名，保持了原来的文件格式
def alertFileName(dic):
     for i in dic:
        if len(re.findall('(name).*?',i)):
            if dic[i].find('.')<0:
                        dic[i]='[peihao.space]'+str(b'x')+str(path.__hash__())
            else :
                tem=dic[i].split('.')
                tem[len(tem)-1]=(re.findall('(\w+).*?',tem[len(tem)-1]))[0]
                dic[i]='[peihao.space]'+str(b'a')+str(tem[0].__hash__())+"."+tem[len(tem)-1]

#判断种子文件是否是多文件结构
def isMultiFiles(dict):
    for i in dict['info']:
        if i=='files':
            return True
    return False


#深度修改所有包含文件的名字 并保持原有文件格式
def deepSetFilesName(dict):
    for item in dict:#item是一个个包含文件信息的序列
        for info in item:
            if len(re.findall('(path).*?',info)):
                for i in range(0,len(item[info])):
                    path=item[info][i]
                    if path.find('.')<0:
                        item[info][i]='[peihao.space]'+str(b'x')+str(path.__hash__())
                    else :
                        tem=path.split('.')
                        tem[len(tem)-1]=(re.findall('(\w+).*?',tem[len(tem)-1]))[0]
                        item[info][i]='[peihao.space]'+str(b'a')+str(tem[0].__hash__())+"."+tem[len(tem)-1]

# 种子转磁力链
def bt2mag(name):
    bt=lt.torrent_info(name)
    return "magnet:?xt=urn:btih:%s&dn=%s" % (bt.info_hash(), bt.name())
```

# 效果 #

将生成的种子洗白程序用Tk造了一个壳子，效果如下

原来的torrent内容:

![](http://7xowaa.com1.z0.glb.clouddn.com/torrent1.png)

generate之后内容:

![](http://7xowaa.com1.z0.glb.clouddn.com/torrent2.png)

- [程序下载戳这里1](https://www.jianguoyun.com/p/DU66dOgQpYz2BRi_0RI)

- [或者这里:)](https://drive.google.com/file/d/0B-dTuxrWHzSzNldSeGkyS09UZ28/view?usp=sharing)

有多个版本python时，使用各自版本的Script一定要注意，像如果我要使用`pyinstaller`这个软件生成exe，最好在环境变量中先将想使用的有关python版本的路径放置在最前面

```python
pyinstaller -i=favicon.ico -F -w torrent.py
```

因为这里不止要保证pyinstaller的版本正确（可以用 绝对路径/pyinstaller.exe确认），隐式的python版本没办法显式设定，所以把在环境变量中的路径先更新，使用完之后在还原即可。