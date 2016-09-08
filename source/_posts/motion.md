title: android中的获取坐标
date: 2016-08-11 22:24:06
toc: true
tags:
- android
categories: android
---

# OnTouchListener #

- `getRawX`()和`getRawY()`

获得的是相对屏幕的位置

- `getX()`和`getY()`

获得的永远是view的触摸位置坐标（这两个值不会超过view的长度和宽度）。

# View #
<!--more-->

- `view.getTranslationX()`

计算的该view的偏移量。初始值为0，向左偏移值为负，向右偏移值为正。


- `view.getX()`

相当于该view左上角距离父容器左边缘的距离，等于`getLeft()`+`getTranslationX()`


# Width/Height #

当获取`view.getWidth()/view.getHeight()`返回值为0时，可能是view控件还未在Activity中准备好，尝试下使用`view.getMeasuredWidth()/view.gwtMeasuredHeight()`