title: Python中的str与bytes
date: 2016-01-02 12:23:35
tags: 
- Python
- 编码
categories: Python
---

在Python中，bytes和string是不同的东西。由一系列不可改变的Unicode字符组成的叫string。而一系列不可改变的介于0-255之间的数字被称为bytes对象。 

unicode是一种编码标准，具体的实现标准可能是utf-8，utf-16，gbk ……

python 在内部使用两个字节来存储一个unicode，使用unicode对象而不是str的好处，就是unicode方便于跨平台。

# Unicode #

Unicode是计算机可以支持这个星球上的多种语言的秘密武器，在Unicode之前，用的都是ASCII，ASCII吗非常简单，每个英文字符都用7位二进制数的方式存储在计算机内，其范围是32到126.它的实现原理这里也不说了。<!--more-->
但是ASCII码只能表示95个可打印的字符，后来把ASCII扩展到了8位，这样就能表示223个字符了，虽然这个来表示欧美字母语言已经足够了，但是对于像中文等语系来说就太少了。于是Unicode码诞生了。

Unicode通过使用一个或者多个字节来表示一个字符，这样就突破了ASCII的限制，这样，Unicode可以表示超过90000个字符了。

# Py3 #

python3的str等于python2的unicode，也就是在python3处理时，源码相当于全部都是u''
而且python3的str不提供decode（因为概念上unicode就没有带encoding）


Python 3最重要的新特性大概要算是对文本和二进制数据作了更为清晰的区分。文本总是Unicode，由str类型表示，二进制数据则由bytes类型表示。Python 3不会以任意隐式的方式混用str和bytes，正是这使得两者的区分特别清晰。你不能拼接字符串和字节包，也无法在字节包里搜索字符串（反之亦然），也不能将字符串传入参数为字节包的函数（反之亦然）。

# 常见编码 #

- GB2312编码：适用于汉字处理、汉字通信等系统之间的信息交换

- GBK编码：是汉字编码标准之一，是在 GB2312-80 标准基础上的内码扩展规范，使用了双字节编码

- ASCII编码：是对英语字符和二进制之间的关系做的统一规定

- Unicode编码：这是一种世界上所有字符的编码。当然了它没有规定的存储方式。

- UTF-8编码：是 Unicode Transformation Format - 8 bit 的缩写， UTF-8 是 Unicode 的一种实现方式。它是可变长的编码方式，可以使用 1~4 个字节表示一个字符，可根据不同的符号而变化字节长度。

# decode与encode #

Python内部的字符串一般都是 Unicode编码。代码中字符串的默认编码与代码文件本身的编码是一致的。所以要做一些编码转换通常是要以Unicode作为中间编码进行转换的，即先将其他编码的字符串解码（decode）成 Unicode，再从 Unicode编码（encode）成另一种编码。

- decode的作用是将其他编码的字符串转换成Unicode编码，`name.decode(“GB2312”)`，表示将GB2312编码的字符串name转换成Unicode编码`,也就是将将原来name解码成unicode，字面上理解为将其他字符编码成unicode
- encode的作用是将Unicode编码转换成其他编码的字符串，name.encode(”GB2312“)，表示将GB2312编码的字符串name转换成GB2312编码

所以在进行编码转换的时候必须先知道 name 是那种编码，然后 decode 成 Unicode 编码，最后在 encode 成需要编码的编码。当然了，如果 name 已经就是 Unicode 编码了，那么就不需要进行 decode 进行解码转换了，直接用 encode 就可以编码成你所需要的编码。

Tips：对 Unicode 进行编码和对 str 进行编码都是错误的。

![](\img\article\bytes-str.png)

字符串可以编码成字节包，而字节包可以解码成字符串。

```python
>>>'€20'.encode('utf-8')
b'\xe2\x82\xac20'
>>> b'\xe2\x82\xac20'.decode('utf-8')
'€20'
```


# 简单的win剪切板操作 #

```python
def getText():
    w.OpenClipboard()
    d = w.GetClipboardData(win32con.CF_TEXT)
    w.CloseClipboard()
    return d.decode('utf-8','ignore')

def setText(aString):
    w.OpenClipboard()
    w.EmptyClipboard()
    w.SetClipboardData(win32con.CF_TEXT,aString)
    w.CloseClipboard()
```

上面是定义的两个函数，分别是对剪切板进行读、写操作。遗憾的是，由于剪切板中复杂的编码问题，在win平台下很难有效的对非英文字符进行操作。