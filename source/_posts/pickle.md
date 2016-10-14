title: 序列化
date: 2016-1-10 22:57:53
toc:
tags: python
categories: python
---

在程序运行的过程中，所有的变量都是在内存中，比如，定义一个dict：

d = dict(name='Bob', age=20, score=88)
可以随时修改变量，比如把name改成'Bill'，但是一旦程序结束，变量所占用的内存就被操作系统全部回收。如果没有把修改后的'Bill'存储到磁盘上，下次重新运行程序，变量又被初始化为'Bob'。

我们把变量从内存中变成可存储或传输的过程称之为序列化，在Python中叫pickling，在其他语言中也被称之为serialization，marshalling，flattening等等，都是一个意思。

<!--more-->

序列化之后，就可以把序列化后的内容写入磁盘，或者通过网络传输到别的机器上。

反过来，把变量内容从序列化的对象重新读到内存里称之为反序列化，即unpickling。

Python提供了pickle模块来实现序列化。

首先，我们尝试把一个对象序列化并写入文件：

```python
>>> import pickle
>>> d = dict(name='Bob', age=20, score=88)
>>> pickle.dumps(d)
b'\x80\x03}q\x00(X\x03\x00\x00\x00ageq\x01K\x14X\x05\x00\x00\x00scoreq\x02KXX\x04\x00\x00\x00nameq\x03X\x03\x00\x00\x00Bobq\x04u.'
pickle.dumps()方法把任意对象序列化成一个bytes，然后，就可以把这个bytes写入文件。或者用另一个方法pickle.dump()直接把对象序列化后写入一个file-like Object：

>>> f = open('dump.txt', 'wb')
>>> pickle.dump(d, f)
>>> f.close()
```

看看写入的dump.txt文件，一堆乱七八糟的内容，这些都是Python保存的对象内部信息。

当我们要把对象从磁盘读到内存时，可以先把内容读到一个bytes，然后用pickle.loads()方法反序列化出对象，也可以直接用pickle.load()方法从一个file-like Object中直接反序列化出对象。我们打开另一个Python命令行来反序列化刚才保存的对象：

```python
>>> f = open('dump.txt', 'rb')
>>> d = pickle.load(f)
>>> f.close()
>>> d
{'age': 20, 'score': 88, 'name': 'Bob'}
```

# Json #

如果我们要在不同的编程语言之间传递对象，就必须把对象序列化为标准格式，比如XML，但更好的方法是序列化为JSON，因为JSON表示出来就是一个字符串，可以被所有语言读取，也可以方便地存储到磁盘或者通过网络传输。JSON不仅是标准格式，并且比XML更快，而且可以直接在Web页面中读取，非常方便


json的语法规范：

- 数据在名称/值

`"firstName" : "John"`

- 数据由逗号分隔

`{ "firstName":"John" , "lastName":"Doe" }`

- 花括号保存对象
- 方括号保存数组

```
{
"employees": [{ "firstName":"John" , "lastName":"Doe" },
	{ "firstName":"Anna" , "lastName":"Smith" },
	{ "firstName":"Peter" , "lastName":"Jones" }]
}
```

上面的json语句中，json根结构包含一个数组对象，名为employees，数组包含三个对象，每个对象中有两个数据保存

![](http://peihao.space/img/article/python/py-json.png)

Python内置的json模块提供了非常完善的Python对象到JSON格式的转换。我们先看看如何把Python对象变成一个JSON：

```python
>>> import json
>>> d = dict(name='Bob', age=20, score=88)
>>> json.dumps(d)
'{"age": 20, "score": 88, "name": "Bob"}'
```

dumps()方法返回一个str，内容就是标准的JSON。类似的，dump()方法可以直接把JSON写入一个file-like Object。

要把JSON反序列化为Python对象，用loads()或者对应的load()方法，前者把JSON的字符串反序列化，后者从file-like Object中读取字符串并反序列化：

```python
>>> json_str = '{"age": 20, "score": 88, "name": "Bob"}'
>>> json.loads(json_str)
{'age': 20, 'score': 88, 'name': 'Bob'}
```

## 实例对象与json的转换 ##

常规对象一般都不是可序列化为Json的对象，为了可以让`dumps`函数知道如何将传入的对象序列化为json，我们需要为对象实例的类专门写一个转换函数，将对象转换成一个dic.

```python
import json

class Student(object):
    def __init__(self, name, age, score):
        self.name = name
        self.age = age
        self.score = score
def obj2dic(self):
        return {
            'name':self.name,
            'age':self.age,
            'score':self.score
        }
s=Student('James',22,99)
print(json.dumps(s,default=obj2dic))
#{"age": 22, "name": "James", "score": 100}
```

当然了，我们的转换函数不是类函数，否则dumps方法就无法访问到了。

实际上我们还有一个更简单的方法，那就是通过类的内置__dict__方法转换，大多数类都是可以直接使用

`print(json.dumps(s,default=lambda obj:obj.__dict__))`

因为我们需要的deafult键值是一个方法，而s.__dict__实际上就是一个dic对象，所以我们要借助匿名方法lambda

同样的道理，如果我们要把JSON反序列化为一个Student对象实例，loads()方法首先转换出一个dict对象，然后，我们传入的object_hook函数负责把dict转换为Student实例：

```python
def dict2student(d):
    return Student(d['name'], d['age'], d['score'])

#运行结果如下：

>>> json_str = '{"age": 20, "score": 88, "name": "Bob"}'
>>> print(json.loads(json_str, object_hook=dict2student))
<__main__.Student object at 0x10cd3c190>
```
打印出来的是Student实例