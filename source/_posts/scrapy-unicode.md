title: Scrapy中关于Export Unicode字符集问题解决
date: 2016-10-28 10:28:30
tags:
- python
- Scrapy
categories: python
---

使用命令行`scrapy crawl spider_name -o filename`将制定内容的item信息输出时，scrapy使用默认的feed export对特定的file类型文件支持，例如json文件是`JsonLinesItemExporter`，xml文件是`XmlItemExporter`，有时候我们对export的形式或者内容不太满意时，可以自己继承上面的类，自定义export子类。

默认显示的中文是阅读性较差的Unicode字符，我们需要在settings文件中定义子类显示出原来的字符集。
<!--more-->
```python
from scrapy.exporters import JsonLinesItemExporter  
class CustomJsonLinesItemExporter(JsonLinesItemExporter):  
    def __init__(self, file, **kwargs):  
        super(CustomJsonLinesItemExporter, self).__init__(file, ensure_ascii=False, **kwargs)

#这里只需要将超类的ensure_ascii属性设置为False即可
#同时要在setting文件中启用新的Exporter类

FEED_EXPORTERS = {  
    'json': 'porject.settings.CustomJsonLinesItemExporter',  
}  
```

之后使用命令行`scrapy crawl spider_name -o filename.json`就可以显示出正常可阅读的字符。

Pipeline在Doc中的定义如下：
>After an item has been scraped by a spider, it is sent to the Item Pipeline which processes it through several components that are executed sequentially


所以我们也可以在Pipeline类中直接定义输出：

```python
from project.settings import CustomJsonLinesItemExporter
class DoubanPipeline(object):
	#定义开始爬虫的行为
	def open_spider(self,spider):
		self.file=open('xxx.json','wb')
		self.exporter=CustomJsonLinesItemExporter(self.file)
		self.exporter.start_exporting()
	#定义爬虫结束的行为
	def close_spider(self,spider):
		self.exporter.finish_exporting()
		self.file.close()
	#定义爬虫过程中的行为
	def process_item(self, item, spider):
		self.exporter.export_item(item)
		return item
```