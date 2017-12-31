title: Ngroke
date: 2016-06-29 22:24:06
tags:
- 网络
categories: 网络
---

>ngrok 是一个反向代理，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。ngrok 可捕获和分析所有通道上的流量，便于后期分析和重放


为了方便本地服务器简单映射到外网访问，我们可以使用Ngroke服务。只需要几条简单的命令即可使用。


- [国内ngrok服务](http://www.ngrok.cc/)

点击进入获取相应平台的最新版本

- [注册/登录](http://www.ngrok.cc/index.php/login/index.html)
<!--more-->
- [添加隧道列表](http://www.ngrok.cc/index.php/Tunnel/index.html)

将本地服务器地址、端口号与Ngroke分配的服务器绑定。本地地址： `127.0.0.1`

- [隧道状态页面](http://www.ngrok.cc/index.php/Tunnel/index.html)

添加映射隧道之后，在隧道状态页面获取Ngroke服务器提供的客户端Id。

- 解压网站提供的客户端压缩包，执行.bat程序

- 打开本机的服务器容器，并在如`webapps\ROOT`目录下放入文件，或者`webapps`目录下放入Web工程

- 在Ngroke客户端.bat中提供客户端Id，开启映射服务。  