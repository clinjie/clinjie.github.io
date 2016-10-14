title: python-OO相关
date: 2016-1-1 20:43:42
toc: 
tags: python
categories: python
---

杂乱的note：

```python
class Student(object):
    pass
bart = Student()
```
class后面紧接着是类名，即Student，类名通常是大写开头的单词，紧接着是(object)，表示该类是从哪个类继承下来的，继承的概念我们后面再讲，通常，如果没有合适的继承类，就使用object类，这是所有类最终都会继承的类。

可以自由地给一个实例变量绑定属性，比如，给实例bart绑定一个name属性：

```python
bart.name = 'Bart Simpson'
bart.name
#'Bart Simpson'
```

<!--more-->

由于类可以起到模板的作用，因此，可以在创建实例的时候，把一些我们认为必须绑定的属性强制填写进去。通过定义一个特殊的__init__方法，在创建实例的时候，就把name，score等属性绑上去：

```python
class Student(object):

    def __init__(self, name, score):
        self.name = name
        self.score = score
```
注意到__init__方法的第一个参数永远是self，表示创建的实例本身，因此，在__init__方法内部，就可以把各种属性绑定到self，因为self就指向创建的实例本身。

和静态语言不同，Python允许对实例变量绑定任何数据，也就是说，对于两个实例变量，虽然它们都是同一个类的不同实例，但拥有的变量名称都可能不同：

```python
bart = Student('Bart Simpson', 59)
lisa = Student('Lisa Simpson', 87)
bart.age = 8
bart.age
#8
lisa.age
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'age'
```

Student类中模板原件是没有age属性的，bar实例动态增加了这个属性，但是lisa实例依然没有age属性，所以获取此属性是报错

*类属性，是直接定义在class下面的属性，归类本身管理，类中的所有方法都可以对其进行操作访问*

>[更多关于类属性对象属性关系](http://onlypython.group.iteye.com/group/wiki/1357-to-talk-about-the-types-of-properties-in-python-and-examples-of-the-types-of-attributes-the-difference)

在Class内部，可以有属性和方法，而外部代码可以通过直接调用实例变量的方法来操作数据，这样，就隐藏了内部的复杂逻辑。

但是，从前面Student类的定义来看，外部代码还是可以自由地修改一个实例的name、score属性：

```python
bart = Student('Bart Simpson', 98)
bart.score
#98
bart.score = 59
bart.score
#59
```
如果要让内部属性不被外部访问，可以把属性的名称前加上两个下划线__，在Python中，实例的变量名如果以__（两个下划线组成）开头，就变成了一个私有变量（private），只有内部可以访问，外部不能访问，所以，我们把Student类改一改：

```python
class Student(object):

    def __init__(self, name, score):
        self.__name = name
        self.__score = score

    def print_score(self):
        print('%s: %s' % (self.__name, self.__score))
```
改完后，对于外部代码来说，没什么变动，但是已经无法从外部访问实例变量.__name和实例变量.__score了：

```python
bart = Student('Bart Simpson', 98)
bart.__name
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute '__name'
```
这样就确保了外部代码不能随意修改对象内部的状态，这样通过访问限制的保护，代码更加健壮。

需要注意的是，在Python中，变量名类似**__xxx__**的，也就是以双下划线开头，并且以双下划线结尾的，是特殊变量，特殊变量是可以直接访问的，不是private变量，所以，不能用__name__、__score__这样的变量名。

有些时候，你会看到以一个下划线开头的实例变量名，比如**_name**，这样的实例变量外部是可以访问的，但是，按照约定俗成的规定，当你看到这样的变量时，意思就是，“虽然我可以被访问，但是，请把我视为私有变量，不要随意访问”。


双下划线开头的实例变量是不是一定不能从外部访问呢？其实也不是。不能直接访问__name是因为Python解释器对外把__name变量改成了_Student__name，所以，仍然可以通过_Student__name来访问__name变量：

```python
bart._Student__name
'Bart Simpson'
```

下面的做法要注意下：

```python
bart = Student('Bart Simpson', 98)
bart.get_name()
'Bart Simpson'
bart.__name = 'New Name' # 设置__name变量！
bart.__name
'New Name'

'''表面上看，外部代码“成功”地设置了__name变量，但实际上这个__name变量和class内部的__name变量不是一个变量！内部的__name变量已经被Python解释器自动改成了_Student__name，而外部代码给bart新增了一个__name变量'''

bart.get_name() # get_name()内部返回self.__name
'Bart Simpson'
```

# 继承与多态 #

在OOP程序设计中，当我们定义一个class的时候，可以从某个现有的class继承，新的class称为子类（Subclass），而被继承的class称为基类、父类或超类（Base class、Super class）。

比如，我们已经编写了一个名为Animal的class，有一个run()方法可以直接打印：

```python
class Animal(object):
    def run(self):
        print('Animal is running...')
```
当我们需要编写Dog和Cat类时，就可以直接从Animal类继承：

```python
class Dog(Animal):
    pass

class Cat(Animal):
    pass
```
对于Dog来说，Animal就是它的父类，对于Animal来说，Dog就是它的子类。Cat和Dog类似。

继承有什么好处？最大的好处是子类获得了父类的全部功能。由于Animial实现了run()方法，因此，Dog和Cat作为它的子类，什么事也没干，就自动拥有了run()方法

判断一个变量是否是某个类型可以用isinstance()判断

```
a = list() # a是list类型
isinstance(a, list)
#True
```

## 静态vs动态 ##

对于静态语言（例如Java）来说，如果需要传入Animal类型，则传入的对象必须是Animal类型或者它的子类，否则，将无法调用run()方法。

对于Python这样的动态语言来说，则不一定需要传入Animal类型。我们只需要保证传入的对象有一个run()方法就可以了：

```python
class Timer(object):
    def run(self):
        print('Start...')
```
这就是动态语言的“鸭子类型”，它并不要求严格的继承体系，一个对象只要“看起来像鸭子，走起路来像鸭子”，那它就可以被看做是鸭子。


# 一些常用的技巧 #


```python
#获取对象的所有方法和属性
class test:
    pass
print(dir(test()))
#['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__']
```

配合getattr()、setattr()以及hasattr()，我们可以直接操作一个对象的状态：

```python
class MyObject(object):
     def __init__(self):
         self.x = 9
     def power(self):
         return self.x * self.x
obj = MyObject()

hasattr(obj, 'x') # 有属性'x'吗？
#True
obj.x
#9
hasattr(obj, 'y') # 有属性'y'吗？
#False
setattr(obj, 'y', 19) # 设置一个属性'y'
hasattr(obj, 'y') # 有属性'y'吗？
#True
getattr(obj, 'y') # 获取属性'y'
#19
obj.y # 获取属性'y'
#19

#试图获取不存在的属性，会抛出AttributeError的错误

#可以传入一个default参数，如果属性不存在，就返回默认值
getattr(obj, 'z', 404) # 获取属性'z'，如果不存在，返回默认值404
#404

#获得对象的方法

hasattr(obj, 'power') # 有属性'power'吗？
#True
getattr(obj, 'power') # 获取属性'power'
<bound method MyObject.power of <__main__.MyObject object at 0x10077a6a0>>
fn = getattr(obj, 'power') # 获取属性'power'并赋值到变量fn
fn # fn指向obj.power
<bound method MyObject.power of <__main__.MyObject object at 0x10077a6a0>>
fn() # 调用fn()与调用obj.power()是一样的
#81
```


