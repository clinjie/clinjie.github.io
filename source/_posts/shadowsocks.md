title: 科学上网
date: 2015-12-23 16:36:28
toc: true
tags: 
- 网络
categories: 网络
---
# shadowsocks #

----------

Shadowsocks（中文名称：影梭）是一个安全的socks5代理，用于保护网络流量，是一个开源项目。通过客户端以指定的密码、加密方式和端口连接服务器，成功连接到服务器后，客户端在用户的电脑上构建一个本地socks5代理。使用时将流量分到本地socks5代理，客户端将自动加密并转发流量到服务器，服务器以同样的加密方式将流量回传给客户端，以此实现代理上网。

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_ss.jpg)

<!--more-->

使用ss可以达到正常的科学上网，但是有些特殊情况下，比如gfw导致的DNS污染（wiki中文），或者是普遍的非浏览器客户端需要使用境外信息，你依然无法正常获取。这里就介绍使用Proxifier设置ss全局代理。

首先是shadowsocks的使用

----------
## STEP1 ##

下载SHADOWSOCKS软件:

网盘[点击此处下载](http://pan.baidu.com/s/1c05CZT2)

或者github[ss网站](https://shadowsocks.org/en/download/clients.html)浏览下载

## STEP2 ##

解压到任意目录，运行其中的SHADOWSOCKS.EXE

## STEP3 ##

首次运行，会弹出编辑服务器窗口，按图示填写您的SHADOWSOCKS服务器地址，端口，密码和加密方式，点确定

![](http://www.ishadowsocks.com/img/tutorials/windows_shadowsocks_02.png)  

这里我提供一些免费的ss账号共享  

- [http://yomoe.net/](http://yomoe.net/ "Yomoe共享")在这里注册账号，即可无流量限制获取ss账号，还能够通过ss提供的扫码功能直接获取服务

- [http://www.ishadowsocks.com/](http://www.ishadowsocks.com/ "ishadowsocks")直接提供服务器账号密码使用，但是会隔6小时更换密码

如果以上的几种获取方式失效，请联系笔者获取。

## STEP4 ##

按提示右键程序图标，弹出菜单，勾选“启用系统代理”

![](http://www.ishadowsocks.com/img/tutorials/windows_shadowsocks_04.png)

好了，大功告成，打开任意浏览器上网吧，就是这么简单，就是这么任性

设置好以后，IE/Chrome/Firefox无需设置，直接打开网址即可

![](http://www.ishadowsocks.com/img/tutorials/windows_shadowsocks_05.png)

Tips:PAC和全局模式是什么意思？PAC模式访问国内网站不通过服务器，全局模式所有网站都通过服务器


# 使用Proxifier全局代理 #
----------

shadowsocks代理属于socks5代理，通俗的理解，socks5只是局部代理，不能像vpn那样把整个电脑都代理。因此，一般情况下只有支持socks5的软件才能使用shadowsocks代理。

我们使用的IE浏览器就不支持socks5代理，一般的游戏，也不支持socks5代理，那么这些软件如何使用代理？除了使用vpn，我们还有一种不错的办法，那就是把socks5代理转换成全局代理，效果跟vpn几乎一样。

使用Proxifier把shadowsocks代理转全局代理，不建议小白使用，无基础的话会很纠结。

[Proxifier下载地址](http://6.xp510.com:801/xp2011/Proxifier.rar)

软件安装以后，即可运行。

首次使用，需要做一番设置才能用。

首先要设置代理服务器。

菜单栏–>>配置文件–>>代理服务器，服务器地址填127.0.0.1，ss软件的端口填是什么就填什么。

严重强调一下，这里的端口是本地端口，不是远程服务器端口，ss的默认端口是1080，注意别搞错。

下面的“协议”选择socks版本5。

然后会弹出窗口，点“是”，然后狂点确定即可。

![](http://www.dingziblog.com/wp-content/uploads/2015/05/%E4%BB%A3%E7%90%86%E9%85%8D%E7%BD%AE.jpg)

代理配置

此时还不能用，两点非常重要的设置！，请睁大眼睛看…

## ※1.开启远程dns解析 ##

菜单栏–>>配置文件–>>名称解析–>>勾选“通过代理解析主机名称”

如果不开启远程dns解析，你将会尽情享受到已被污染的dns解析，导致无法打开Facebook之类的网站。

如果你是游戏玩家，建议不要开启远程dns解析，你可以自己设置适合游戏服务器的dns，比如台服魔兽可以设置台湾dns。

![](http://www.dingziblog.com/wp-content/uploads/2015/05/%E4%BB%A3%E7%90%86%E9%85%8D%E7%BD%AE2.jpg)

代理配置2

## ※2.把ssh或shadowsocks端口添加到直连名单 ##

这点最重要，很多人卡在这里。如果不设置这个规则，你必定会陷入死循环。

我们需要把ssh或shadowsocks服务器端口（具体端口号以你的账号为准,也就是远程端口了  这次不是本地端口哦  比如ssh常见的端口是22），添加到直连名单中，不让他们走代理。具体方法：

菜单栏–>>配置文件–>>代理规则–>>点击“添加”–>>在“目标端口”里面添加端口，然后下面的动作选择“direct”，然后点确定。

![](http://www.dingziblog.com/wp-content/uploads/2015/05/%E4%BB%A3%E7%90%86%E9%85%8D%E7%BD%AE3.jpg)
 
 
一定要注意以上两点，否则真心无法正常使用。

Proxifier设置好以后，就可以打开ssh或shadowsocks客户端并登录了。此时，默认所有程序的网络都会走代理，百度里查ip，必定会是代理的ip。

![](http://www.dingziblog.com/wp-content/uploads/2015/05/ok.jpg)

ok如果还上不去youtube，极有可能是因为有dns缓存，清除dns缓存和清空浏览器缓存即可。