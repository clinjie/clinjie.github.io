title: py中函数的使用（二）
date: 2016-10-08 15:01:15
tags: python
categories: python
---

# 函数作返回值 #

python支持return一个函数：
<!--more-->
```python
def lazy_sum(*args):
    def sum():
        ax=0
        for it in args:
            ax+=it
        return ax
    return sum

print(lazy_sum(1,2,3,4,5))
#<function lazy_sum.<locals>.sum at 0x00554C90>

print(lazy_sum(1,2,3,4,5)())
#15


def lazy_sum(*args):
    ax=1
    def sum(ax):
        for it in args:
            ax+=it
        return ax
    return sum

print(lazy_sum(1,2,3,4,5)(2))
```

lazy_sum返回的是在他函数体重定义的函数sum，内部函数sum可以引用外部函数lazy_sum的参数和局部变量，当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，称之为闭包（closure）。

单纯的调用lazy_sum(list.....)返回的是函数对象，需要对函数调用才行。


# 装饰器decorator #

装饰器可以在代码的运行期间动态的增加功能，本质上，装饰器就是一个返回函数的高阶函数。

```python
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

上面就是一个简单的decorator实例，具体的使用如下


```python
@log
def now():
    print('2015-3-25')
```

`@log`在定义函数now()之前，相当于执行了now=log(now),log函数接收了函数now，在log中的变量名是func，并且最后返回了func(*args,**kw)。其中args和kw接受了now函数的所有参数，return wrapper/return func(*args,**kw)，是直接执行now(args,kw)之后返回。

所以在now函数定义前面假如@log之后，相当于先执行wrapper函数，在原封不动的执行now函数。

```python
import time
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__,time.ctime())
        return func(*args, **kw)
    return wrapper
@log
def now(str):
    print('2015-3-25',str)
now('xxxxxxx')

#call now(): Sat Oct  8 23:30:38 2016
#2015-3-25 xxxxxxx
```

上面的log、wrapper都是可以改变不是固定格式，@也是根据函数名变化。


```python
#实现调用前、后都输出提示信息
import time
def xxx(func):
    def log1(*args, **kw):
        print('call %s():' % func.__name__,time.ctime())
        func(*args, **kw)
        time.sleep(1)
        print('call %s():' % func.__name__,time.ctime())
    return log1
@xxx
def now(str):
    print('2015-3-25',str)
now('xxxxxxx')

#call now(): Sun Oct  9 17:27:38 2016
#2015-3-25 xxxxxxx
#call now(): Sun Oct  9 17:27:39 2016
```


如果decorator本身需要传入参数，那就需要编写一个返回decorator的高阶函数，写出来会更复杂。比如，要自定义log的文本：
```python
def log(text=None):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```
这个3层嵌套的decorator用法如下：

```python
@log('execute')
def now():
    print('2015-3-25')
执行结果如下：

>>> now()
execute now():
2015-3-25
```

`>>> now = log('execute')(now)`
我们来剖析上面的语句，首先执行log('execute')，返回的是decorator函数，再调用返回的函数，参数是now函数，返回值最终是wrapper函数。

以上两种decorator的定义都没有问题，但还差最后一步。因为我们讲了函数也是对象，它有__name__等属性，但你去看经过decorator装饰之后的函数，它们的__name__已经从原来的'now'变成了'wrapper'：

```
>>> now.__name__
'wrapper'
```

因为返回的那个wrapper()函数名字就是'wrapper'，所以，需要把原始函数的__name__等属性复制到wrapper()函数中，否则，有些依赖函数签名的代码执行就会出错。

不需要编写wrapper.__name__ = func.__name__这样的代码，Python内置的functools.wraps就是干这个事的，所以，一个完整的decorator的写法如下：

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
#或者针对带参数的decorator：

import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```


# 偏函数 #


在介绍函数参数的时候，我们讲到，通过设定参数的默认值，可以降低函数调用的难度。而偏函数也可以做到这一点。举例如下：

int()函数可以把字符串转换为整数，当仅传入字符串时，int()函数默认按十进制转换：

```python
>>> int('12345')
12345
```
但int()函数还提供额外的base参数，默认值为10。如果传入base参数，就可以做N进制的转换：

```python
>>> int('12345', base=8)
5349
>>> int('12345', 16)
74565
```

假设要转换大量的二进制字符串，每次都传入int(x, base=2)非常麻烦，于是，我们想到，可以定义一个int2()的函数，默认把base=2传进去：

```python
def int2(x, base=2):
    return int(x, base)
```
这样，我们转换二进制就非常方便了：


```python
>>> int2('1000000')
64
>>> int2('1010101')
85
```
functools.partial就是帮助我们创建一个偏函数的，不需要我们自己定义int2()，可以直接使用下面的代码创建一个新的函数int2：

```python
>>> import functools
>>> int2 = functools.partial(int, base=2)
>>> int2('1000000')
64
>>> int2('1010101')
85
```
所以，简单总结functools.partial的作用就是，**把一个函数的某些参数给固定住（也就是设置默认值），返回一个新的函数，调用这个新函数会更简单**。

注意到上面的新的int2函数，仅仅是把base参数重新设定默认值为2，但也可以在函数调用时传入其他值：

```python
>>> int2('1000000', base=10)
1000000
```
最后，创建偏函数时，实际上可以接收函数对象、*args和**kw这3个参数，当传入：

`int2 = functools.partial(int, base=2)`
实际上固定了int()函数的关键字参数base，也就是：

int2('10010')
相当于：

kw = { 'base': 2 }
int('10010', **kw)
当传入：

max2 = functools.partial(max, 10)
实际上会把10作为*args的一部分自动加到左边，也就是：

max2(5, 6, 7)
相当于：

args = (10, 5, 6, 7)
max(*args)
结果为10。