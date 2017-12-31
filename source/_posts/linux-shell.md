title: linux常用命令
date: 2015-11-22 19:40:22
toc: true
tags: linux
categories: linux
---

# ubuntu #

- 使用超级管理员 su

- 程序管理 apt

程序安装apt-get install xxx

# centos #

- 使用超级管理员 su

- 程序管理 yum

程序安装yum install xxx

程序更新 yum update xxx


# 通用 #

## ln ##

ln创建链接，分为soft链接和hard链接，两种链接生成的链接文件都与其余文件保证统一性，任何的文件改变都会在链接中体现。

`ln -s srcfile destfile`软链接，相当于win平台下的快捷方式，不占用内存，文件内容其实就是源文件的路径，可以对目录链接

`ln  srcfile destfile`硬链接，作为副本存在，类似于win平台下的xxx(1).xx，但是不同的是，在这里虽然是副本，实际上并不占空间，不能对目录进行链接

## 创建文件/目录 ##

- vi filename
- touch filename
- mkdir

## 删除文件 ##

- rm

删除目录 rm -R（递归方式）

# 源码安装 #

linux源码的安装一般有配置（configuration）、编译（make）、安装（make install）三个步骤组成

1. 配置有很多，一般发布者会在index上写上usage

设置安装位置：

- ./configure --prefix=/usr/local --enable-shared

设置安装位置/usr/local 同时编译后会链接成共享对象（.so文件，类似win平台的.dll）

2. 编译 直接就male命令

3. 安装  make install
