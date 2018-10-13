title: error机制
date: 2016-1-10 21:57:53
tags: python
categories: python
---

与许多编程语言相似，python提供了一系列默认的error的机制。我们先看看
<!--more-->

# try-catch #

```python
try:
    print(10/0)
	print('shouldn't be called')
except ZeroDivisionError as e:
    print('except at:',e)
finally:
    print('done')

except at: division by zero
done
```

当我们认为某些代码可能会出错时，就可以用try来运行这段代码，如果执行出错，则后续代码不会继续执行，而是直接跳转至错误处理代码，即except语句块，执行完except后，如果有finally语句块，则执行finally语句块。即使没有出现except，依然会执行finally包括的语句

此外，如果没有错误发生，可以在except语句块后面加一个else，当没有错误发生时，会自动执行else语句


使用try...except捕获错误还有一个巨大的好处，就是可以跨越多层调用，比如函数main()调用foo()，foo()调用bar()，结果bar()出错了，这时，只要main()捕获到了，就可以处理

也就是说，不需要在每个可能出错的地方去捕获错误，只要在合适的层次去捕获错误就可以了。这样一来，就大大减少了写try...except...finally的麻烦。

# 错误记录 #

Python内置的logging模块可以非常容易地记录错误信息，在except调用loggong之后，程序会继续执行下去。

```python
import logging

def foo(s):
    return 10 / int(s)

def bar(s):
    return foo(s) * 2

def main():
    try:
        bar('0')
    except Exception as e:
        logging.exception(e)

main()
print('END')
```

在这里，虽然在console中记录显示出错误信息，但是依然会继续执行下去，打印输出'END'

# raise #

因为错误是class，捕获一个错误就是捕获到该class的一个实例。因此，错误并不是凭空产生的，而是有意创建并抛出的。Python的内置函数会抛出很多类型的错误，我们自己编写的函数也可以抛出错误。

如果要抛出错误，首先根据需要，可以定义一个错误的class，选择好继承关系，然后，用raise语句抛出一个错误的实例：

```python
class FooError(ValueError):
    pass

def foo(s):
    n = int(s)
    if n==0:
        raise FooError('invalid value: %s' % s)
    return 10 / n

foo('0')

'''
Traceback (most recent call last):
  File "err_throw.py", line 11, in <module>
    foo('0')
  File "err_throw.py", line 8, in foo
    raise FooError('invalid value: %s' % s)
__main__.FooError: invalid value: 0
'''
```

执行，可以最后跟踪到我们自己定义的错误。在程序开发过程中，我们通常还有另外一种处理error的机制，在本层中捕获到error之后向上级抛出

raise语句如果不带参数，就会把当前错误原样抛出。此外，在except中raise一个Error，还可以把一种类型的错误转化成另一种类型：

```python
try:
    10 / 0
except ZeroDivisionError:
    raise ValueError('input error!')
```

# Debug #

## print ##

直接在需要调试的地方打印输出测试

## assert ##

断言代替打印：

```python
def foo(s):
    n = int(s)
    assert n != 0, 'n is zero!'
    return 10 / n

def main():
    foo('0')
```

assert的意思是，表达式n != 0应该是True，否则，根据程序运行的逻辑，后面的代码肯定会出错。

如果断言失败，assert语句本身就会抛出AssertionError

## logging ##

把print()替换为logging是第3种方式，和assert比，logging不会抛出错误，而且可以输出到文件

```python
import logging
logging.basicConfig(level=logging.INFO)


s = '0'
n = int(s)
logging.info('n = %d' % n)
print(10 / n)
```

`logging.basicConfig(level=logging.INFO)`这条语句是设置记录的级别，有debug、info、warn和error四种，根据设置的不同，输出包容的信息级别也就不一样，例如设置level=WARNING后，debug和info就没用了。