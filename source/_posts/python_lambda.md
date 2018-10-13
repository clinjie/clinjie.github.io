title: Lambda
date: 2016-01-26 17:28:30
tags:
- python
- lambda
categories: python
---
# Python的Lambda函数 #  

lambda函数也叫匿名函数，即函数没有具体的名称，函数冒号之前是函数的参数，没有return语句，参数的结果就是返回值。先来看一个最简单例子：

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

1. 使用Python写一些执行脚本时，使用lambda可以省去定义函数的过程，让代码更加精简。

2. 对于一些抽象的，不会别的地方再复用的函数，有时候给函数起个名字也是个难题，使用lambda不需要考虑命名的问题。
<!--more-->
3. 使用lambda在某些时候让代码更容易理解。

## lambda基础 ##

lambda语句中，冒号前是参数，可以有多个，用逗号隔开，冒号右边的返回值。lambda语句构建的其实是一个函数对象，见证一下：

```
g = lambda x : x**2
print g

<function <lambda> at 0x00AFAAF0>
```

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
lambda在很多地方都能使代码更加简洁，例如

```python
#sort()
s = [('a', 3), ('b', 2), ('c', 1)]

#对这个数组用第二个元素排序。可以写成 
sorted(s, key=lambda x:x[1])
```


lambda与序列的结合使用：

python中有几个常用的内建高级函数，map、reduce、filter。这几个函数都是处理iteraable的，三个函数都是采用函数处理序列返回新的序列形式，所以这里我们就可以是使用lambda。


- map()

返回的是一个序列
`print(list(map(lambda x:str(x),[1,2,3,4,5,6])))`

['1', '2', '3', '4', '5', '6']

- reduce()

返回的是一个经过运算得到的结果
```python
from functools import reduce
print(reduce(lambda x,y:x*y+2,[1,2,3,4,5,6]))

#1754

from functools import reduce
print(reduce(lambda x,y:(x+y)%2==0,range(1,20)))

#False
```

- filter()

`print(list(filter(lambda x:x%2==0,range(1,20))))`

[2, 4, 6, 8, 10, 12, 14, 16, 18]