title: Scrapy爬取知乎两种思路
date: 2016-11-3 16:28:30
tags:
- python
- Scrapy
categories: python
---

介绍两种直接爬取知乎的方法，一种是通过CrawlSpider类，从Question页面开始，通过Rule自动填充带爬取页面；第二种是登录知乎首页之后，通过模拟js下拉页面发送ajax请求解析返回json数据填充原有的zhihu首页爬取。实际上还有另外一种，我们使用scrapy splash模块或者selenium工具模拟js操作，这种方法相比第二种方法更直接、简便，之后的文章会有介绍。

在做这些之前，首先你要设置好item的feed以及通用的header。这些在我其他的一些文章中有提到过

<!--more-->

# 爬取question页面 #

知乎的问题页面是不需要登录就可以直接爬取的，有次我尝试登录失败后，返回了错误代码，但是发现这并未影响继续对问题页面的爬虫。

为题页面的url一般类似`/question/\d{8}`，收尾是8个数字，问题页面会随机出现与本问题有类似、相关共性的其他问题url，这就让我们使用CrawlSpider类有了可能。关于CrawlSpider的前置学习，请参考：[Scrapy笔记](http://peihao.space/2016/10/31/scrapy_notes/)

通过使用CrawlSpider类支持的rules，制定自动提取的问题界面url规则：

```python
rules = (Rule(LinkExtractor(allow = [r'/question/\d{8}$',r'https://www.zhihu.com/question/\d{8}$' ]), callback = 'parse_item', follow = True))
```

上面的规则允许提取符合为题界面的absolute url或者relative url填充到爬虫队列中，并设置了请求这些url之后response的处理方法，`parse_item(self,response)`，这里要再说一次，callback直接写parse_item，不要画蛇添足self.parse。


设置一个你感兴趣的问题，放入到start_urls列表中，Scrapy会自动在make_requests_from_url方法执行时搜索符合规则的url，当我们执行`scrapy crawl spidernamestart_request`后，程序开始调用start_requests方法，方法将start_urls中的url分别调用make_requests_from_url结束。如果我们不是直接就开始对start_url中的url进行解析，可以重写start_requests，并指定requests的回调函数。

做完这些之后，我们就可以仅仅处理item解析的相关操作，不用管获取新的url内容，至于爬取的为题是不是我们感兴趣的，就要看知乎的推荐算法怎么养了。

```python
from scrapy.selector import Selector
from scrapy.http import Request
from douban.items import ZhihuItem
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class ZhihuSipder(CrawlSpider) :
	name = "zhihu"
	allowed_domains = ["zhihu.com"]
	start_urls = [
		"https://www.zhihu.com/question/41472220"
	]
	rules = (Rule(LinkExtractor(allow = [r'/question/\d{8}$',r'https://www.zhihu.com/question/\d{8}$' ]), callback = 'parse_item', follow = True),)
	headers = {
	"Accept": "*/*",
	"Accept-Encoding": "gzip,deflate",
	"Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
	"Connection": "keep-alive",
	"Content-Type":" application/x-www-form-urlencoded; charset=UTF-8",
	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
	"Referer": "http://www.zhihu.com/"
	}


	def parse_item(self, response):
		problem = Selector(response)
		item = ZhihuItem()
		item['url'] = response.url
		item['name'] = problem.xpath('//span[@class="name"]/text()').extract()
		item['title'] = problem.xpath('//span[@class="zm-editable-content"]/text()').extract()
		item['description'] = problem.xpath('//div[@class="zm-editable-content"]/text()').extract()
		item['answer']= problem.xpath('//div[@class="zm-editable-content clearfix"]/text()').extract()
		return item
```

# 登陆模拟ajax爬取主页 #

这种方法对于我们来讲可能更加准确，因为他是在zhihu.com主页显示的我们关注过的问题新高票答案，以及关注的领域专栏专栏文章。

由于是一直在`www.zhihu.com`页面是操作，没有爬取其他页面，所以在使用CrawlSpider类就不太合适了。直接使用原始的scrapy.spider类。

关于知乎的登录，可以参考文章[简书-模拟登陆](http://www.jianshu.com/p/b7f41df6202d)

当然上面文章因为时间较早，zhihu的登录模块已经改了一些东西，但是具体的思路和流程还是可以继续用的。

```python
#重写 start_requests方法，登录登录面，注意登录界面与旧版不同
def start_requests(self):
	return [Request("https://www.zhihu.com/#signin", meta = {'cookiejar' : 1}, callback = self.post_login)]

#处理知乎防爬虫_xsrf字段 ，使用formRequest发送post信息，注意form的提交url与旧版的不同
def post_login(self, response):
	print('Preparing login')
	#下面这句话用于抓取请求网页后返回网页中的_xsrf字段的文字, 用于成功提交表单
	self.xsrf = Selector(response).xpath('//input[@name="_xsrf"]/@value').extract()[0]
    #FormRequeset.from_response是Scrapy提供的一个函数, 用于post表单
    #登陆成功后, 会调用after_login回调函数
	return [FormRequest(url="https://www.zhihu.com/login/email",
						meta = {'cookiejar' : response.meta['cookiejar']},
						formdata = {
						'_xsrf': self.xsrf,
						'email': '******',
						'password': '******',
						'remember_me': 'true'
						},
						headers=self.headers,
						callback = self.after_login,
						dont_filter = True
						)]

def after_login(self, response):
	#这里注意在header中加入两个字段
	self.headers['X-Xsrftoken']=self.xsrf
	self.headers['X-Requested-With']="XMLHttpRequest"
	return Request('https://www.zhihu.com',meta = {'cookiejar' : response.meta['cookiejar']}, callback =self.parse,dont_filter = True)
```


此时我们可以抓取zhihu首次返回的大概10个问题信息，更多的信息需要下拉鼠标ajax发送请求才会返回。


我们通过珠宝工具找到相应的post信息，模拟操作：

```python
FormRequest(url="https://www.zhihu.com/node/TopStory2FeedList",
							meta = {'cookiejar' : response.meta['cookiejar']},
							formdata = {
							'params': '{"offset":%d,"start":%s}' % (self.count*10,str(self.count*10-1)),
							'method': 'next',
							},
							headers=self.headers,
							callback = self.parse,
							dont_filter = True
							)
```

依然通过FormRequest提交Post信息，注意formdata的params键值为dict，要加上括号，原因可以在前一篇文章中找到答案。offset是获取的问题数目，start是新获取问题的index

刚开始请求时一直提示Bad Request信息，最后发现一定要在header中设置之前获取的_xsrf。

服务器端根据我们的params字段返回不同的bytes形式json数据，我们需要拿到里面的摸个键值，所以要将bytes解码为utf-8，拿到之后在编码为utf-8，因为response只处理bytes形式。

最后，因为response使用xpath方法是对response.text属性操作，当我们获取新的response之后就无法再改变response.text（在python中使用`@property`标注的属性无法更改）但是我们可以通过response内置的response._set_body()方法修改response的body值，不能使用内置的xpath方法，就改用原始的lxml模块提供的xpath工具，毕竟scrapy内置的xpath底层也是使用lxml模块提供支持，大同小异。其他的一些问题就比较小了，不在这里一一讲：

```python
from scrapy.http import Request, FormRequest
from douban.items import ZhihuAnswerItem
import scrapy,json,re
from lxml import etree

class ZhihuSipder(scrapy.Spider) :
	name = "zhihuanswer"
	#allowed_domains = ["zhihu.com"]
	start_urls = [
		"https://www.zhihu.com"
	]
	headers = {
	......
	}

	xsrf=""
	moreinfo=False
	count=0

	def start_requests(self):
		return [Request("https://www.zhihu.com/#signin", meta = {'cookiejar' : 1}, callback = self.post_login)]


	def post_login(self, response):
		print('Preparing login')
		self.xsrf = Selector(response).xpath('//input[@name="_xsrf"]/@value').extract()[0]
		print(self.xsrf)
        #FormRequeset.from_response是Scrapy提供的一个函数, 用于post表单
        #登陆成功后, 会调用after_login回调函数
		return [FormRequest(url="https://www.zhihu.com/login/email",
							meta = {'cookiejar' : response.meta['cookiejar']},
							formdata = {
							'_xsrf': self.xsrf,
							'email': '******',
							'password': '******',
							'remember_me': 'true'
							},
							headers=self.headers,
							callback = self.after_login,
							dont_filter = True
							)]

	def after_login(self, response):
		print(response.body)
		self.headers['X-Xsrftoken']=self.xsrf
		self.headers['X-Requested-With']="XMLHttpRequest"
		return Request('https://www.zhihu.com',meta = {'cookiejar' : response.meta['cookiejar']}, callback =self.parse,dont_filter = True)

	def parse(self, response):
		if self.moreinfo:
			#使用模拟ajax发送post请求接受的response  编码抓换解析相关  
			f=json.loads(response.body.decode('utf-8'))
			for item in range(1,len(f['msg'])-1):
				f['msg'][0]=f['msg'][0]+f['msg'][item]
			fs=f['msg'][0].encode('utf-8')
			response._set_body(fs)
		else:
			self.moreinfo=True
		html=etree.HTML(response.body.decode('utf-8'),parser=etree.HTMLParser(encoding='utf-8'))
		for p in html.xpath('//div[@class="feed-main"]'):
			url=p.xpath('div[2]/h2[@class="feed-title"]/a/@href')
			if url:url=url[0]
			# 通过决定是否使用if not re.findall('zhuanlan',url) 接受专栏文章或者问题回答，或者删掉这部分，全部接受
			if re.findall('zhuanlan',url):continue
			item = ZhihuAnswerItem()
			item['url'] = url
			name=p.xpath('div[2]/div[@class="expandable entry-body"]/div[@class="zm-item-answer-author-info"]/span/span/a/text()')
			item['name'] = name if name else '匿名用户'
			item['question'] = p.xpath('div[2]/h2[@class="feed-title"]/a/text()')
			item['answer']= p.xpath('div[2]/div[@class="expandable entry-body"]/div[@class="zm-item-rich-text expandable js-collapse-body"]/div[@class="zh-summary summary clearfix"]/text()')
			yield item
		
		#维持不同的params
		self.count=self.count+1
		yield FormRequest(url="https://www.zhihu.com/node/TopStory2FeedList",
							meta = {'cookiejar' : response.meta['cookiejar']},
							formdata = {
							'params': '{"offset":%d,"start":%s}' % (self.count*10,str(self.count*10-1)),
							'method': 'next',
							},
							headers=self.headers,
							callback = self.parse,
							dont_filter = True
							)
```