title: Selenium模拟选课
date: 2016-09-13 22:23:35
tags: Python
toc: true
categories: Python 
---

使用selenium+python实现无人看守选课。

# 用到的一些模块 #

- selenium

selenium在前面的文章中曾经介绍过，就是模拟浏览器的一个第三方模块，通过提供的各种方法模拟控制browser，同时提供了无UI的Browserdriver，减少渲染开销，提升运行速度.

- time

本例中实现暂停扫描功能，防止服务器对IP封锁

- re

正则表达模块，获取相关数据
<!--more-->

# 常用的方法 #

- b=webdriver.PhantomJS()

开启Selenium的一个webdriver实例，这里使用的是无UI的PhantomJS，通过它进行对browser的操作

- b.get(url)

url是我们想要request的网络地址，get方法实际上就是我们在browser中地址栏填入url并回车访问的过程


- find_element_by_xpath

一系列的find_element_by方法，通过各种定位方法（Xpath、css-seletor、id、tagname）拿到需要操纵的元素句柄


- element.send_keys(value)

在input或者其他可输入标签元素中填入keyword，在使用这个方法之前，建议使用element.clear()清楚之前的所有信息，因为send_keys()方法是直接在后面append

- element.get_attribute(attr)

获取元素的属性值，例如href、onclick


- b.page_source

获取当前driver停留页面的源网页代码


- re.findall(pattern,str)

re正则过滤，pattern是模式串，根据正则规则编写的模式串，str是原始串，也就是需要匹配的串


# 实现 #

```python
from selenium import webdriver
import time
import re
cc=webdriver.PhantomJS()
#身份认证，一次运行只需要运行一次
cc.get('http://auth.bupt.edu.cn/authserver/login?service=http%3a%2f%2fyjxt.bupt.edu.cn%2fULogin.aspx')
uname=cc.find_element_by_xpath('//*[@id="username"]')
uname.clear()
uname.send_keys('*********')
passwd=cc.find_element_by_xpath('//*[@id="password"]')
passwd.clear()
passwd.send_keys('*********')
cc.find_element_by_xpath('//*[@id="casLoginForm"]/input[4]').click()
xuankeurl='http://yjxt.bupt.edu.cn/Gstudent/Course/PlanCourseOnlineSel.aspx?EID=9kWb0OKGTBF2KzmBt5QNDZLXYu1Fldi6xwxV6Yb1wPA1TrsnKBRXgg==&UID=2016111552'
delaylist=[u'班级已全选满',u'选课未开放',u'选课已结束']
cc.get(xuankeurl)
wantedcourse=cc.find_element_by_xpath('//*[@id="contentParent_dgData_hykFull_42"]')
restr=wantedcourse.get_attribute('onclick')
jumpurl=(re.findall("classFull\('\?(.+)','classFull'\);",restr))[0]
while True:
    cc.get(xuankeurl)
    wantedcourse=cc.find_element_by_xpath('//*[@id="contentParent_dgData_hykFull_42"]')
    if wantedcourse.text in delaylist:
        print(wantedcourse.text)
        time.sleep(5)
        pass
    else :
        cc.get('http://yjxt.bupt.edu.cn/Gstudent/Course/PlanClassSelFull.aspx?'+jumpurl)
        print(cc.page_source)
        break;
```