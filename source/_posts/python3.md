title: Python学习(三)
date: 2016-2-1 14:39:55
tags: 
- python
categories: python
---
接着我的上篇文章，[Python学习(二)](/2016/01/01/python2/).

![](http://7xowaa.com1.z0.glb.clouddn.com/python3.jpg)

## 扩展Python ##

Python可以实现一切，但是有时候显然会感觉到比较缓慢（相对于C、C++甚至Java等语言），在某些科学模拟程序、图形渲染方面。使用python也许就不是一个好的选择，使用python的目的就是易用、高效的开发速度，但是相应的运行速度会降低。  

<!--more-->
  

当我们需要额外的速度的情况时候，最好的解决方案肯定不是整个开发过程都使用C语言或其他相对低级的语言，而是推荐以下的方法，使用这些方法能够满足很多工业强度上的速度要求:

- 在Python中开发一个原型程序（prototype）

- 分析程序并且找到平静

- 用C语言或其他作为扩展重写出现瓶颈的代码

  

----------
**一些简单的途径**

如果曾经使用过Jython和IronPython，你就会发现用这两种方式来扩展Pyhton是相当方便的。Jython对应Java，IronPython对应C#和其他.Net语言，可以直接访问对应的底层类和标准库。

目前的主流情况下，除了C语言，扩展比较多的就是Java语言，这里我就简单的尝试一下。

```
public class JythonTest{
	public void greting(){
		System.out.println('Hello,Jython');
	}
}
```
将文件JythonTest.java编译成.class二进制代码，放置到当前工作目录下或者放到配置的Java CLASSPATH中的某处，启动Jython
```
$ CLASSPATH=JythonTest.class jython
```
直接导入类
```
>>>import JythonTest
>>>test=JythonTest()
>>>test.greeting()
Hello,Jython
```


**编写C语言扩展**
扩展Python通常就是指扩展CPython，它使用C语言实现的额标准Python版本.SWIG是简单包装和接口生成器的缩写。它是一个能用几种语言的工具，一方面，可以通过它使用C语言或者C++编写扩展代码，另一方面，他会自动包装那些代码，以便能在一些高级语言中使用（Perl、Ruby、Java、Python）。如果决定将系统的一部分使用C语言扩展编写，而不是直接在Python中实现的话，使用C语言扩展库也能在其他语言中使用。

1. C语言源文件palindrome.c
```
//palindrome.c
#include <string.h>

int is_palindrome(char *text){
	int i,n=strlen(text);
	for(i=0;i<=n/2;i++){
		if(text[i]!=text[n-i-1])
			return 0;
	}
	return 1;
}
```

2. 相应的C语言头文件palindrome.h
```
/* File: palindrome.h */

int is_palindrome(char *text);
```

3. 使用swig模块写一个描述文件palindrome.i
```
/* File: palindrome.i */
%module palindrome

%{
#define SWIG_FILE_WITH_INIT
#include "palindrome.h"
%}

int is_palindrome(char *text);
```

4. 为了建python模块，利用-python参数执行swig
```
swig -python palindrome.i
```
执行完命令后生成两个不同的文件：palindrome_wrap.c和palindrome.py。

自动生成文件名的原则：生成的c文件名与写的c文件名有关（例如写的c文件名为example.c则生成example_wrap.c）；生成的python文件即.i文件中%module后面的名字。

5. 利用distutils生成动态库
python自带一个distutils工具，可以用它来创建python的扩展模块。使用它也很简单，只需要先定义一个配置文件，通常是命名为setup.py
```
"""
setup.py
"""
 
from distutils.core import setup, Extension
 
 
palindrome_module = Extension('_palindrome',
                           sources=['palindrome_wrap.c', 'palindrome.c'],
                           )
 
setup (name = 'palindrome',
       version = '0.1',
       author      = "SWIG Docs",
       description = """Simple swig example from docs""",
       ext_modules = [palindrome_module],
       py_modules = ["palindrome"],
       )
```
pic：头文件和源文件都是palindrome.*，那么setup.py脚本中Extension的参数必须为“_palindrome”

6. 编译
```
python setup.py build
```
会在本目录下build/lib*/下生成_palindrome.pyd模块，可以直接使用，例如
```
>>>import palindrome
>>>print palindrome.is_palindrome("sssttsss")
1
```
可以把动态模块直接生成当前目录下
```
python setup.py build_ext --inplace
```