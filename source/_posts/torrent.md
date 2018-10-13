title: torrent文件编码
date: 2016-03-14 22:23:35
tags: 
- torrent
- 编码
categories: torrent 
---

![](http://img1.mydrivers.com/img/20150517/008c977d53a449319839b62734ab656b.jpg)

# Torrent小记 #

由于某些众所周知的原因，我对torrent文件(也就是我们常说的种子文件)产生了浓厚的兴趣，这里是官方百科对torrent文件的定义：

*torrent文件本质上是文本文件，包含Tracker信息和文件信息两部分。Tracker信息主要是BT下载中需要用到的Tracker服务器的地址和针对Tracker服务器的设置，文件信息是根据对目标文件的计算生成的，计算结果根据BitTorrent协议内的B编码规则进行编码。所以，torrent文件就是被下载文件的“索引”。*

<!--more-->

既然是文本文件，使用文本编辑器，意料之中的失败，打开之后是大片大片的乱码，当然主要是中文乱码... 数字以及字母信息还是显示的相当完整的。也许当我打开一个纯英文Tracker信息的torrent文件时，就可以很清楚的了解其中的内容了。现在先来看一下torrent文件的编码格式.

# bencoding编码 #

BT种子文件使用了一种叫bencoding的编码方法来保存数据。

bencoding现有四种类型的数据：`srings`(字符串)，`integers`(整数)，`lists`(列表)，`dictionaries`(字典)


编码规则如下：

- strings(字符串)
```
编码为：<字符串长度>：<字符串>
例如： 
4:test 表示为字符串"test"
4:例子 表示为字符串“例子”
字符串长度单位为字节
没开始或结束标记
```

- integers(整数)
```
编码为：i<整数>e
开始标记i，结束标记为e
例如： 
i1234e 表示为整数1234
i-1234e 表示为整数-1234
整数没有大小限制
i0e 表示为整数0
i-0e 为非法
以0开头的为非法如： i01234e 为非法
```

- lists(列表)
```
编码为：l<bencoding编码类型>e
开始标记为l,结束标记为e
列表里可以包含任何bencoding编码类型，包括整数，字符串，列表，字典。
例如： l4:test5abcdee 表示为二个字符串["test","abcde"]
```

- dictionaries(字典)
```
编码为d<bencoding字符串><bencoding编码类型>e   
开始标记为d,结束标记为e
关键字必须为bencoding字符串
值可以为任何bencoding编码类型
例如： d3:agei20ee 表示为{"age"=20}
d4:path3:C:\8:filename8:test.txte 表示为{"path"="C:\","filename"="test.txt"}
```

# Torrent文件基本结构 #

种子具体文件结构如下：

全部内容必须都为bencoding编码类型。


如果字典用{}表示，列表用[]表示，字符用""表示，目录类型的BT文件大致是这样的

```
{
"announce"="http://btfans.3322.org:8000/announce"   ;tracker 服务器的URL(字符串)
"announce-list"=["http://..","http://.."]           ;备用tracker服务器列表(列表)
"creation date"=1175204110                          ;种子创建的时间，Unix标准时间格式
"encoding"="GBK"                                    ;编码
"comment"="备注"
"created by"="创建人信息"

{

"info"={"files"=[{"filehash"="SHA1 Hash","length"=168099584,"path"=["01.rmvb"]},
                  {...},
                  {...}                
                 ]
        
         "name"="保存目录名"
         "piece length"=2097152    ；每个块的大小，单位字节(整数)
         "pieces"="每个块的SHA1 Hash的值的顺序排列(二进制格式,长度为"20 X 块数")"
          

         }

}

}
```

其中，filehash为20个字节的二进制的SHA1 Hash

需要下载文件的主要信息保存在`'info'`值中，可以逐字解码。