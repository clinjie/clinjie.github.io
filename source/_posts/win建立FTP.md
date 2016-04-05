title: win建立FTP
date: 2016-02-27 13:42:14
toc: true
tags: FTP
categories: 日常  
---

win7系统下利用自带的IIS开启FTP服务，不用关闭防火墙。

# 步骤 #

----------

## 开启FTP服务： ##

1. 控制面板 ->

2. 程序 ->

3. 打开和关闭Windows功能 ->

4. 在弹出的窗口中选择开启FTP功能和ISS管理控制台。

<!--more-->

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185838.png)

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185839.png)

## 新建FTP站点 ##

1. 右键“我的电脑” ->

2. 管理，弹出的“计算机管理”窗口 ->

3. 展开服务和应用程序节点，点选Internet信息服务（IIS）管理器 ->

4. 右键“网站”，选择添加FTP站点。按个人需要填写信息即可。

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185840.png)

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185841.png)

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185943.png)

![](http://www.2cto.com/uploadfile/Collfiles/20140925/2014092509185951.png)

# 设置防火墙 #

1. 在开始菜单中输入 window然后找到windows防火墙，点允许程序或功能通过windows防火墙.

2. 在允许程序通过windows防火墙通信中选择FTP服务器，点击下方的“允许运行另一程序”，在弹出窗口里，点“浏览”，找到C:\Windows\System32\inetsrv\inetinfo.exe，点添加，也就是Internet Infomation Services。将后面的两个框也都选中。因为在Win7下，FTP是IIS的一个组件，因此也必须在防火墙中将IIS设置为允许。而IIS又不在默认的列表中，因此得手动添加。

3. 在windows防火墙中点高级设置，在入站规则中点新建规则，选中端口，点下一步

4. 在然后在特定本地端口中输入21，点下一步

# 登录使用 #

在浏览器中输入建立的FTP服务器地址，比如: `ftp://192.168.1.101 ` 会出现登录框,输入你设置的用户名、密码就可以在浏览器中使用FTP功能。