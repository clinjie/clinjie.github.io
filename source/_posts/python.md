title: Python学习(一)
date: 2015-12-20 22:39:55
toc: true
tags: 
- python
categories: python
---

![](http://7xowaa.com1.z0.glb.clouddn.com/python.jpg)

python中的变量也是弱类型，无须使用保留字定义。想要使用的时候，可以直接对他赋值

```
	str='this is a string var example'
	#在python中使用  ‘#’代替其他编程语言中的 ‘//’
```

然后就可以直接对他进行caozu9o，当然如果没有这一步骤，直接使用str会报错。  
之后可以对str进行类型改变。

```
	str=11;
	print(str//2);#对一个数字进行整除操作，可以使用'//'符号进行注释
	#正常的除法操作就可以直接使用'/'
```

Python中十六进制以 "0x"开头，二八进制以"0"开头
<!--more-->

```
	>>>0xAF  
	#175
	>>>010
	#8
```


获取用户输入:  

```
	str=input('please input yput str')
	#当用户在提示下输入信息时候，自动将信息复制给str，python3以上废除raw_inpit
	#输入的信息制动保存为string类型,如果输入的信息为 156
	#str的类型此时就是字符串，如果想要改变成为数字  
	num=int(str)#此时  num即可使用，或者直接使用int(num),但是要注意的是  str的数据类型依然没有改变
```

函数定义:

```  
	def func(str):
		print(str)
	#python中的缩进很重要  在if、else、函数定义、类定义中，都会用一个冒号隔离语句
	#调用如下
	func('hello,python')
```

模块的导入：

```  
	import math
	math.floor(32.9)
	#导入了math模块，同时以正常形式使用math模块下的floor函数，获取参数的四舍五入值
```

也可以进行但函数导入：		

```
	from math import floor
	#此处就可以不加模块名的直接使用floor函数
	floor(445.6)
	#也可以进行如下使用
	from math import floor as func1
	func1(34,7)
	#此时func1==math.floor==(from math import floor之后的)floor
	#或者如下
	func2=math.floor;
	func2(23.45)
```

拼接字符串:

```  
	str1='this is '
	str2='an example'
	print(str1+str2)
	#输出str1的值拼接str2的值，这里是生成一个新的字符串然后返回，而非在str1的基础之上狂冲
	"a"*4
	#输出'aaaa'
```


转换为string  
可以使用str()、repr()两个函数达到这个目的。str会把值转换成为合理形式的字符串，以便用户理解；  
repr()函数会创建一个字符串，以合法的python表达式形式表达值。下面是一些例子:

```
	>>>print(repr('hello'));
	'hello'
	>>>print(repr(1000L));#以L结尾的数字，拜师长整形数，可以表达很大的数字
	1000L
	>>>print(str('hello'));
	hello
	>>>print(str(1000L));
	1000

```

长字符串、原始字符串  

<1>如果需要一个非常长的字符串，可能会跨越多行，可以使用三个引号代替普通引号（单引号、双引号），在一对三引号之间不需要反斜杠转义，直接在里面使用单引号、双引号。

```
	>>>print('''this ''is'' a 'simple' example''');
	#输出如下
	this ''is'' a 'simple' example
```

还有另外一种方法，即在当前行最后一个字符之后添加 \
	
```
	>>>str='this is a \
	...simple \
	...example'
	print(str);
	this is a simple example
	#原理就是将每行最后的换行字符再加上一个反斜杠'\',使忽略这个换行符
```

<2>正常情况下，当你输入

```
	>>>print("C:\test.txt");
	#输出如下
	C:est.txt
	#需要如此使用
	>>>peint("C:\\test.txt");
	C:\test.txt
	#现在你可以使用原始字符串，以  'r'开头
	>>>print(r'C:\test.txt');
	C:\test.txt
	#需要注意的是，不能在原始字符串结尾使用反斜杠'\'
```


序列
===
python中一共包括6种内建序列，列表、元组、字符串、Unicode字符串、buffer对象以及xrange对象。  
列表和元组的主要区别就是：列表可以修改，元组不能。

序列的通用属性:
<1>以索引方式访问

  
```
	tag='hello'
	print(tag[2]);
	#输出索引为2的tag元素
	l
```

<2>分片

```  
	print(tag[2,5]);
	#输出索引2-4的元素  
	llo
	#可以反向输出
	print(tag[::-1]);
	#最后一个参数是步长 步长是-1 则为反向输出
```
  
<3>序列乘法

```  
	tag=['x','y','z'];
	print(tag*3);
	['x','y','z','x','y','z','x','y','z']
	#对于其他类型的序列也适应
```
  
<4>成员资格检查
通过运算符in检验

```
	users=['mlh','foo','bar'];
	#users此时是一个列表
	'mlh' in users
	#输出True
	True
	'xyz' in users
	False
```
 
<5>一些内建函数使用
常用的一些关于序列的内建函数，包括长度、最小值、最大值


```
	number=[100,54,47848];
	len(number);
	#输出序列的长度
	3
	max(number)
	#输出序列中的最大值
	47848
	#同理还有最小值函数min	
	min(number)
	54

```

列表:
---
列表在python中以'[]'这样的形式出现
list函数，将系列转换成为列表

```
	llist=list('hello');
	print(llist);
	['h','e','l','l','o']
```

相反的，可以将序列转换成为字符串
	''.join(llist)
	#此时已经生成一个新的字符串
列表的一些方法:
1)append

```
	1st=[1,2,3]
	1st.append(4);
	1st
	[1,2,3,4]
```

2)count
统计某个元素在列表中出现的次数

```
	>>>['to','x','y','to'].count('to')
	2
```

3)extend
扩展原列表，而非连接操作

```
	a-[1,2,3]
	b=[4,5,6]
	a.extend(b)
	a
	[1,2,3,4,5,6]

```

还有一些其他方法，例如index(某元素)、insert(pos,元素)、pop()、  
remove()、sort()、reverse()、sorted（）...这些函数都可以根据函数名称知道功能

元组
---
元组跟列表很类似，主要区别就是元素不能改变,以"()"隔离
将其他类型的序列转换成为元组:
tuple函数:

```
	tuple([1,2,3]);
	(1,2,3)
```  


字符串
===
字符串的格式化

```
	str="hello , %s"
	print(str % "chuangwailinjie");
	#输出时  %s与   “chuangwailinjie对应”
	hello ,chuangwailinjie
	#另外的形式,以元组形式格式化
	str="hello , %s age is %d"
	tag=('chuangwailinjie',100)
	print(str % tag);
	#元组形式分别匹配
	hello ,chuangwailinjie age 100
```


字符串的一些常用方法:
(1)find
在一个较长的字符串中查找子字符串，返回紫川所在位置的最左端索引  
(2)join
是split()方法的逆方法，用来在队列中添加元素

```
	seq=['1','2','3','4','5'];
	sep='+'
	sep.join(seq)
	'1+2+3+4+5'
	'/'.join(['usr','bin','dev'])
	/usr/bin/dev
```
  
(3)lower  

返回字符串的小写字母版  

(4)replace  

返回某字符串的所有匹配项均被替换之后得到字符串

```
	'this is a test'.replace('is','xyz')
	thxyz xyz a test
```


(5)split

join方法的逆方法，用来将字符串分隔成为序列(列表)

```
	'1+2+3+4+5'.split('+')
	['1','2','3','4','5']
```

字典
===

python中的映射数据结构吗，字典中的值并没有特殊的顺序，但都存储在一个特定的键，键可以使数字、字符串甚至
以'{}'隔离    

```
	phoneBook={'Alice':'2341','Beth':'9102'}
	phoneBook['Alice']
	2341
```

dict函数  

可以使用dict函数，通过其他映射（比如其他字典）或者（键、值）这样的序列构造字典

```
	items=[('name','Gumby'),('age',42)]
	d=dict(items)
	d
	{'age':42,'name':'Gumby'}
```

字典的格式化字符串

```
	template='''<html>
	<head><title>%(title)s</title></head>
	<body>%(text)s</body>
	</html>'''
	data={'title':"My Home Page","text":"Welcome!"};
	print(template % data)
```

**python中的判等**
Python中的对象包含三要素：id、type、value。其中id用来唯一标识一个对象，type标识对象的类型，value是对象的值。  

- 'is'判断的是a对象是否就是b对象，是通过id来判断的
- '=='判断的是a对象的值是否和b对象的值相等，是通过value来判断的


一些迭代工具
===


pass语句  

在python中，如果想要什么都不做（类似其他高级语言中的';'）可以使用pass语句

```
	if（1==1）：
		print("success")
	else : pass
```


----------
## 元组推导式 ##
列表推导式是利用其他列表创建新列表的一种方法。

```
	[x*x for x in range(10)]
	[0,1,4,9,16,25,36,49,64,81]
```

更有趣的使用方法

```
	[x*x for x in range(10) if x 3 ==0]
	[0,9,36,81]
	#可以添加更多for语句的成分
	[(x,y) for x in range(3) for y in range(3)]
	[(0,0),(0,1),(0,2),(1,0),(1,1),(1,2),(2,0),(2,,),(2,2)]
```

可以与 if语句联用
	
```
	girls=['alice','bernice','clarice']
	boys=['chris','arnold','bob']
	[b+'+'g for b in boys for g in girls if b[0]==g[0]]
	#这样就会得到首字母相同的男孩和女孩

```



del语句  

删除不想要使用的变量

```
	x=1
	dex x
	x
	#之后就会报错
```

exec函数  

如果字符串是一个python语句，当我们想要执行它时，可以调用exec(statement)函数

```
	exec('print("hello")')
	hello
```

由于不一定知道字符串中的具体语句会对当前程序造成什么影像，所以exec()函数要慎用

eval函数  

eval()函数可以对想要求值的python表达式求值

	eval('3423+345534*234')
	80858379

方法定义
===

```
	def func(prompts):
	statement
	return
``` 

关键字和默认值:  

python中可以在定义函数的时候进行参数的默认值设置


```
	def func(greeting='hello',name='world'):
	print('%s , %s!' % (greeting,name));

	#此时就可以不加参数的调用
	func()
	hello , world!
	func(greeting='hello',name='www')
	hello , www!
	func('www','hello')
	www , hello!

```

收集参数:  

```
	def func(*params)
	print(params)
	
	#当定义时候，在参数前面加上 * 代表此参数以元组形式存在，并默认手机其他位置的元组参数
	func('1','2','3')
	('1','2','3')
	func()
	#当不提供任何参数时，就是一个空的元组
	()
	
```


处理默认值参数:  

```
	def func(x,y,z=3,*pospar,**keypar):
		print(x,y,z)
		print(pospar)
		print(keypar)
	#两个 '*'在一个参数前面，代表此参数为字典形式，默认收集
	func(1,2,3,5,6,7,foo=1,bar=2)
	#第一行输出x,y,z
	1 2 3
	#第二行输出元组形式
	(5,6,7)
	#第三行输出字典形式
	{'foo':1,'bar':2}

```


python中的作用域

----------
变量在编程语言中，我们可以把他们当做是值的名字。在执行x=1赋值语句之后，名称x引用到值1.像dict一样，键引用值，当然变量所对应的值的引用是个不可见的字典。Python中的内建vars函数可以返回这个字典：

```
x=1
scope=vars()
scope['x']
1
scope['x']+=1
x
2

```
但是，很明显呢，一般情况下这类由vars返回的字典是不能修改的，这里的不可修改即不能在字典中增添、删除变量。   
这类不可见字典就叫做命名空间(namespace)或者作用域(scope),除了整个程序有一个全局的命名空间，每个函数调用都会创建一个新的作用域。


类的使用:
===

```
	#创建一个最简单的类
	class Person:
		def func(self):
	#定义的时候一定要有一个参数 self，类似其他语言的 this
			print('Hello Python!')

	instance=Person();
	instance.func()
	#调用了instance实例的方法
	Hello Python！
	#如果知道instance是Person的一个实例，那么instance.func()==Person.func(instance)
	#因为在原本的定义中就是参数为self，即一个实例，方法与函数的区别就是参数有没有self
```



Python的类中，不支持直接的方法、属性私有化，但是可以在方法、属性的名称前面加上双下划线,使从外部无法直接访问

```
	class Service:
		def __inaccessable(self):
			print("just a test")
		def accessable(self):
			print('this method can use')
			selt.__inaccessable()
	s=Service()
	s.__inaccessable()
	#此时程序会报错
	s.accessable()
	#正常输出
	this mathod can use
	just a test
```  

指定超类:

子类可以扩展超类的定义，将其他类名卸载class语句后的圆括号内就可以指定超类：


```
	class Filter:
		def init(self):
			self.blocked=[]
		def filter(self,sequence):
			return [x for x in sequence if not in self.blocked]

	class SPAMFilter(Filter):
		def init(self):
			self.blocked=['SPAM']

```

SPAMFilter类是Filter类的子类，子类继承父类，并且不用重写不想要overwrite的方法。   

如果想要知道一个类是否是另外一个类的子类，可以使用内建的issubclass函数

```
	issubclass(SPAMFIlter,Filter)
	True
	issubclass(Filter,SPAMFilter)
	False
```

如果想要知道已知类的基类，可以直接使用它的特殊特性 __base__:

```
	SPAMFIlter.__base__
	<class__main__.Filter>
	Filter.__base__
	<class 'object'>
```

python支持多重继承，如下：

```  
	class xyz(filter1,filter):
		def func1(self):
			print("nothing");
```

在这里，类xyz就继承另外两个基类，这里要注意的就是，基类的继承顺序很重要，在括号前面的类与后面的类中如果  

有相同的方法，则前面的类会覆盖后面类的方法.

关于类的一些总结:
---
类：类代表对象的集合（或一类对象），每个对象（实例）都有一个类。类的主要任务是定义它的实例会用到的方法。


对象：对象包括特性和方法。特性只是作为对象的一部分的变量，方法则是存储在对象内的函数。（绑定）方法和  

其他函数的区别在于方法 总是将对象作为自己的第一个参数，一般称为self.

多态：多态是实现将不同类型和类的对象进行同样对待的特性---不需要知道对象属于哪个类就能调用的方法。

封装:对象可以讲他们内部状态隐藏（或者封装）起来。在一些语言中，这意味着对象的状态（特性）只对自己的  

方法可用。

继承：一个类可以是一个或多个类的子类。子类从超类继承所有方法，普通的实现方式是使用核心的超类的一个或者多个混合超类。


Python异常处理
===
python用异常对象来表示异常情况，遇到错误后，会引发异常，如果异常对象并未被处理或者捕捉，成语就会用回溯(Traceback,一种错误信息)终止执行。

与java等其他高级语言类似的是，每个异常都是一些类的实例，这些实例可以被引发，并且可以用很多种方法进行捕捉，使得程序可以捕捉错误并进行处理，而不是让整个程序失败.

(1)raise语句
为了引发异常，可以使用一个类(应该是Exception的子类)或者实例参数调用raise语句。使用类是，程序会自动创建实例。


```
	raise Exception
	Traceback (most recent call last):
  	File "<pyshell#4>", line 1, in <module>
    	raise Exception	
	Exception

	raise Exception('带参数的实例')	
	Traceback (most recent call last):
  	File "<pyshell#5>", line 1, in <module>
    raise Exception('带参数的实例')
	Exception: 带参数的实例
	#与上一个例子不同的就是，此处的Exception带参数，raise语句执行时，自动为期创建一个带参数的Exception实例对象

```

(2)自定义异常类  


	class someCustomeException(Exception):pass

(3)捕捉异常
	
在python中可以使用try/except来实现异常捕捉
	
```
	try:
		x=input('enter the first number: ')
		y=input('enter the second number: ')
		print(int(x)/int(y));
	except ZeroDivisionError:
		print("the second number can't be 0")

	
	enter the first number: 10
	enter the second number: 0
	the second number can't be 0
```

在python中如果没有捕捉异常，他就会将异常反馈至上一层调用他的语句位置，如果在哪里依然没有被捕获，...最终会被反馈到程序的顶层。使用了try/except块之后，即处理了异常，就不会将异常反馈。同样跟java类似的是，python中也有finally语句。

Python魔法方法、特性、迭代器
===
(1)构造方法
当一个对象被创建之后，会立即调用构造方法。python中创建一个类的构造方法很简单，只需要将init方法的名字修改为魔法方法版本__init__即可:

```
	class FooBar:
		def __init(self):
			self.somevar=42
	#与前面提到过的魔法方法相同，以一对儿双下划线包裹函数名即可
```

(2)使用super函数  

当前类和对象可以作为super函数的参数使用，调用函数返回的对象的任何方法都是调用超类的方法，而不是当前类的方法
```

>>> class Bird:
	def __init__(self):
		self.hungry=True;

	def eat(self):
		if self.hungry:
			print("Aaaah....")
			self.hungry=False
		else :
			print('No,thx');

			
>>> class SongBird(Bird):
	def __init__(self):
		super().__init__()
		self.sound='Squawk'
	def sing(self):
		print(self.sound)

		
>>> sb=SongBird()
>>> sb.sing()
Squawk
>>> sb.eat()
Aaaah....
>>> sb.eat()
No,thx

```

(3)静态方法和类方法   

静态方法和类成员方法分别在创建时被装入Staticmethod类型和Classmethod类型的对象中。静态方法中的定义没有self参数，且能够被类本身直接调用。类方法在定义时需要名为cls的类似self的参数，类成员方法可以直接用类的具体对象调用。

```

class MyClass:
	def smeth():
		print('this is a static method')
	#手动包装
	smeth=staticmethod(smeth)
	def cmeth(cls):
		print('this is a class method',cls)
	cmeth=classmethod(cmeth)

	
>>> MyClass.smeth()
this is a static method
>>> MyClass.cmeth()
this is a class method <class '__main__.MyClass'>

```

或者使用自动包装:

```

class MyClass:
	@staticmethod
	def smeth():
		print('this is a static method')
	@classmethod
	def cmeth(cls):
		print('this is a class method',cls)

```
 
(4)迭代器   
在python中可以对除了序列、字典外的其他对象迭代：实现__iter__方法。__iter__方法返回一个迭代器，所谓的迭代器就是具有__next__方法的对象。在调用next方法是，迭代器会返回它的下一个值。如果next方法被调用，但迭代器没有值可以返回，会引发异常。迭代器基于下面两个个方法：
（1）__next__ 返回容器的下一个项目(下一个值)
（2）__iter__ 返回迭代器本身

```

class MyIterator:  
    def __init__(self,step):  
        self.step=step  
      
    def __next__(self):  
        if self.step==0:  
            raise StopIteration  
        self.step-=1  
        return self.step  
      
    def __iter__(self):  
        return self  
      
for i in MyIterator(6):  
    print(i)  

#输出结果
5
4
3
2
1
0

```

```

#斐波那契数列
class Fibs:
	def __init__(self,count):
		self.a=0
		self.b=1
		self.count=count
	def __next__(self):
		self.a=self.b
		self.b=self.a+self.b
		if self.count==0 :raise StopIteration
		self.count-=1
		return self.a
	def __iter__(self):
		return self

fibs=Fibs(10)
list(fibs)
[1, 2, 4, 8, 16, 32, 64, 128, 256, 512]


```

(5)生成器

----------
生成器是一种用普通的函数语法定义的迭代器，任何包含yield语句的函数称为生成器。除了名字不太一样之外，行为业余普通函数有很大差别。它不是向return语句一样返回一个值，而是每次产生多个值。每次产生一个值（使用yield语句），函数就会被冻结：函数停在那点等待激活，函数被激活之后就从停止的那点开始执行。可以通过在生成器上迭代来使用所有的值

```
>>> def flatten(nested):
	for sublist in nested:
		for ele in sublist:
			yield ele

nested=[[1,2,3],[4,6,9,43],[25,456,4234],[12,456,'afsdf','sdfsf']]
>>> list(flatten(nested))
[1, 2, 3, 4, 6, 9, 43, 25, 456, 4234, 12, 456, 'afsdf', 'sdfsf']


```

下面一个例子是使用递归的生成器:

```
>>> def flatten(nested):
	try:
		for sublist in nested:
			for ele in flatten(sublist):
				yield ele
	except TypeError:
		#此时的nested就是一个单元素
		yield nested

#函数可以处理任意层次的序列

list(flatten([[[1,2,3,4],[345,6,7],[23,45,36],[234,2,35]],[[234,645,6],[234,5,3,65],[23,5,534,6,7]],[234,5,6,6],[[234,5,6,7],[423,5],[23,55,6]]]))
[1, 2, 3, 4, 345, 6, 7, 23, 45, 36, 234, 2, 35, 234, 645, 6, 234, 5, 3, 65, 23, 5, 534, 6, 7, 234, 5, 6, 6, 234, 5, 6, 7, 423, 5, 23, 55, 6]


```
当flatten被调用时候，有两种情况，基本元素和需要递归情况。基本情况时，函数被告知展开一个元素，for循环会引发一个TyprError异常（因为试图对一个单元素展开），生成器会产生一个元素（从except那里产生一个元素后，直接返回到上一层）


通用生成器
---
生成器是一个包含yield关键字的函数，当他被调用的时候，函数中的代码不会执行，而是返回一个迭代器。每次请求一个值，就会执行生成器的代码，直到遇到yield语句或者return语句。yield语句即生成一个值，而return意味着停止执行（return语句只有在一个生成器中使用时才能进行无参调用）  

所以可以看出来，生成器是由两部分组成的，生成器的函数和生成器的迭代器。生成器的函数是用def语句定义，包含yeld的部分，生成器的迭代器是这个函数的返回部分。

生成器的方法:
(1)__next__   
外部作用域访问生成器的初设值
(2)send
使用send方法，就像访问__next__方法一样，只不过前者使用一个参数，参数是要发送的消息,当想要使用send方法时，必须是生成器已经被挂起，即yield表达式被执行之后（可以使用__next__()函数之后调用）.  
(3)throw方法
使用异常类型调用，用于在生成器（yield表达式）引发一个异常
(4)close方法
停止生成器

```

def repeater(value):
	while True:
		new = (yield value)
		if new is not None: value=new
r=repeter(42)
r.next()
#输出
42
r.send('value')
#输出
value

```


模块
===
任何一个Python成语都可以作为模块导入,加入你写了一个如下的代码，并且命名为hello.py

```
	#hello.py
	print('Hello ,Python')
```

程序保存在磁盘的摸个位置上，如C:\python_module,那么可以执行下列代码，将这个路径追加到python的搜索目录中，这样python在导入module的时候会自动搜索用户目录下的文件民

```
	import sys
	sys.path.append('C:/python_module')
	import hello
	Hello ,Python
```

第一次导入时，他会执行导入的module，当再次重复导入时，默认是不再执行。当然可以使用reload函数达到在此执行的效果。导入多次可能会造成一些问题，module一般是用作定义使用，所以一次导入就能达到此目的


```
	#hello.py
	def hello():
		print('Hello,Python!')
	
	
	import hello
	hello.hello()
	Hello,Python!
```

每个python文件都可以当做一个module，可能会出现两种身份，当你正在使用时，他们的身份是 '__main__'，而当做module导入到其他程序时候，查看发现是 __文件名__

```
	__name__
	'__main__'
	import math
	#math.py
	math.__name__
	'math'
	import hello
	#hello.py
	hello.__name__
	'hello'
```

当我们知道了这个特性之后，就可以通过简单的判断在module中添加测试片段，当正常使用时执行，而当做导入module时就跳过

```

#hello.py
def hello():
	print('Hello,Python!')
def test():
	hele();

#当正常使用时，就测试方法是否可用，否则只是当做函数定义
if __name__=='__main__':
	test()

```
	

Package包
---
wie为了组织好模块，可以将他们分组为包package。包也是另外一种模块，但是可以包含另外的模块。当模块存储在文件中的时候，（扩展名 .py
）包就是模块所在的目录，为了让Python将其作为包对待，必须包含一个命名为__init__.py的文件（模块）.如果将它作为普通模块导入的时候，文件的内容就是包得内容。假设有一个名为 constants的包，文件constant/__init__.py包括语句 PI=3.14,可以如下使用
	
```
	import contant
	print(constant.PI)
	#当你的constant包下面有colors.py这个文件
	import constant.color
```


fileinput 模块
---

fileinput模块可以能够轻松的遍历文本文件的所有行。

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_fileinput.PNG)

fileinput.input是上面最重要的函数，会返回能够用于for循环遍历的对象。如果不想使用默认行为(fileinput查找需要循环遍历的文件)，可以给函数提供（序列形式的）一个或多个文件名。可以将inplace参数设为真值(inplace=True)以进行原地处理。对于要访问的每一行，需要打印出替代的内容，以返回到当前的输入文件中。

fileinput.lineno返回当前行的行数，数值是累计的，所以在完成一个文件的处理并且开始处理下一个文件时，行数并不会重置。


下面是一个简单的案例:
```

#hello.py
import fileinput

for line in fileinput.input(inplace=True):
	line=line.rstrip()
	no=fileinput.lineno()
	print('%-60s # %2i' % (line,no))       


```


当我们在终端测试时，结果如下:


```
#第一个是要解释的源文件，第二个参数是fileinput.input的文件参数
python hello.py hello.py

#hello.py的文件变成如下，因为使用了inplace=True参数，所以直接改变了文件

import fileinput                                             #  1
                                                             #  2
for line in fileinput.input(inplace=True):                   #  3
	line=line.rstrip()                                          #  4
	no=fileinput.lineno()                                       #  5
	print('%-60s # %2i' % (line,no))                            #  6


```


----------

一些常用的数据结构
---

集合Set
---
集合位于sets模块中，与数学对应的是数值的唯一性，所以插入多个相同的值时过滤的.

```
	set(range(10))
	{0,1,2,3,4,5,6,7,8,9}
```

集合是由序列构建的，主要用于检查成员的资格，因此副本是被忽略的，同时根据数学中集合的特性无序性，集合中元素的顺序是随意的。

```
	set(['hell','hiil','hiahia'])
	{'hiil','hell','hiahia'}
```

集合的一些常用方法：  

```

a=set([1,2,3])
b=set([2,3,4])
c=a&b
#集合之间的并集
a.union(b)
#输出
{1,2,3,4}
a|b
#输出
{1,2,3,4}
#集合之间的交集
a.intersection(b)
#输出
{2,3}
a&b
#输出
{2,3}
#判断集合是否是子集
c.issubset(a)
True
a.issubset(c)
False
c <= a
True
#判断是否是超集
a.issuperset(c)
True
a >= c
True
#获取两集合差集
a.difference(b)
{1}
b.difference(a)
{4}
a-b
{1}
b-a
{4}
#获取两集合非交集的并集
a.symmetric_difference(b)
{1,4}
b^a
{1,4}

```


堆heap
---
对是优先队列的一种，使用优先队列能够以任一顺序增加对象，并能在任何时候找到最小的元素，对比来讲，比列表的min函数效率要高一些。  

heap在Python的heapq模块中，包括6个函数：
![](http://7xowaa.com1.z0.glb.clouddn.com/heap.jpg)

上图中的前4个方法都比较简单易懂，后两个方法:   
nlargest(n,iter)和nsmallest(n,iter)分别用来寻找任何可以迭代对象iter中第n大或第n小的元素.

双端队列
---

双端队列(deque)在需要按照元素增加的顺序来移除元素时非常有用，deque在模块collections中。

```

from collections import deque
q=deque(range(5))
print(q)
#输出
[0,1,2,3,4]
q.append(5)
print(q)
[0,1,2,3,4,5]
q.appendleft(6)
[6,0,1,2,3,4,5]
#同理还有q.pop()、q.popleft
q.rotate(2)
#rotate相当于右移功能
print(q)
[4,5,6,0,1,2,3]
q.rotate(-1)
print(q)
[5,6,0,1,2,3,4]

```


time模块
---

time模块包含的函数包含以下功能:
- 获取当前时间  
- 操作时间和日期  
- 从字符串读取时间  
- 格式化时间为字符串

![](http://7xowaa.com1.z0.glb.clouddn.com/time.PNG)


比如元组:
	(2016,1,21,12,2,56,0,21,0)
表示2016年1月21日12时2分56秒，星期一，并且是当年的第21天


![](http://7xowaa.com1.z0.glb.clouddn.com/time_func.jpg)

可以看出来，asctime()函数与strptime(string[,format])函数时相反的功能  
而localtime([secs])（或者获取全球统一时间的gtime([secs])）与mktime(tuple)功能相反


random模块
---

这里先说一下伪随机与真随机的区别:   

真正意义上的随机数（或者随机事件）在某次产生过程中是按照实验过程中表现的分布概率随机产生的，其结果是不可预测的，是不可见的。而计算机中的随机函数是按照一定算法模拟产生的，其结果是确定的，是可见的。我们可以这样认为这个可预见的结果其出现的概率是100%。所以用计算机随机函数所产生的“随机数”并不随机，是伪随机数。

当然了，在python中使用random模块的普通功能生成的数字都是伪随机数，这在一般情况下是够用了，如果想要体验真的随机性，应该使用os模块的urandom函数或者random模块的SystemRandom类，让数据接近真的随机性.


![](http://7xowaa.com1.z0.glb.clouddn.com/random.jpg)

getrandbits(n)以长整形形式返回给定的位数，输出时转换成为10进制数

uniform提供来年各个数值参数a、b，他会返回在a~b随机实数n

randrange能够产生该范围内的随机数。randrange(1,20,2)会产生小于20的随机正奇数


shelve模块
---

如果只需要一个简单的存储方案，shelve模块可以满足大部分的需要，所需要的只是为他提供文件名。通过open函数，获取Shelf对象，将它当做字典的handle适应，而且键值必须为字符串。使用之后用close()关闭

```

import shelve
s=shelve.open('test')
s[x]=['a','b','c']
s.close()
#这样，test.dat文件就自动保存在当前的工作目录下

```

当再次想要获取数据时:

```

file=shelve.open('test')
print(file['x'])
#输出
['a','b','c']

```


re模块（regular expression）
---
re即regular expression，正则表达式，关于正则表达式的通用知识可以浏览我的[csdn blog](http://blog.csdn.net/peihaozhu/article/details/50297249)。

因为在正则表达式中会使用大量的转义字符，所以在python中使用原始字符串显然是一个不错的解决方案,在想要使用的字符串之前加上'r'即可.

正常情况下，要匹配python.org这个字符串可以使用如下:

```

	#字符串中，一个反斜杠代表转义字符，而在正则表达式中，'.'是特殊字符，需要转义，所以要实现一个反斜杠，在字符串中就是两个反斜杠
	'pyhton\\.org'
	#使用原始字符串之后就很清晰了
	r'python\.org'

```

----------


下面是python中re模块为我们提供的一些常用函数：


![](http://7xowaa.com1.z0.glb.clouddn.com/regular.PNG)


函数re.compile将正则表达式(以字符串书写的)转换成模式对象，可以实现更有效率的匹配。如果在调用search或者match函数的时候使用字符串表示的正则表达式时，他们也会在内部将字符串转换成为正则表达式对象。使用compile一次转换后就不用多次在内部转换。模式对象本身也有方法.

```
pattern=re.compile(str_expr)
#pattern是正则表达式对象
re.search(pattern,string)
pattern.search(string)
#以上两个语句是等价的

```

函数re.search会在给定字符串中寻找第一个匹配给定正则表达式的子字符串。一旦找到子字符串，函数就会返回MatchObject,根据Python的规则，if语句当做True，否则返回None（当做False）


函数re.match会在给定字符串的开头匹配正则表达式，因此看如下两个语句:

```
re.match('p','python')
#匹配成功
re.match('p','www.python.org')
#匹配失败

```

如果要使用match匹配整个字符串，可以再模式的结尾加上美元符号（即末尾匹配标志），美元符号会对字符串的末尾进行匹配，从而顺延了整个字符串的匹配。


函数re.split会根据模式的匹配项来分割字符串，它类似与字符串方法split，不过是用完整的正则表达式代替固定的分割字符串。

```
some_text='alpha, beta,,,,gamma delta'
re.split('[, ]+',some_text)
['alpha','beta','gamma','delta']
#maxsplit参数表示字符串最多可以分割的部分
re.split('[, ]+',some_text,maxsplit=2)
['alpha','beta','gamma    delta']
re.split('[, ]+',some_text,maxsplit=1)
['alpha','beta,,,,gamma   delta']

```

函数re.findall以列表形式返回给定模式的所有匹配项

```

pat='[a-zA-a]'
#匹配所有英文字母
text='abcd456efg67hijk4579lmn'
re.findall(pat,text)
['abcd','efg','hijk','lmn']

```

re.escape是一个很实用的函数，它可以对字符串中所有可能被解释为正则运算符的字符进行转义的应用函数。如果字符串很长而且包含很多特殊字符，而又不想输入一大堆反斜杠，切这部分要用作正则表达式的一部分，可以使用这个函数。

```

re.escape('www.python.org')
'www\\.python\\.org'
re,escape('But where is the ambiguity')
'But\\ where\\ is\\ the\\ ambiguity\\'

```

匹配对象和组

----------
对于re模块中那些能够对字符串模式匹配的函数而言，当能够找到匹配项的时候，他们都会返回MatchObject对象。这些对象包括匹配模式的子字符串的信息，以及哪个模式匹配了子字符串哪部分的信息，，这些称为组（group）

简而言之，组就是防止在圆括号内的子模式。组的序号取决于它左侧的括号数目。组0就是整个模式。如下:

```

'There (was a (wee)(cooper) who (lived in Fyfe)) '

```

包含以下这些组
0. There was a wee cooper who lived Fyfe
1. was a wee cooper
2. wee 
3. cooper
4. lived in Fyfe 

再比如下面的模式:


```

r'www\.(.+)\.com$'

``` 
组0包含整个字符串，而组1包含位于'www.'和'com'之间的所有内容。这样创建的话，就能取出字符串中感兴趣的部分了。re匹配对象(MatchObject)的一些重要方法：


![](http://7xowaa.com1.z0.glb.clouddn.com/reobject.jpg)


group方法返回模式中与给定组匹配的子字符串，默认组为0。如果给定一个组号会返回单个字符串，否则会将对应给定组数的字符串作为元组返回。

start方法返回给定组匹配项的开始索引(默认为0，即整个模式)

方法end类似于start，但是返回结果是结束索引加1

方法span以元组(start,end)的形式返回给定组的开始和结束位置的索引  


```

import re
m=re.match(r'www\.(.*)\..{3}','www.python.org')
m.group(1)
'python'
m.start(1)
4
m.end(1)
10
m.span(1)
(4, 10)
 
```


什么是正则表达式的贪婪与非贪婪匹配  

　　如：


```
String str="abcaxc";

Patter p="ab*c";

```

　
- 贪婪匹配:正则表达式一般趋向于最大长度匹配，也就是所谓的贪婪匹配。如上面使用模式p匹配字符串str，结果就是匹配到：abcaxc(ab*c)。
　　
- 非贪婪匹配：就是匹配到结果就好，就少的匹配字符。如上面使用模式p匹配字符串str，结果就是匹配到：abc(ab*c)。


通过re表达式实现简单的邮件人过滤:

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_email.jpg)

寻找这封信的发件人:

```
#hello.py
import re,fileinput

#为了直接在结果中显示发件人，所以在模式中将所需信息用圆括号扩住，这样就可以通过组方便的取出
pat=re.compile('From: (.*)<.*?>$')
for line in fileinput.input():
	m=pat.match(line)
	if m:
		print(m.group(1))

#结果
python hello.py data.txt
Foo Fie

```

寻找这封信中所有的邮箱地址，并列出来

```
import re,fileinput

#忽略大小写
pat=re.compile(r'[a-z\-\.]+@[a-z\-\.]+',re.IGNORECASE)

#创建集合
addresses=set()
for line in fileinput.input():
	for address in pat.findall(line):
		addresses.add(address)
	for address in sorted(addresses):
		print(address)

#进行测试

python hello.py data.txt

Mr.Gumby@bar.baz
foo@bar.baz
foo.baz.com
magnus@bozz.floop

```


下面是一个简单但是经典模板匹配:

```
import fileinput,re

#要匹配的是一个方括号括起来的表达式，在模式中用括号圈出来组1
field_pat = re.compile(r'\[(.+?)\]')

#将变量收集到这里
scope=dict()

#应用在re.sub替换
def replacement(match):

	#获取表达式
	code = match.group(1)
	try:
		return str(eval(code,scope))
	except SyntaxError:
		#否则执行相同作用域内的赋值语句
		exec(code,scope)
		return ''

#将需要替换的文本以一个字符串的形式获取
lines=''

for line in fileinput.input(r'.\data.txt'):
	lines+=line
#将序列转换成为字符串
#text=''.join(lines)

#将field模式的所有匹配项都替换
print(field_pat.sub(replacement,lines))


如果要替换的文本是如下
[x=2]
[y=3]

The sum of [x] and [y] is [x+y].

运行的结果是:

The sum of 2 and 3 is 5.

```

这里要注意的是，data.txt文件的格式要为utf-8无BOM格式或者ansi编码，Python默认的编码格式为utf-8，否则会无法解析

更多的例子解析，可以查看我的另一篇杂文，[正则表达式简单应用](/2015/12/24/re/).

