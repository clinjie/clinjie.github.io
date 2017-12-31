title: 网易新闻爬取
date: 2016-02-28 21:21:24
tags: 
- lxml
- 爬虫
categories: 网页解析
---

- 使用requests包来爬取页面。

- 使用正则表达式分析一级页面，使用Xpath来分析二级页面。

- 将得到的标题和链接，保存为本地文件。

只是一个闲来无事的小练手：

<!--more-->

```python
# -*- coding: utf-8 -*-
import os
import requests
import re

import time
from lxml import etree


def StringListSave(save_path, filename, slist):
    if not os.path.exists(save_path):
        os.makedirs(save_path)
    path = save_path+"/"+filename+".txt"
    with open(path, "w+",encoding='utf-8') as fp:
        for s in slist:
            fp.write("%s\t\t%s\n" % (s[0], s[1]))

def Page_Info(myPage):
    #使用re.S进行忽略\r\n换行号匹配
    mypage_Info = re.findall(r'<div class="titleBar" id=".*?"><h2>(.*?)</h2><div class="more"><a href="(.*?)">.*?</a></div></div>', myPage, re.S)
    return mypage_Info

def New_Page_Info(new_page):
    dom = etree.HTML(new_page)
    new_items = dom.xpath('//tr/td/a/text()')
    new_urls = dom.xpath('//tr/td/a/@href')
    #添加断言
    assert(len(new_items) == len(new_urls))
    return zip(new_items, new_urls)

def Spider(url):
    i = 0
    print("downloading ", url)
    myPage = requests.get(url).text
    myPageResults = Page_Info(myPage)
    save_path = u"网易新闻抓取"
    filename = str(i)+"_"+u"新闻排行榜"
    StringListSave(save_path, filename, myPageResults)
    i += 1
    for item, url in myPageResults:
        print("downloading ", url)
        new_page = requests.get(url).text
        newPageResults = New_Page_Info(new_page)
        filename = str(i)+"_"+item
        StringListSave(save_path, filename, newPageResults)
        i += 1
        #放置requests模块过快频率访问
        time.sleep(0.2)


print("start")
start_url = "http://news.163.com/rank/"
Spider(start_url)
print("end")
```

这里要注意的是，使用单线程requests模块短时间高频率的访问一个服务器上的内容，可能会导致requests崩溃，报错

```java
requests.exceptions.ConnectionError: HTTPConnectionPool(host='******', port=80): Max retries exceeded with url
```

错误信息也已经指的相当清楚，在这里可以通过人工的暂歇处理，降低当前服务器的访问频率：

`time.sleep(0.x)`

先使用lxml模块中的etree对象进行原始网页数据的页读取处理，生成元素树，然后通过强大的Xpath模块解析获取所需的内容。


![](http://7xowaa.com1.z0.glb.clouddn.com/163news.png)