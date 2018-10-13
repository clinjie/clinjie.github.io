title: py中函数的使用
date: 2016-10-07 15:01:15
tags: python
categories: python
---

# 高阶函数 #

python中，函数名可以作为变量使用，也可以作为参数传参进另外的函数中，此时另外的函数就称为高阶函数。

```python
def abs_add(x,y,f):
	return f(x)+f(y)
```
<!--more-->
此时调用

```python
abs_add(-5,4,abs)

#或者
xx=abs
abs_add(-3,4,xx)
```

# map/reduce #

python中有两大内建函数，map与reduce。与大名鼎鼎的google map-reduce机制功能类似。

## map ##

map()函数接受两个参数，第一个是函数，之后的是一个Iterable。关于Iterable的介绍在前面的文章中已经讲过，一般可以通过for循环的对象就是Iterable的。


map将传入的函数一次作用于序列的每个元素之上，然后再将运算结果作为新的相同的Iterable形式返回。map的函数参数作用是在序列的每个元素上，运算的结果也是有形同长的序列


![](http://www.liaoxuefeng.com/files/attachments/0013879622109990efbf9d781704b02994ba96765595f56000/0)

```python
def f(x):
	return x*x

list(map(f,range(1,10)))
#[1, 4, 9, 16, 25, 36, 49, 64, 81]

list(map(str,range(1,10)))
#['1', '2', '3', '4', '5', '6', '7', '8', '9']
```

## reduce ##

reduce把一个函数作用在一个序列[x1, x2, x3, ...]上，这个函数必须接收两个参数，reduce把结果继续和序列的下一个元素做累积计算。reduce的函数参数是依次作用在元素上，运算的结果也是一个确定的结果，一般不是序列

`reduce(f, [x1, x2, x3, x4]) = f(f(f(x1, x2), x3), x4)`

```python
>>> from functools import reduce
>>> def fn(x, y):
...     return x * 10 + y
...
>>> reduce(fn, [1, 3, 5, 7, 9])
13579
```
上面的运算中，首先使用序列的前两个元素计算结果，然后将结果与后面每个的元素一次次的计算。

```python
#str2int
from functools import reduce

def str2int(s):
    def fn(x, y):
        return x * 10 + y
    def char2num(s):
        return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[s]
    return reduce(fn, map(char2num, s))
```

先用map将序列的每个char元素对应成int，之后再使用reduce将序列联结。


```python

#简化模式
from functools import reduce

def char2num(s):
    return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[s]

def str2int(s):
    return reduce(lambda x, y: x * 10 + y, map(char2num, s))
```

# filter过滤器 #

filter()也接收一个函数和一个序列，filter()把传入的函数依次作用于每个元素，然后根据返回值是True还是False决定保留还是丢弃该元素。filter的函数参数作用是在序列的每个元素上，运算的结果也是有形同长的序列

例如，在一个list中，删掉偶数，只保留奇数，可以这么写：

```python
def is_odd(n):
    return n % 2 == 1

list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
# 结果: [1, 5, 9, 15]
```


把一个序列中的空字符串删掉，可以这么写：

```python
def not_empty(s):
    return s and s.strip()

list(filter(not_empty, ['A', '', 'B', None, 'C', '  ']))
# 结果: ['A', 'B', 'C']
```

filter返回的是一个惰性序列，所以要强制计算出所有的元素，使用list方法。

## 实例 ##

下面通过一个简单的小例子展示filter的魅力:

```python
#初始数据源，生成一个3以上的奇数序列
def init_odd():
    n=1
    while True:
        n=n+2
        yield n

//过滤器 当x元素不能被n整除的话返回真，也就是说求非n的倍数
def ini_gen(n):
    return lambda x:x%n>0

def primes():
    yield 2
    it=init_odd()
    while True:
		#获取当前序列的第一个元素
        n=next(it)
        yield n
		#生产新的序列,此时ini_gen(n)是一个确定的lambda函数，后面的it是他的参数x
        it=filter(ini_gen(n),it)
list=[]
for n in primes():
    if(n<100):
        list.append(n)
    else:break
print(list)
```

上面的代码可能直接硬吃不好理解，实际上是生成素数的序列，这个逻辑的前提是一种求素数序列的思路：

>[埃拉托斯特尼筛法](http://baike.baidu.com/link?url=izOudiNJ-O36BWdOi0ZqEvrhb7PK56ihjHd4xIvI-KPtlCIq3FCBKdu2DBgHozboX60jm830b18kbmzZ63mLR_)

- 首先，列出从2开始的所有自然数，构造一个序列：

2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...

- 取序列的第一个数2，它一定是素数，然后用2把序列的2的倍数筛掉：

3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...

- 取新序列的第一个数3，它一定是素数，然后用3把序列的3的倍数筛掉：

5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...

- 取新序列的第一个数5，然后用5把序列的5的倍数筛掉：

7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...

- 不断筛下去，就可以得到所有的素数。


# sorted #

sorted(data, key=None, reverse=False)  函数是python的高级函数，可以参数表中的第一个列表进行排序

其中，data是待排序数据，可以使List或者iterator, cmp和key都是函数，这两个函数作用与data的元素上产生一个结果，sorted方法根据这个结果来排序。 

<!--cmp(e1, e2) 是带两个参数的比较函数, 返回值: 负数: e1 < e2, 0: e1 == e2, 正数: e1 > e2. 默认为 None, 即用内建的比较函数. 目前的最新3.x版本将cmp参数删除 --> 

key 是带一个参数的函数, 用来为每个元素提取比较值. 默认为 None, 即直接比较每个元素. 
通常, key 和 reverse 比 cmp 快很多, 因为对每个元素它们只处理一次; 而 cmp 会处理多次. 

```python
sorted([36, 5, -12, 9, -21])
#[-21, -12, 5, 9, 36]

#接受排序的函数是绝对值函数，将会对列表内的每个元素进行求绝对值在升序排序
sorted([36, 5, -12, 9, -21], key=abs)
#[5, 9, -12, -21, 36]
```


