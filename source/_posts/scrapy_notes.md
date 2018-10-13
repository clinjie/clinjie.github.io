title: Scrapy笔记
date: 2016-10-31 10:28:30
tags:
- python
- Scrapy
categories: python
---

这里记录两种使用率最高的Spider：Spider和他的子类CrawlSpider.

----------
# 组件梳理 #


先对整个Scrapy的部件进行梳理：

- Scrapy Engine
引擎负责控制数据流在系统中所有组件中流动，并在相应动作发生时触发事件。

- 调度器(Scheduler)
调度器从引擎接受request并将他们入队，以便之后引擎请求他们时提供给引擎。

- 下载器(Downloader)
下载器负责获取页面数据并提供给引擎，而后提供给spider。
<!--more-->
- Spiders
Spider是Scrapy用户编写用于分析response并提取item(即获取到的item)或额外跟进的URL的类。 每个spider负责处理一个特定(或一些)网站。 更多内容请看 Spiders 。

- Item Pipeline
Item Pipeline负责处理被spider提取出来的item。典型的处理有清理、 验证及持久化(例如存取到数据库中)。 更多内容查看 Item Pipeline 。

- 下载器中间件(Downloader middlewares)
下载器中间件是在引擎及下载器之间的特定钩子(specific hook)，处理Downloader传递给引擎的response（也包括引擎传递给下载器的Request）。 其提供了一个简便的机制，通过插入自定义代码来扩展Scrapy功能。处理下载请求部分

- Spider中间件(Spider middlewares)
Spider中间件是在引擎及Spider之间的特定钩子(specific hook)，处理spider的输入(response)和输出(items及requests)。 其提供了一个简便的机制，通过插入自定义代码来扩展Scrapy功能，处理解析部分


1. 引擎打开一个网站(open a domain)，找到处理该网站的Spider并向该spider请求第一个要爬取的URL(s)。
2. 引擎从Spider中获取到第一个要爬取的URL并在调度器(Scheduler)以Request调度。
3. 引擎向调度器请求下一个要爬取的URL。
4. 调度器返回下一个要爬取的URL给引擎，引擎将URL通过下载中间件(请求(request)方向)转发给下载器。
5. 一旦页面下载完毕，下载器生成一个该页面的Response，并将其通过下载中间件(返回(response)方向)发送给引擎。
6. 引擎从下载器中接收到Response并通过Spider中间件(输入方向)发送给Spider处理。
7. Spider处理Response并返回爬取到的Item及(跟进的)新的Request给引擎。
8. 引擎将(Spider返回的)爬取到的Item给Item Pipeline，将(Spider返回的)Request给调度器。
9. (从第二步)重复直到调度器中没有更多地request，引擎关闭该网站。

# Spider #

Scrapy中所有的Spider都是继承自scrapy.spiders.Spider这个类，所以他有爬虫类的一些共性，以及最常规符合我们思路的爬虫思想。

我们先看一下例子：
```python
import scrapy
from scrapy.linkextractors import LinkExtractor
from douban.items import CsdnItem

class CsdnSpider(scrapy.Spider):
	name='csdn'
	allowed_domains=['blog.csdn.net']
	start_urls=['http://blog.csdn.net/******/article/list/1']

	def parse(self,response):
		for info in response.xpath('//dl[@class="list_c clearfix"]/dd'):
			item=CsdnItem()
			item['title'] = info.xpath('h3/a/text()').extract()
			item['url'] = info.xpath('h3/a/@href').extract()
			item['description'] = info.xpath('p[@class="list_c_c"]/text()').extract()
			item['viewpoint']=info.xpath('div[@class="list_c_b"]/div[@class="list_c_b_l"]/span[1]/text()').extract()
			yield item
		next_page = response.xpath('//div[@class="pagelist"]/a[text()="下一页"]/@href')
		if next_page:
			url = 'http://blog.csdn.net'+next_page[0].extract()
			yield scrapy.Request(url, self.parse)
```

上面的例子是我自己的某博客网站进行爬虫，获取所有文章的标题，url摘要和访问数信息。自定义的CsdnSpider类就是基类的子类，我们对name、allowed_domans和start_urls进行赋值，分别代表项目的唯一爬虫名称、此爬虫爬虫的站点范围和初始爬虫的入口url。

设置之后，当我们开始进行爬虫程序后，scrapy.Spider末默认开始调用start_requests方法，对每个start_urls中的连接使用make_requests_from_url方法，尝试request访问返回Request对象，scrapy的downloader对请求实现，并返回response对象。之后我们需要对response信息提取有用的信息。


在spider类中，默认使用的解析方法是parse，按我们的理解来说，他应该算是抽象方法，也就是必须实现的方法，否则直接抛出Error
```python
def parse(self, response):
        raise NotImplementedError
```

response对象包含很多常用的属性，类似response.url、response.body等等都是能够直接返回数据，同时可以使用cssselector、xpath等方法对response深层的信息获取。item就是我们我们把需要获取的数据整合成的对象，包含一系列的Field属性保存爬取的数据；出现了yield说明这个函数是一个生成器，对比使用return，yield可以及时的将信息返回给pipline，更重要的是可以在一个生成器中同时生成一个Item和产生新的请求，return无法做到。


上面的例子执行的话可以使用
`scrapy crawl csdn -o xxx.json`

-o参数标明使用者选择将所有Item信息输出的文件中保存，后面紧随的就是文件名。


# CrawlSpider #

对比基类，CrawlSpider应该是一种更通用爬虫方法，通过使用Rule结构，CrawlSpider能够自动的在我们爬取的页面中更迭新的url，不用我们提取url信息。

```python
from scrapy.selector import Selector
from douban.items import CnBlogItem
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor


'''
平时在parse中return item即可返回item，return request则生成新的request请求。如果我们将return换为yield的话即可既返回item又生成新的request。注意一旦使用了yield，那么parse方法中就不能有return了。
'''
class CnBlogSipder(CrawlSpider) :
	name = "cnblog"   #设置爬虫名称

	allowed_domains = ["blog.csdn.net"] 
	start_urls = [
	    "http://blog.csdn.net/peihaozhu/article/list/1", 
	]
 
 
	rules = (
		Rule(LinkExtractor(allow=('/peihaozhu/article/list/\d+', ),),callback='parse_item',follow=True),
	)  #制定规则
 
 
	def parse_item(self, response):
		sel = response.selector
		posts = sel.xpath('//dl[@class="list_c clearfix"]/dd')
		items = []
		for p in posts:
			#content = p.extract()
			#self.file.write(content.encode("utf-8"))
			item = CnBlogItem()
			item["title"] = p.xpath('h3[@class="list_c_t"]/a/text()').extract()
			item["url"] = p.xpath('h3[@class="list_c_t"]/a/@href').extract()
			item['description']= p.xpath('p[@class="list_c_c"]/text()').extract()
			items.append(item)

		return items
```

rules属性就是我们需要在页面中自动更迭url的提取规则，这里我简单的使用了LinkExtractor提取器，设置了允许规则，标明在匹配到allow字段的url加入到爬取队列，follow字段决定是否将匹配到的继续使用Rule，callback很明显，就是我们提取到的url之后的回调函数，这里要注意下，类似上面的方法名，千万不要写self.parse_item，否则scrapy无法找到对应的函数。也不要使用parse作为我们的回调函数
```python
def parse(self, response):
        return self._parse_response(response, self.parse_start_url, cb_kwargs={}, follow=True)
```

parse方法不是空方法，有其他的内置方法是需要依赖这个方法体做出相应动作的。