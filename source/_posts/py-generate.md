title: py中generator的使用
date: 2016-10-07 13:01:15
toc: true
tags:
categories:
---

# 列表生成器 #
先看一些通过列表生成器生成的列表：

```python
#python输出全排列

[m+n+b for m in "ABC" for n in "ABC" for b in 'ABC']

['AA', 'AB', 'AC', 'BA', 'BB', 'BC', 'CA', 'CB', 'CC']
>>> [m+n+b for m in 'ABC' for n in 'ABC' for b in 'ABC']
['AAA', 'AAB', 'AAC', 'ABA', 'ABB', 'ABC', 'ACA', 'ACB', 'AC
C', 'BAA', 'BAB', 'BAC', 'BBA', 'BBB', 'BBC', 'BCA', 'BCB',
'BCC', 'CAA', 'CAB', 'CAC', 'CBA', 'CBB', 'CBC', 'CCA', 'CCB
', 'CCC']
```
<!--more-->

```python
#python输出符合条件结果

[x*x for x in range(1,99) if x%2==0]

[4, 16, 36, 64, 100, 144, 196, 256, 324, 400, 484, 576, 676,
 784, 900, 1024, 1156, 1296, 1444, 1600, 1764, 1936, 2116, 2
304, 2500, 2704, 2916, 3136, 3364, 3600, 3844, 4096, 4356, 4
624, 4900, 5184, 5476, 5776, 6084, 6400, 6724, 7056, 7396, 7
744, 8100, 8464, 8836, 9216, 9604]
```

可以看出来，列表生成器可以帮助我们很方便的生成一系列原本需要多次循环的列表。然而很多时候，我们并不需要完整的列表，只是需要其中的一部分，此时完整的列表就会造成性能、空间的浪费。

# genarator #
python内置的生成器可以帮助我们，生成器是一种一边循环一边计算的机制，实际上generator保存的是需要推算的具体算法。


` l=(m+n+b for m in 'ABC' for n in 'ABC' for b in 'ABC')`
` l=(m*m for m in range(1,50) if m%2==1)`

可以看出来,generator的形式与列表生成器很相似，只是列表的外壳是'[]'，而这里变成了'()'。此时我们尝试输出generator的长度，python报错，提示没有这个方法，这是因为generator不提供具体的空间完全保存，只是提供一个迭代的算法过程。

我们通过不断的`next(l)`可以将所有的元素输出，但是显然这样做太傻了。正确的做法是使用循环：

```python
for n in l:
	print(n)
```

此时循环输出的是除了`next(l)`后的所有元素。

或者使用list()方法计算出所有的数值.

`list(l)`

# 函数改编generator #

来看一个函数形式的斐波那契数列：

```pyhton
def fib(max):
	n,a,b=0,0,1
	while n<max:
		n=n+1
		print(b)
		a,b=b,a+b
	print('done')
```

函数实际上也是定义了运算规则，我们可以把函数改成generator。

```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'
```

如果一个函数定义中包含yield关键字，那么这个函数就不再是一个普通函数，而是一个generator

**函数是顺序执行，遇到return语句或者最后一行函数语句就返回。而变成generator的函数，在每次调用next()的时候执行，遇到yield语句返回，再次执行时从上次返回的yield语句处继续执行。**

需要注意的是，不管有没有参数，当我们直接使用function name而不是调用形式的话（例如使用fib）依然显示的是函数，无参时使用fib()或者有参时使用fib(n)才算是generator。因为只有此时才能被理解为一个iterator。

# 捕获next()报错 #

此时我们可以使用next语句或者for循环输出相应数值。


但是用for循环调用generator时，发现拿不到generator的return语句的返回值。如果想要拿到返回值'done'，必须捕获StopIteration错误，返回值包含在StopIteration的value中：

```python
>>> g = fib(6)
>>> while True:
...     try:
...         x = next(g)
...         print('g:', x)
...     except StopIteration as e:
...         print('Generator return value:', e.value)
...         break
...
g: 1
g: 1
g: 2
g: 3
g: 5
g: 8
Generator return value: done
```

# 题外-迭代器 #

凡是可作用于for循环的对象都是Iterable类型；

```python
>>> from collections import Iterable
>>> isinstance([], Iterable)
True
>>> isinstance({}, Iterable)
True
>>> isinstance('abc', Iterable)
True
>>> isinstance((x for x in range(10)), Iterable)
True
>>> isinstance(100, Iterable)
False
```

凡是可作用于next()函数的对象都是Iterator类型，它们表示一个惰性计算的序列；

```python
>>> from collections import Iterator
>>> isinstance((x for x in range(10)), Iterator)
True
>>> isinstance([], Iterator)
False
>>> isinstance({}, Iterator)
False
>>> isinstance('abc', Iterator)
False
```

集合数据类型如list、dict、str等是Iterable但不是Iterator，不过可以通过iter()函数获得一个Iterator对象。

```python
>>> isinstance(iter([]), Iterator)
True
>>> isinstance(iter('abc'), Iterator)
True
```

Python的for循环本质上就是通过不断调用next()函数实现的


生成器不但可以作用于for循环，还可以被next()函数不断调用并返回下一个值，直到最后抛出StopIteration错误表示无法继续返回下一个值

Python的Iterator对象表示的是一个数据流，Iterator对象可以被next()函数调用并不断返回下一个数据，直到没有数据时抛出StopIteration错误。可以把这个数据流看做是一个有序序列，但我们却不能提前知道序列的长度，只能不断通过next()函数实现按需计算下一个数据，所以Iterator的计算是惰性的，只有在需要返回下一个数据时它才会计算。