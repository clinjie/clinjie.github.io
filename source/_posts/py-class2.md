title: python-OO
date: 2016-1-2 20:43:42
tags: python
categories: python
---

杂乱的note：

# 添加函数 #
<!--more-->
```python
class Student(object):
    pass
def func(age): # 定义一个函数作为实例方法
     print(age)
s=Student()
s.set_age = func # 给实例绑定一个方法
s.set_age(25) # 调用实例方法
#25


#更进一步，我们可以通过绑定的方法为类添加实例属性

def set_age(self, age): # 定义一个函数作为实例方法
     self.age = age
from types import MethodType
s.set_age = MethodType(set_age, s) 
# 给实例绑定一个方法，方法为本实例对象添加属性。后面的s代表的是set_age(self,age)方法中的第一个参数
s.set_age(25) # 调用实例方法
s.age # 测试结果
#25
```


为了给所有实例都绑定方法，可以给class绑定方法：

```python
def set_scorex(self, score):
     self.score = score
Student.set_score = set_scorex
#给class绑定方法后，所有实例均可调用：

s.set_score(100)
s.score
#100
s2.set_score(99)
s2.score
#99
```
通常情况下，上面的set_score方法可以直接定义在class中，但动态绑定允许我们在程序运行的过程中动态给class加上功能，这在静态语言中很难实现。

如果我们想要限制实例的属性怎么办？比如，只允许对Student实例添加name和age属性

Python允许在定义class的时候，定义一个特殊的__slots__变量，来限制该class实例能添加的属性：

```python
class Student(object):
    __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称


s = Student() # 创建新的实例
s.name = 'Michael' # 绑定属性'name'
s.age = 25 # 绑定属性'age'
s.score = 99 # 绑定属性'score'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'score'
```

使用__slots__要注意，__slots__定义的属性仅对当前类实例起作用，对继承的子类是不起作用的

# property装饰器 #

Python内置的@property装饰器就是负责把一个方法变成属性调用。

```python
class Student(object):

    def get_score(self):
         return self._score

    def set_score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
```

上面的类方法中，在对属性_score进行设置操作时进行了限制检查，规定value必须是数字同时限制范围，否则就抛出Error。

```python
s = Student()
s.set_score(60) # ok!
s.get_score()
#60
s.set_score(9999)
Traceback (most recent call last):
  ...
ValueError: score must between 0 ~ 100!
```

上面的调用方法又略显复杂，没有直接用属性这么直接简单，此时就可以祭出@property装饰器

```python
class Student(object):

	#修改原来的getter方法
    @property
    def score(self):
        return self._score

	#修改原来的setter方法
    @score.setter
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value


s = Student()
s.score = 60 # OK，实际转化为s.set_score(60)
s.score # OK，实际转化为s.get_score()
#60
s.score = 9999
Traceback (most recent call last):
  ...
ValueError: score must between 0 ~ 100!
```

# __str__ #

我们先定义一个Student类，打印一个实例：

```python
class Student(object):
     def __init__(self, name):
         self.name = name
print(Student('Michael'))
<__main__.Student object at 0x109afb190>
```
打印出一堆<__main__.Student object at 0x109afb190>，不好看。

怎么才能打印得好看呢？只需要定义好__str__()方法，返回一个好看的字符串就可以了：

```python
class Student(object):
     def __init__(self, name):
         self.name = name
     def __str__(self):
		#注意这里是return而不是print
         return 'Student object (name: %s)' % self.name
print(Student('Michael'))
Student object (name: Michael)
```

此时直接敲变量不用print，打印出来的实例还是不好看：

```python
s = Student('Michael')
s
<__main__.Student object at 0x109afb310>
```
这是因为直接显示变量调用的不是__str__()，而是`__repr__()`，两者的区别是__str__()返回用户看到的字符串，而__repr__()返回程序开发者看到的字符串，也就是说，__repr__()是为调试服务的。

解决办法是再定义一个__repr__()。但是通常__str__()和__repr__()代码都是一样的，所以，有个偷懒的写法：

```python
class Student(object):
    def __init__(self, name):
        self.name = name
    def __str__(self):
        return 'Student object (name=%s)' % self.name
    __repr__ = __str__
```

# iter #

如果一个类想被用于for ... in循环，类似list或tuple那样，就必须实现一个__iter__()方法，该方法返回一个迭代对象，然后，Python的for循环就会不断调用该迭代对象的__next__()方法拿到循环的下一个值，直到遇到StopIteration错误时退出循环

```python
class Fib(object):

    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        return self # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration();
        return self.a # 返回下一个值

for n in Fib():
	print(n)
```

# __getitem__ #

为了实现通过下标访问元素，需要增加__getitem__（）方法：

```python
def __getitem__(self, item):
        a,b=1,1
        for x in range(item):
            a,b=b,a+b
        return a

print(Fib()[3])
```

为了为当前类添加切片功能（类似列表序列的list[1,5]），我们需要改写下__getitem__()方法：

```python
def __getitem__(self,n):
	if isinstance(n,int):
		a,b=1,1
		for x in range(n):
			a,b=b,a+b
		return a
	if isinstance(n,slice):
		start=n.start
		end=n.stop
		if start is None:
			start=0
		a,b=1,1
		L=[]
		for x in range(end):
			if x>=start:
				L.append(a)
			a,b=b,a+b
		return L

print(Fib()[3,7])
#[3,4,5,6]
```


----------
- 通过重写__call__()方法，通过实例自身的调用，达到()调用的效果

```python
class Student(object):
	def __init__(self,name):
		self.name=name
	def __call__(self):
		print('My name is %s' % self.name)

s=Student('James')
s()
#My name is James
```


# 枚举类Enum #

python中的枚举类中，每个我们规定的常量都是唯一实例。

```python
from enum import Enum
Week=Enum('Week',('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'))

#可以直接使用Week.Friday来引用一个常量，或者枚举它的所有成员
for name,member in Week.__members__.items():
    print(name,'=>',member,'<==>',member.value)

Monday => Week.Monday <==> 1
Tuesday => Week.Tuesday <==> 2
Wednesday => Week.Wednesday <==> 3
Thursday => Week.Thursday <==> 4
Friday => Week.Friday <==> 5
Saturday => Week.Saturday <==> 6
Sunday => Week.Sunday <==> 7
```

## 枚举派生类 ##

为了更方便的操作枚举类型数据，我们可以定义一个继承自Enum.class的子类

```
from enum import Enum, unique

@unique
class Weekday(Enum):
    Sun = 0 # Sun的value被设定为0
    Mon = 1
    Tue = 2
    Wed = 3
    Thu = 4
    Fri = 5
    Sat = 6
```

上面实例中，导入enmu模块中的Enum和unique后，我们可以使用@unique标记对继承自Enum的子类进行元素唯一性检测，当不同的元素被设置成为相同的value，会报错

可以使用多种访问方法：

```
day1 = Weekday.Mon
print(day1)
Weekday.Mon


print(Weekday['Tue'])
Weekday.Tue


print(Weekday.Tue.value)
2

print(day1 == Weekday.Mon)
True


print(day1 == Weekday.Tue)
False


print(Weekday(1))
Weekday.Mon


print(day1 == Weekday(1))
True

Weekday(7)
Traceback (most recent call last):
  ...
ValueError: 7 is not a valid Weekday
  for name, member in Weekday.__members__.items():
      print(name, '=>', member)
```


# metaclass #

>[metaclass](http://blog.jobbole.com/21351/)

元类：python语言在发展中借鉴了smalltalk的思想，所有东西都是对象，类也是对象。元类就是创建类的模板，也就是说，元类就是创建类的类。正常情况下类都是采用pyhton内建的元类type来创建类这个对象，但是当我们在定义类的过程中，我们可以指定使用的元类创建我们的对象。这个元类继承自type。

```python
#a是一个对象，a.__class__指的是对象所属的类，而这个所属类所属的类呢，就是type
>>> a.__class__.__class__
<type 'type'>
>>> age.__class__.__class__
<type 'type'>
>>> foo.__class__.__class__
<type 'type'>
>>> b.__class__.__class__
<type 'type'>
```

通常我们第一一个类，然后实例化类的对象，我们都是希望对象能够按照类模板进行创建，而恰恰元类就是我们在创建类的过程中动态修改类的一个方法。


可以在写一个类的时候为其添加__metaclass__属性：

```python
class Foo(object):
	__metaclass__ = something
```

如果你这么做了，Python就会用元类来创建类Foo.你首先写下class Foo(object)，但是类对象Foo还没有在内存中创建。Python会在类的定义中寻找__metaclass__属性，如果找到了，Python就会用它来创建类Foo，如果没有找到，就会用内建的type来创建这个类

```python
class Foo(Bar):
    pass
```

Foo中有__metaclass__这个属性吗？如果是，Python会在内存中通过__metaclass__创建一个名字为Foo的类对象（我说的是类对象，请紧跟我的思路）。如果Python没有找到__metaclass__，它会继续在Bar（父类）中寻找__metaclass__属性，并尝试做和前面同样的操作。如果Python在任何父类中都找不到__metaclass__，它就会在模块层次中去寻找__metaclass__，并尝试做同样的操作。如果还是找不到__metaclass__,Python就会用内置的type来创建这个类对象

我们可以在__metaclass__中放置些什么代码呢？答案就是：可以创建一个类的东西。那么什么可以用来创建一个类呢？type，或者任何使用到type或者子类化type的东东都可以。

type可以像这样工作

`type(类名, 父类的元组（针对继承的情况，可以为空），包含属性的字典（名称和值）)`

我们先从一个小例子观测__metaclass__的功能：

```python
def upper_attr(future_class_name,future_parent,future_class_attr):
	attrs=((name,value) for name,value in future_class_attr.items() if not name.startwith('__'))
	upperattrs=dict((name.upper(),value)for name,value in attrs)
	return type(future_class_name,future_parents,upperattrs)

__metaclass__ = upper_attr  #  这会作用到这个模块中的所有类

class Foo(object):
    # 我们也可以只在这里定义__metaclass__，这样就只会作用于这个类中
    bar = 'bip'

#测试
print hasattr(Foo, 'bar')
# 输出: False
print hasattr(Foo, 'BAR')
# 输出:True
 
f = Foo()
print f.BAR
# 输出:'bip' 
```

- 使用一个真正的class当做元类

```pyhton
class UpperAttrMetaclass(type):
    def __new__(cls, name, bases, dct):
        attrs = ((name, value) for name, value in dct.items() if not name.startswith('__')
        uppercase_attr  = dict((name.upper(), value) for name, value in attrs)
        return type.__new__(cls, name, bases, uppercase_attr)
```

