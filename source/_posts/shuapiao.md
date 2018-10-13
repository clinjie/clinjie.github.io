title: 多线程刷票
date: 2016-07-07 22:24:06
tags:
- python
- 多线程
categories: python
---

# 需求 #

最近突然有朋友对投票刷票有需求，正好自己空了下来，就帮他写了个简单的多线程投票脚本。因为不想考虑过多的session、cookie以及post data，所以直接使用了自动化工具[Selenium](http://peihao.space/2016/02/27/selenium/)


简单地说，Selenium就是一个通过执行预先设置的Browser的指令，解放双手，提高工作效率。


不同于通用的流行python网络模块，Selenium更像是市面上流行的按键精灵类似的软件，通过设定特定的工作流程，保证任务的完成。任务的实际执行者是Browser本身。

Selenium对网页的request、response、解析等操作都是另外的伪浏览器进程执行，然后将获取的数据返回。而传统的python网络模块则通过python进程，对网页请求、回应。显然网络模块会更加高效，而对于普通人，Selenium的操作更加直观。

<!--more-->

```html

    	<div class="tit"><span class="r">总票数：<strong>xxxxxx</strong></span><h5>标题: 201x年x月份优秀论文评选投票</h5></div>
        <div class="c_box wrap">
		<input type="hidden" name="subjectid" value="7">
        <table width="100%" border="1" cellspacing="0" cellpadding="0" class="tp">
       	       	             <tr>
             	<th>1</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="186"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>******</font> 票</td>
             </tr>
               	             <tr>
             	<th>2</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="187"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>3</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="188"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>4</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="189"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>5</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="190"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>6</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="191"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>7</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="192"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>8</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="193"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>9</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="194"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
               	             <tr>
             	<th>10</th>
               <td class="tp_tit"><input type="checkbox" name="radio[]" id="radio" value="195"  /></td>
               <td class="ls">*********</td>
               <td class="tdcol3"><font color=red>*********</font> 票</td>
             </tr>
        </table>
        
        </div>
    </div>
```


# 分析 #

如上代码所示，在本次投票中，所有的候选人名单都包含在`checkbox`。我们首先在Selenium中使用Browser Driver定位到需要选中的某个或某几个`checkbox`，然后将这些`checkbox`选中。

与以前不同的是，投票网页的`checkbox`的`input`标签中，`id`、`name`属性都是完全一致的。所以无法通过简单的`ById`或`ByName`直接定位。

之后通过绝对地址的次序依次抽丝剥茧获取Xpath,调试出错，不知道什么问题>GG<。然后就发现了input标签中的`value`属性每个值都不一样。

例如获取第10个input元素的Xpath`//input[@value="195"]`


剩下的问题就水到渠成了。放上代码：

# 实现 #

## Selenium实现 ##

```python
from selenium import webdriver

def func(args):
    c = webdriver.PhantomJS() # Get local session of PhantomJS
    c.get("http://www.hiahiahia.com.cn/index.php?m=vote&c=index&a=show&show_type=1&subjectid=7&siteid") # Load page
    ele=c.find_element_by_xpath('//input[@value="195"]')
    ele.click()
    print('开始刷票，次序：'+args)
    submit=c.find_element_by_xpath('//*[@id="myform"]/div[2]/button')
    submit.click()
```

## 多线程 ##

套上多线程模板：


```python
import threading
threads=[]

for i in range(0,20):
    t=threading.Thread(target=func,args={str(i)})
    threads.append(t)

for item in threads:
    item.setDaemon(True)
    item.start()

for item in threads:
    item.join()
```

## requests ##

使用Selenium的效率实在不敢恭维，如果再加上多线程限制，在虚拟机中开大数目的伪浏览器资源，程序很容易崩溃。所以通过抓包之后改成了使用requests模块直接传递数据。


`requests.Session()`类中自动维持cookies、headers、keep-alive等机制，但是在本次测试中，直接使用都无法达到效果，最后发现在初次get页面时，requests.Session不能直接获取维护cookies。所以改成自己封装cookies。代码如下：


```python
session=requests.Session()

headers = {'Content-type': 'application/x-www-form-urlencoded',
           'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 UBrowser/5.6.14087.9 Safari/537.36'
           ,'Accept-Encoding':'gzip, deflate'
           ,'Accept':"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"}
session.headers.update(headers)
m=vote&c=index&a=show&show_type=1&subjectid=7&siteid'
cookies={'logtime':'Yes'
         ,'Hm_lvt_f8de16968aad3ba4868c06590fea9fb5':'1467943093'}
payload = {'radio[]':'193','subjectid':'7'}
url='http://www.zzzzzzz.com.cn/index.php?m=vote&c=index&a=post&subjectid=7&siteid'
dom=requests.post(url,data=payload,cookies=cookies)
session.close()
```
