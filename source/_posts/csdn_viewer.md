title: CSDN访问量作弊器
date: 2016-2-3 15:28:30
toc: true
tags:
- python
- urllib
- BeautifulSoup
categories: python
---
![](http://7xowaa.com1.z0.glb.clouddn.com/csdn_content.jpg)

# 前言 #
前些天在逛论坛的时候突然发现了一篇文章，标题是通过编程自动化提高自己博客访问量的。我想了下，突然感觉可以用学过的Python的简单知识来实现这一目的。主要原理就是BeautifulSoup+urllib的组合,通过BS解析网页，获取目录，然后深入，获取文章的url，通过urllib.request模块尝试连接CSDN的服务器。说干就干


<!--more-->

# 脚本实现 #
```
from bs4 import BeautifulSoup

import urllib.request
import urllib.parse
import sys
import time


#运行过程中的日志函数
def LOG(*argv):
    sys.stderr.write(*argv)
    sys.stderr.write('\n')

class Grab():
    url = ''
    soup = None

    #读取当前网页的源代码数据返回
    def GetPage(self, url):
        self.url = url
        LOG('input url is: %s' % self.url)
        req = urllib.request.Request(url, headers={'User-Agent' : "Magic Browser"})
        try:
            page = urllib.request.urlopen(req)
        except:
            return
        tem = page.read()
        if not tem:
            print('GetPage failed!')
            sys.exit()
        return tem

	#获取目录页面下的文章url集合
    def ExtractInfo(self,buf):
        try:
            self.soup = BeautifulSoup(buf,'html.parser')
        except:
            LOG('soup failed in ExtractInfo :%s' % self.url)
            return
        try:
			#通过BS模块可以很方便的获取想要的信息
            items = self.soup.findAll(attrs={'class':'link_title'})
        except:
            LOG('failed on find items:%s' % self.url)
            return
        links = []
        for item in items:
            linkobj = item.findAll('a')
            for it in linkobj:
                link = it['href']
                links.append(link)
        return links

	#获取所有文章的目录页面url集合
    def GetPageUrl(self,buf):
        pages = set()
        self.soup = BeautifulSoup(buf,'html.parser')
        pageInfo=self.soup.find(attrs={'id':'papelist'})
        #如果当前文章数量只有一页
        if not pageInfo:
            return None
        pagelinks = pageInfo.findAll('a')
        for link  in pagelinks:
            pages.add('http://blog.csdn.net/'+link['href'])
        return pages

	#获取当前访问文章的访问数、文章标题
    def GetCurViewerPoint(self,buf):
        self.soup = BeautifulSoup(buf,'html.parser')
        pointobj = self.soup.find(attrs={'class':'link_view'})
        title = self.soup.find(attrs={'class':'link_title'})
        return title.get_text().strip()+'  '+pointobj.get_text()

grab = Grab()

#buf是当前页面经过转换之后的网页源代码
buf = grab.GetPage('http://blog.csdn.net/peihaozhu')

#pages中存放的是目录页面url集合
pages = ['http://blog.csdn.net/peihaozhu',]

#先从入口进入，如果文章数量不够，文章的目录页面只有一页
tem = grab.GetPageUrl(buf)
if not tem:
    pass
else:
    pages+=tem

#articles中存放所有的文章url集合
articles=set()

for page in pages:
    buf = grab.GetPage(page)
    links = grab.ExtractInfo(buf)
    for url in links:
        articles.add('http://blog.csdn.net/'+url)

#通过url.request访问文章
for url in articles:
    for i in range(1,11):
        buf=grab.GetPage(url)
        print('第'+str(i)+'次访问   '+grab.GetCurViewerPoint(buf))
		#每次访问之后停歇300ms
        time.sleep(0.3)
```

# UI实现 #

用PyQt5将程序的大致控件摆放完成了：
![](http://7xowaa.com1.z0.glb.clouddn.com/pyqt5_csdn1.jpg)
将pyqt生成的ui文件直接通过命令生成.py文件
```
pyuic5.bat -o layout.py untitled.ui

#代码如下
# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'untitled.ui'
#
# Created by: PyQt5 UI code generator 5.5.1
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        self.label = QtWidgets.QLabel(Form)
        self.label.setGeometry(QtCore.QRect(20, 30, 81, 21))
        self.label.setObjectName("label")
        self.username = QtWidgets.QPlainTextEdit(Form)
        self.username.setGeometry(QtCore.QRect(110, 20, 341, 41))
        self.username.setObjectName("username")
        self.label_2 = QtWidgets.QLabel(Form)
        self.label_2.setGeometry(QtCore.QRect(30, 80, 61, 31))
        self.label_2.setObjectName("label_2")
        self.times = QtWidgets.QPlainTextEdit(Form)
        self.times.setGeometry(QtCore.QRect(110, 80, 151, 41))
        self.times.setObjectName("times")
        self.beginBtn = QtWidgets.QPushButton(Form)
        self.beginBtn.setGeometry(QtCore.QRect(300, 80, 61, 41))
        self.beginBtn.setObjectName("beginBtn")
        self.progressBar = QtWidgets.QProgressBar(Form)
        self.progressBar.setGeometry(QtCore.QRect(30, 350, 461, 41))
        self.progressBar.setProperty("value", 24)
        self.progressBar.setObjectName("progressBar")
        self.listView = QtWidgets.QListView(Form)
        self.listView.setGeometry(QtCore.QRect(30, 180, 431, 151))
        self.listView.setObjectName("listView")
        self.info = QtWidgets.QLabel(Form)
        self.info.setGeometry(QtCore.QRect(30, 140, 421, 31))
        self.info.setText("")
        self.info.setObjectName("info")
        self.exitBtn = QtWidgets.QPushButton(Form)
        self.exitBtn.setGeometry(QtCore.QRect(390, 80, 61, 41))
        self.exitBtn.setObjectName("exitBtn")

        self.retranslateUi(Form)
        self.exitBtn.clicked.connect(Form.close)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.label.setText(_translate("Form", " CSDN用户名"))
        self.label_2.setText(_translate("Form", "设置次数"))
        self.beginBtn.setText(_translate("Form", "Start"))
        self.exitBtn.setText(_translate("Form", "Exit"))

```

# UI、逻辑处理 #

**遇到的一些问题**

在这次编写GUI的过程中，我遇到了原来没有的问题。    

以往的时候，如上篇文章，通过Python的QR模块生成QR二维码，因为逻辑非常简单，只是单纯的将所需要转换的数据变换成为相应的0、1二进制码，然后放到图片中的相应位置上，所以不会花费太多的时间，逻辑部分与界面部分就直接写在了一起没有问题。    

这次刚开始的时候，我也没注意，直接就还是写在一块，由于牵扯到了url网络连接部分，所以不可避免的出现了阻塞现象。几乎在所有的GUI设计中，如果当长时间出现阻塞、无状态回应情况，都会出现界面的未响应状态，所以我想到了在Android开发中相当常规的子线程与UI线程通信，Handler的使用，在PyQt中也有类似的机制，也就是Qt的核心机制，信号槽机制，更多的内容可以看我另外的文章，我会详细的介绍下。    

下面是我修改完成后的代码，可以顺利完成我预设的功能：

```
import urllib.request
import urllib.parse
import time
from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtCore import pyqtSignal
from bs4 import BeautifulSoup

#抓取网页的类
class Grab():
    url = ''
    soup = None
    #读取当前网页的源代码数据返回
    def GetPage(self, url):
        self.url = url
        req = urllib.request.Request(url, headers={'User-Agent' : "Magic Browser"})
        try:page = urllib.request.urlopen(req)
        except:return
        tem = page.read()
        if not tem:
            print('GetPage failed!')
            sys.exit()
        return tem

    def ExtractInfo(self,buf):
        try:
            from bs4 import BeautifulSoup
            self.soup = BeautifulSoup(buf,'html.parser')
        except:return
        try:items = self.soup.findAll(attrs={'class':'link_title'})
        except:return
        links = []
        titles = []
        for item in items:
            title = item.get_text().strip()
            titles.append(title)
            linkobj = item.findAll('a')
            for it in linkobj:
                link = it['href']
                links.append('http://blog.csdn.net'+link)
        return links,titles

    def GetPageUrl(self,buf):
        pages = set()
        self.soup = BeautifulSoup(buf,'html.parser')
        pageInfo=self.soup.find(attrs={'id':'papelist'})
        #当前文章数量只有一页
        if not pageInfo:
            return None
        pagelinks = pageInfo.findAll('a')
        for link  in pagelinks:
            pages.add('http://blog.csdn.net/'+link['href'])
        return pages

    def GetCurViewerPoint(self,buf):
        self.soup = BeautifulSoup(buf,'html.parser')
        pointobj = self.soup.find(attrs={'class':'link_view'})
        title = self.soup.find(attrs={'class':'link_title'})
        return title.get_text().strip()+'  '+pointobj.get_text()



#界面类
class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        self.label = QtWidgets.QLabel(Form)
        self.label.setGeometry(QtCore.QRect(20, 30, 81, 21))
        self.label.setObjectName("label")
        self.username = QtWidgets.QPlainTextEdit(Form)
        self.username.setGeometry(QtCore.QRect(110, 20, 341, 41))
        self.username.setObjectName("username")
        self.label_2 = QtWidgets.QLabel(Form)
        self.label_2.setGeometry(QtCore.QRect(30, 80, 61, 31))
        self.label_2.setObjectName("label_2")
        self.times = QtWidgets.QPlainTextEdit(Form)
        self.times.setGeometry(QtCore.QRect(110, 80, 151, 41))
        self.times.setObjectName("times")
        self.beginBtn = QtWidgets.QPushButton(Form)
        self.beginBtn.setGeometry(QtCore.QRect(300, 80, 61, 41))
        self.beginBtn.setObjectName("beginBtn")
        self.progressBar = QtWidgets.QProgressBar(Form)
        self.progressBar.setGeometry(QtCore.QRect(30, 350, 461, 41))
        self.progressBar.setProperty("value", 0)
        self.progressBar.setObjectName("progressBar")
        self.listWidget = QtWidgets.QListWidget(Form)
        self.listWidget.setGeometry(QtCore.QRect(30, 180, 431, 151))
        self.listWidget.setObjectName("listWidget")
        self.info = QtWidgets.QLabel(Form)
        self.info.setGeometry(QtCore.QRect(30, 140, 421, 31))
        self.info.setText("")
        self.info.setObjectName("info")
        self.exitBtn = QtWidgets.QPushButton(Form)
        self.exitBtn.setGeometry(QtCore.QRect(390, 80, 61, 41))
        self.exitBtn.setObjectName("exitBtn")

        self.thread=MyThread()
        self.thread.sinOut.connect(self.handler)

        self.retranslateUi(Form)
        self.exitBtn.clicked.connect(Form.close)
        self.beginBtn.pressed.connect(self.mainFunc)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def handler(self,type,text,content):
        if type == 1:
            self.listWidget.addItems(content)
        elif type == 2:
            self.progressBar.setProperty("value", float(text))
        elif type == 3:
            self.info.setText(text)


    def mainFunc(self):
        username = self.username.toPlainText().strip()
        times = self.times.toPlainText().strip()
        if username and times:
            self.thread.setVal(username,times)
            self.thread.start()

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Blog作弊器"))
        self.label.setText(_translate("Form", " CSDN用户名"))
        self.label_2.setText(_translate("Form", "设置次数"))
        self.beginBtn.setText(_translate("Form", "Start"))
        self.exitBtn.setText(_translate("Form", "Exit"))


#子线程
class MyThread(QtCore.QThread):
    sinOut = pyqtSignal(int,str,set)
    articles = set()
    def __init__(self):
        super(MyThread,self).__init__()
        self.username=''
        self.times=''

    def setVal(self,username,times):
        self.username=username
        self.times=times

    def run(self):
        #发射信号
        grab = Grab()
        buf = grab.GetPage('http://blog.csdn.net/'+self.username)
        pages = ['http://blog.csdn.net/'+self.username,]
        tem = grab.GetPageUrl(buf)
        content = set()
        links = []
        titles = []
        if not tem:pass
        else: pages+=tem
        for page in pages:
            buf = grab.GetPage(page)
            link,title = grab.ExtractInfo(buf)
            links+=link
            titles+=title
        titles=zip(links,titles)
        for link in links:
            self.articles.add(link)
        for title in titles:
            tem = ''
            for val in title:
                tem+=val+' '
            content.add(tem)

        self.sinOut.emit(1,'',content)
        sumRes = len(self.articles)*int(self.times)
        cur = 1
        for url in self.articles:
            for i in range(0,int(self.times)):
                buf=grab.GetPage(url)
                self.sinOut.emit(2,str(cur/sumRes*100),content)
                self.sinOut.emit(3,grab.GetCurViewerPoint(buf),content)
                cur+=1
                time.sleep(0.1)


if __name__=='__main__':
    import sys
    app=QtWidgets.QApplication(sys.argv)
    widget=QtWidgets.QWidget()
    ui=Ui_Form()
    ui.setupUi(widget)
    widget.show()
    sys.exit(app.exec_())
```

# 总结 #

由于使用了designer默认的绝对布局方式，代码比较杂乱。总的来说也就分3个模块：

1. 网页获取、解析工作类  Grab

2. 界面布局、实时数据展现类  Ui_Form

3. 逻辑控制、监控与沟通类  MyThread  

各个模块相互合作，实现功能.

![](http://7xowaa.com1.z0.glb.clouddn.com/pyqt_csdn2.jpg)
