title: 初窥Scrapy(Py3.x)
date: 2016-02-28 22:23:35
toc: true
tags: 
- Python
- Scrapy
categories: Python
---

![](http://a1.jikexueyuan.com/home/201506/08/d4bc/5574f3f42607c.jpg)

Scrapy是一个为了爬取网站数据，提取结构性数据而编写的应用框架。 可以应用在包括数据挖掘，信息处理或存储历史数据等一系列的程序中。

其最初是为了 页面抓取 (更确切来说, 网络抓取 )所设计的， 也可以应用在获取API所返回的数据(例如 Amazon Associates Web Services ) 或者通用的网络爬虫。

本文档将通过介绍Scrapy背后的概念使您对其工作原理有所了解， 并确定Scrapy是否是您所需要的。

当您准备好开始您的项目后，您可以参考 [入门教程](http://scrapy-chs.readthedocs.org/zh_CN/latest/intro/tutorial.html#intro-tutorial "入门教程") 。

<!--more-->

# 选择一个网站 #

当您需要从某个网站中获取信息，但该网站未提供API或能通过程序获取信息的机制时， Scrapy可以助你一臂之力。

以 [Mininova](http://www.mininova.org/ "Mininova") 网站为例，我们想要获取今日添加的所有种子的URL、 名字、描述以及文件大小信息。

今日添加的种子列表可以通过这个页面找到:

[http://www.mininova.org/today](http://www.mininova.org/today)

# 定义您想抓取的数据 #

第一步是定义我们需要爬取的数据。在Scrapy中， 这是通过[Scrapy Items](http://scrapy-chs.readthedocs.org/zh_CN/latest/topics/items.html#topics-items) 来完成的。(在本例子中为种子文件)

我们定义的Item:

```python
import scrapy

class TorrentItem(scrapy.Item):
    url = scrapy.Field()
    name = scrapy.Field()
    description = scrapy.Field()
    size = scrapy.Field()
```

第二步是编写一个spider。其定义了初始URL([http://www.mininova.org/today](http://www.mininova.org/today))、 针对后续链接的规则以及从页面中提取数据的规则。

通过观察页面的内容可以发现，所有种子的URL都类似 `http://www.mininova.org/tor/NUMBER` 。 其中， `NUMBER` 是一个整数。 根据此规律，我们可以定义需要进行跟进的链接的正则表达式: `/tor/\d+` 。

我们使用 [XPath](http://www.w3.org/TR/xpath "XPath") 来从页面的HTML源码中选择需要提取的数据。 以其中一个种子文件的页面为例:

[http://www.mininova.org/tor/2676093](http://www.mininova.org/tor/2676093 "http://www.mininova.org/tor/2676093")
观察HTML页面源码并创建我们需要的数据(种子名字，描述和大小)的XPath表达式。

通过观察，我们可以发现文件名是包含在 `<h1>` 标签中的:

```html
<h1>Darwin - The Evolution Of An Exhibition</h1>
```

与此对应的XPath表达式:

```
//h1/text()
```

种子的描述是被包含在 `id="description"` 的 `<div>` 标签中:

```html
<h2>Description:</h2>

<div id="description">
Short documentary made for Plymouth City Museum and Art Gallery regarding the setup of an exhibit about Charles Darwin in conjunction with the 200th anniversary of his birth.

...
```

对应获取描述的XPath表达式:

```
//div[@id='description']
```

文件大小的信息包含在 `id=specifications` 的 `<div>` 的第二个 `<p>` 标签中:

```html
<div id="specifications">

<p>
<strong>Category:</strong>
<a href="/cat/4">Movies</a> &gt; <a href="/sub/35">Documentary</a>
</p>

<p>
<strong>Total size:</strong>
150.62&nbsp;megabyte</p>
```

选择文件大小的XPath表达式:

```
//div[@id='specifications']/p[2]/text()[2]
```

关于XPath的详细内容请参考[http://www.w3.org/TR/xpath](http://www.w3.org/TR/xpath "XPath参考手册")

最后，结合以上内容给出spider的代码:

```
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors import LinkExtractor

class MininovaSpider(CrawlSpider):

    name = 'mininova'
    allowed_domains = ['mininova.org']
    start_urls = ['http://www.mininova.org/today']
    rules = [Rule(LinkExtractor(allow=['/tor/\d+']), 'parse_torrent')]

    def parse_torrent(self, response):
        torrent = TorrentItem()
        torrent['url'] = response.url
        torrent['name'] = response.xpath("//h1/text()").extract()
        torrent['description'] = response.xpath("//div[@id='description']").extract()
        torrent['size'] = response.xpath("//div[@id='info-left']/p[2]/text()[2]").extract()
        return torrent
```

`TorrentItem` 的定义在上面

# 执行spider，获取数据 #

终于，我们可以运行spider来获取网站的数据，并以JSON格式存入到 `scraped_data.json` 文件中:

```python
scrapy crawl mininova -o scraped_data.json
```

命令中使用了 feed导出 来导出JSON文件。您可以修改导出格式(XML或者CSV)或者存储后端(FTP或者 Amazon S3)，这并不困难。

同时，您也可以编写 [item管道](http://scrapy-chs.readthedocs.org/zh_CN/latest/topics/item-pipeline.html#topics-item-pipeline "item管道") 将item存储到数据库中。

# 查看提取到的数据 #

执行结束后，当您查看 `scraped_data.json` , 您将看到提取到的`item`:

```
[{"url": "http://www.mininova.org/tor/2676093", "name": ["Darwin - The Evolution Of An Exhibition"], "description": ["Short documentary made for Plymouth ..."], "size": ["150.62 megabyte"]},
# ... other items ...
]
```

由于 selectors 返回list, 所以值都是以list存储的(除了 url 是直接赋值之外)。 如果您想要保存单个数据或者对数据执行额外的处理,那将是 Item Loaders 发挥作用的地方。


# 支持Python3.x的新版本 #

最新的一个好消息是，1.10rc新版本终于可以在Python3.x上使用，下载地址 [戳这里](https://codeload.github.com/scrapy/scrapy/zip/master).


下载完成之后，在终端使用命令

```
python setup.py install
```

即可使用！