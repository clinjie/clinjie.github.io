title: Android-drawText
date: 2016-07-24 15:24:06
toc: true
tags:
- android
categories: android
---


# FontMetrics #

FontMetrics是Paint的一个内部类，主要定义了Paint绘图时的一些关键坐标位置，具体如下图

![](http://xyczero.qiniudn.com/Bolg_%E5%A6%82%E4%BD%95%E2%80%9C%E4%BB%BB%E6%80%A7%E2%80%9D%E4%BD%BF%E7%94%A8Android%E7%9A%84drawText%28%29_base.png)

- ascent:该距离是从所绘字符的baseline之上至该字符所绘制的最高点。这个距离是系统推荐。

- descent:该距离是从所绘字符的baseline之下至该字符所绘制的最低点。这个距离是系统推荐的。

- top:该距离是从所绘字符的baseline之上至可绘制区域的最高点。
<!--more-->
- bottom:该距离是从所绘字符的baseline之下至可绘制区域的最低点。

- leading:为文本的线之间添加额外的空间，这是官方文档直译，debug时发现一般都为0.0，该值也是系统推荐的。


特别注意: ascent和top都是负值，而descent和bottom:都是正值

# drawText #

canvas.drawText(String text, float x, float y, Paint paint)中有四个参数，这四个参数都是表示其相对于所在View中的坐标，和屏幕坐标无关

- float x：根据官方API上的解释，该参数表示text被画的起始x坐标。其实text被画的起始位置还与Paint有关，Paint的TextAlign属性决定了text相对于起始坐标x的相对位置。例如，TextAlign的默认属性为Paint.Align.LEFT，这是text就是从起始坐标x的右侧开始画起。

![](http://xyczero.qiniudn.com/Bolg_%E5%A6%82%E4%BD%95%E2%80%9C%E4%BB%BB%E6%80%A7%E2%80%9D%E4%BD%BF%E7%94%A8Android%E7%9A%84drawText%28%29_alignLeft.png)


![](http://xyczero.qiniudn.com/Bolg_%E5%A6%82%E4%BD%95%E2%80%9C%E4%BB%BB%E6%80%A7%E2%80%9D%E4%BD%BF%E7%94%A8Android%E7%9A%84drawText%28%29_alignCenter.png)


- float y： 根据官方API上的解释，该参数表示text被画的起始y坐标。这个解释是比较抽象的，其实起始y坐标所代表是text的baseline在Y轴方向的位置

text的bottom距离：
①bottomY = baseY + fontMetrics.bottom;


text的字体高度：
②fontHeight = fontMetrics.descent- fontMetrics.ascent


因为我们要让text垂直居中，所以此时text的bottom距离应该为：
③bottomY=1/2 * height + 1/2 * fontHeight

所以由上述①②③公式就可以推得：④baseY = 1/2 * height + 1/2 * (fontMetrics.descent- fontMetrics.ascent) - fontmetrics.bottom

此时求得baseline的值，即cavans.drawText()里的y的坐标。