title: 演员电影评分排序
date: 2016-02-28 22:23:35
tags: python
categories: python
---

![](http://7xowaa.com1.z0.glb.clouddn.com/origin.jpg?imageView/2/w/610/q/100)

这几天晕晕乎乎的，什么都不想干，窝在房间里面看电影。可是呢，这些年已经把太多好评如潮的电影塞进脑子里，又不想一个个的翻豆瓣、烂番茄再看每个影人的电影评分，这时候呢，需求是我码代码的推动力:)爬虫试试呗

<!--more-->

# 获取演员ID #

豆瓣有个电影栏目，通过在里面的编辑框输入想要搜索的演员名，然后搜索就可以找到对应的影人。大多数搜索服务的连接都是通过get，因为搜索功能不牵扯到过多的私密信息，所以可以绕过搜索框直接在url中添加关键字搜索。


返回的网页中，一般如果是正确搜索，没有错误的演员信息，就会在第一条内容中显示演员的基本信息、简介、网页链接。可以直接通过Xpath获取。


豆瓣中不同演员的区分在url中是以actor id作主要评判。在上面中获取的url中就可以直接截取。

```python
def getActorID():
    url='https://movie.douban.com/celebrities/search?search_text='
    global actorname
    actorname=input('请输入演员名：\n')
    html=requests.get(url+actorname.strip()).text
    dom=etree.HTML(html)
    urls=dom.xpath('//div[@class="content"]/h3/a/@href')
    if len(urls)>0:
        item=urls[0]
        id=re.findall('https://movie.douban.com/celebrity/(\d*)/',item)
        return id[0]
    return None
```

# 获取电影分页信息 #

每个影人参与的电影数量肯定是不一样的，豆瓣里面以10部电影划分，所以就会有不同的分页信息。豆瓣的分页信息很工整，每个url都可以通过简单的加减乘除算法获得，但是总共的页面数就需要先行获取。

这里有两种方式：

1. 直接通过计算特定的分页url数目

2. 豆瓣中在每个页面下面会标明总共的影片数目

很明显，第二种方法相当简单,例如

```html
<span class="count">(共200条)</span>
```

直接通过Xpath语句

```python
'\\span[@class="conyent"]\text()'
``` 

```python
def getCount(ids):
    if ids:
        url='https://movie.douban.com/celebrity/'+ids+'/movies?start=0&format=pic&sortby=time&'
        html=(requests.get(url)).text
        dom=etree.HTML(html)
        counts=dom.xpath('//span[@class="count"]/text()')
        if len(counts)>0:
            counts=re.findall('共(\d*?)条',counts[0])
            if len(counts)>0:
                count=counts[0]
                if int(count)/10-int(int(count)/10)>0:
                    return int(int(count)/10+1)
                else :
                    return int(int(count)/10)
    else:
        return None
```

# 获取每部影片的有效信息 #
有了影人的actor id，有了分页信息，就可以直接在影片的摘要上面获取我们所需的信息--

- 电影名称

- 评分

- 相应的豆瓣页面URL

这里就相当的简单方便了

```python
def getContent(ids,count):
    movieList=list()
    if ids and count:
        for id in range(0,count):
            starturl='https://movie.douban.com/celebrity/'+ids+'/movies?start='+str(id*10)+'&format=pic&sortby=time&'
            html=(requests.get(starturl)).text
            dom=etree.HTML(html)
            url=dom.xpath('//h6/a/@href')
            content=dom.xpath('//h6/a/text()')
            soup=BeautifulSoup(html,'lxml')
            star=soup.findAll(attrs={'class':'star clearfix'})
            for i in range(0,len(star)):
                items=re.findall('<span>(\d\.\d)</span>',str(star[i]))
                if not items:
                    star[i]=0
                else:
                    star[i]=float(items[0])
            assert(len(url)==len(content)==len(star))
            tem=zip(content,star,url)
            for index in tem:
                movieList.append(index)
        movieList=sorted(movieList,key=lambda d:d[1],reverse=True)
    return movieList
```   

# 小结 #

这里直接贴出来整个的代码，接入了写入磁盘功能:

```python
import os
from operator import itemgetter

import requests
import time
import re

import sys
from bs4 import BeautifulSoup
from lxml import etree

actorname=''

def getActorID():
    url='https://movie.douban.com/celebrities/search?search_text='
    global actorname
    actorname=input('请输入演员名：\n')
    html=requests.get(url+actorname.strip()).text
    dom=etree.HTML(html)
    urls=dom.xpath('//div[@class="content"]/h3/a/@href')
    if len(urls)>0:
        item=urls[0]
        id=re.findall('https://movie.douban.com/celebrity/(\d*)/',item)
        return id[0]
    return None

def getCount(ids):
    if ids:
        url='https://movie.douban.com/celebrity/'+ids+'/movies?start=0&format=pic&sortby=time&'
        html=(requests.get(url)).text
        dom=etree.HTML(html)
        counts=dom.xpath('//span[@class="count"]/text()')
        if len(counts)>0:
            counts=re.findall('共(\d*?)条',counts[0])
            if len(counts)>0:
                count=counts[0]
                if int(count)/10-int(int(count)/10)>0:
                    return int(int(count)/10+1)
                else :
                    return int(int(count)/10)
    else:
        return None

def getContent(ids,count):
    movieList=list()
    if ids and count:
        for id in range(0,count):
            starturl='https://movie.douban.com/celebrity/'+ids+'/movies?start='+str(id*10)+'&format=pic&sortby=time&'
            html=(requests.get(starturl)).text
            dom=etree.HTML(html)
            url=dom.xpath('//h6/a/@href')
            content=dom.xpath('//h6/a/text()')
            soup=BeautifulSoup(html,'lxml')
            star=soup.findAll(attrs={'class':'star clearfix'})
            for i in range(0,len(star)):
                items=re.findall('<span>(\d\.\d)</span>',str(star[i]))
                if not items:
                    star[i]=0
                else:
                    star[i]=float(items[0])
            assert(len(url)==len(content)==len(star))
            tem=zip(content,star,url)
            for index in tem:
                movieList.append(index)
        movieList=sorted(movieList,key=lambda d:d[1],reverse=True)
    return movieList

def saveFilebyList(movieList):
    if movieList:
        filename=os.path.join(sys.path[0],actorname+'.txt')
        with open(filename, "w",encoding='utf-8') as fp:
            for s in movieList:
                fp.write("%s\t\t%s\t\t%s\n" % (s[0], s[1], s[2]))

if __name__ == '__main__':
    ids=getActorID()
    count=getCount(ids)
    movieList=getContent(ids,count)
    saveFilebyList(movieList)
    if movieList:
        for item in movieList:
            print(item[0],item[1],item[2])

```

![](http://7xowaa.com1.z0.glb.clouddn.com/actor.png)