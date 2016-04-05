title: Lambda
date: 2016-01-26 17:28:30
toc: true
tags:
- python
- lambda
categories: python
---
# Python的Lambda函数 #  

lambda函数也叫匿名函数，即，函数没有具体的名称。先来看一个最简单例子：

```
def f(x):
    return x**3

print f(5)
#结果是125
```

Python中使用lambda的话，写成这样

```
g = lambda x : x**3
print g(5)
#同样的结果  125
```

lambda表达式在很多编程语言都有对应的实现。比如C#：

```
var g = x => x**2
Console.WriteLine(g(4))
```

<!--more-->

那么，lambda表达式有什么用处呢？很多人提出了质疑，lambda和普通的函数相比，就是省去了函数名称而已，同时这样的匿名函数，又不能共享在别的地方调用。其实说的没错，lambda在Python这种动态的语言中确实没有起到什么惊天动地的作用，因为有很多别的方法能够代替lambda。同时，使用lambda的写法有时显得并没有那么pythonic。甚至有人提出之后的Python版本要取消lambda。

回过头来想想，Python中的lambda真的没有用武之地吗？其实不是的，至少我能想到的点，主要有：

1. 使用Python写一些执行脚本时，使用lambda可以省去定义函数的过程，让代码更加精简。

2. 对于一些抽象的，不会别的地方再复用的函数，有时候给函数起个名字也是个难题，使用lambda不需要考虑命名的问题。

3. 使用lambda在某些时候让代码更容易理解。

## lambda基础 ##

lambda语句中，冒号前是参数，可以有多个，用逗号隔开，冒号右边的返回值。lambda语句构建的其实是一个函数对象，见证一下：

```
g = lambda x : x**2
print g

<function <lambda> at 0x00AFAAF0>
```

C#3.0开始，也有了lambda表达式，省去了使用delegate的麻烦写法。C#中的lambda表达式关键字是=>，看下面的一个例子：

```
var array = new int[] {2, 3, 5, 7, 9};
var result = array.Where(n => n > 3); // [5, 7, 9]
```

C#使用了扩展方法，才使得数组对象拥有了像Where,Sum之类方便的方法。Python中，也有几个定义好的全局函数方便使用的，他们就是filter, map, reduce。

```
>>> foo = [2, 18, 9, 22, 17, 24, 8, 12, 27]
>>>
>>> print filter(lambda x: x % 3 == 0, foo)
[18, 9, 24, 12, 27]
>>>
>>> print map(lambda x: x * 2 + 10, foo)
[14, 46, 28, 54, 44, 58, 26, 34, 64]
>>>
>>> print reduce(lambda x, y: x + y, foo)
139
```

## 非lambda不可？ ##
上面例子中的map的作用，和C#的Where扩展方法一样，非常简单方便。但是，Python是否非要使用lambda才能做到这样的简洁程度呢？在对象遍历处理方面，其实Python的for..in..if语法已经很强大，并且在易读上胜过了lambda。比如上面map的例子，可以写成：
```
print [x * 2 + 10 for x in foo]
```
非常的简洁，易懂。

filter的例子可以写成：
```
print [x for x in foo if x % 3 == 0]
```
同样也是比lambda的方式更容易理解。

所以，什么时候使用lambda，什么时候不用，需要具体情况具体分析，只要表达的意图清晰就好。一般情况下，如果for..in..if能做的，我都不会选择lambda。 

----------
在数学教学中，经常会使用到lambda，比如有一位老兄就遇到这样一个问题。他想创建一个函数数组fs=[f0,...,f9] where fi(n)=i+n. 于是乎，就定义了这么一个lambda函数：

```
fs = [(lambda n: i + n) for i in range(10)]
```
但是，奇怪的是，

```
>>> fs[3](4)
13
>>> fs[4](4)
13
>>> fs[5](4)
13
```
结果并没有达到这位老兄的预期，预期的结果应该是：

```
>>> fs[3](4)
7
>>> fs[4](4)
8
>>> fs[5](4)
9
```
问题其实出在变量i上。上面的代码换个简单的不使用lambda的缩减版本：

```
i = 1
def fs(n):
    return n + i
print fs(1) # 2

i = 2
print fs(1) # 3
```
可见，上面没有达到预期的原因是lambda中的i使用的是匿名函数外的全局变量。修改一下：

```
fs = [(lambda n, i=i : i + n) for i in range(10)]
>>> fs[3](4)
7
>>> fs[4](4)
8
>>> fs[5](4)
9
```


