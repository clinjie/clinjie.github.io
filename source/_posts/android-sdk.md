title: Android Sdk获取更新
date: 2016-04-21 17:17:22
tags: android
toc: true
categories: android
---

![](http://7xowaa.com1.z0.glb.clouddn.com/hei-131.jpg?imageView/2/w/610/q/100)

最近好多朋友、同学陆陆续续开始了他们的毕设阶段，得益于国内蓬勃爆炸发展的移动终端产业，有相当一部分小伙伴们的课题都是基于android platform这个世界占比最大的开源移动操作系统app开发。他们也陆陆续续遇到了新的问题。
  
恰好我曾经作为初学者遇到过相同的问题，我将这些问题记录下来，希望可以分享我的知识、经验与见解。

<!--more-->

# Android SDK更新 #

由于国内Google的IP受到GFW限制，所以无法通过唱过方法直接获取sdk更新，一般有两种办法。

## Android SDK在线更新镜像服务器 ##

可以通过国内或者准许服务器的镜像获取更新，常用稳定的镜像有下面：

- 南阳理工学院镜像服务器地址:

`mirror.nyist.edu.cn 端口：80`

- 中国科学院开源协会镜像站地址:

```
IPV4/IPV6: mirrors.opencas.cn 端口：80

IPV4/IPV6: mirrors.opencas.org 端口：80

IPV4/IPV6: mirrors.opencas.ac.cn 端口：80
```

- 上海GDG镜像服务器地址:

`sdk.gdgshanghai.com 端口：8000`

- 北京化工大学镜像服务器地址:

```
IPv4: ubuntu.buct.edu.cn/ 端口：80

IPv4: ubuntu.buct.cn/ 端口：80

IPv6: ubuntu.buct6.edu.cn/ 端口：80
```

- 大连东软信息学院镜像服务器地址:

`mirrors.neusoft.edu.cn 端口：80`

- 腾讯Bugly 镜像:

`android-mirror.bugly.qq.com 端口：8080`

tips:

腾讯镜像使用方法:http://android-mirror.bugly.qq.com:8080/include/usage.html

温馨提示，注意选择合适的版本更新~
----------
## 使用方法 ##

- 启动 Android SDK Manager ，打开主界面，依次选择『Tools』、『Options...』，弹出『Android SDK Manager - Settings』窗口；

- 在『Android SDK Manager - Settings』窗口中，在『HTTP Proxy Server』和『HTTP Proxy Port』输入框内填入上面镜像服务器地址(不包含http://，如下图)和端口，并且选中『Force https://... sources to be fetched using http://...』复选框。设置完成后单击『Close』按钮关闭『Android SDK Manager - Settings』窗口返回到主界面；

- 依次选择『Packages』、『Reload』。

![](http://www.androiddevtools.cn/static/image/sdk-manager-proxy-settings.png)

## 直接下载离线包 ##

一种更轻松的方法就是下载正确版本的离线包，首先明确开发的程序在哪一个Level（可以直接换算成android版本，如4.4、5.1），下载对应的文件，复制到本地`sdk manager`设置的目录位置。

![](http://7xowaa.com1.z0.glb.clouddn.com/android-local-sdk.png)

## 直接下载带sdk的IDE ##

Google公司官方推出的Android平台开发环境Android Studio是一款相当棒的开发软件，我平时使用的开发环境就是AS，相比Eclipse，他可以显著提高我的工作效率、学习进程。同时，因为Google已经宣布了不再对Eclipse进行Plugins更新维护，AS将会是以后的Android开发趋势。

这里直接提供当前最新的一次稳定版更新：

[Win平台AS2.0稳定版   戳我](http://pan.baidu.com/s/1cHlqma#path=%252FAndroid%252FDeveloper%2520Tools%252FWindows%252FAndroid%2520Studio%252F2.0%25E6%25AD%25A3%25E5%25BC%258F%25E7%2589%2588)

AS的一次Relase包括两种形式：

- 带最新SDK版本

- 纯IDE

想要使用最新的SDK可以下载附带最新SDK的IDE.

# 一些你会用到的Docs #

- Android Api中文版

[Android Api-zh](http://www.embeddedlinux.org.cn/androidapi/)

- Android API指南中文版

[Gudie-zh](http://api.apkbus.com/guide/)

