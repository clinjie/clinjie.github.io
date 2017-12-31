title: 正则表达式简单应用
date: 2015-12-24 16:36:28
tags: 
- python
- 正则表达式
categories: python
---

re即regular expression，正则表达式，关于正则表达式的通用知识可以浏览我的[csdn blog](http://blog.csdn.net/peihaozhu/article/details/50297249)。通过正则表达式，我们可以很轻松的过滤获取到需要的信息，然后对这些信息进行操作。

![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_re.jpg)

<!--more-->


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

在扩展，由于Python中fileinput模块的强大性，我们可以一次性输入多个文件进行解析，而且解析的顺序跟我们输入的文件参数顺序一致。这样我们就可以很轻松的吧文章的模板与我们需要替换的内容分离，分别写入两个文件，让python先解析变量定义文件，这样就可以达到同样的目的，而且更符合我们的使用习惯。

```
#python源码是没有改变的，只是把for line in fileinput.input(r'.\data.txt'):
#这条语句改为  for line in fileinput.input():
#改为我们在运行解释的时候手动输入文件名


#变量定义文件 define.txt
[name='chuangwailinjie']
[email='peihaozhu@xyz.com']
[language='python']

#模板定义文件template.txt
[import time]
Dear [name]

I would like to learn how to program. I hear you use the [language] language a lot--
is it sth I should consider?

And,by the way, is [email] your correct email address/

chuangwailinjie,[time.asctime()]


#在终端中输入命令:
$ python hello.py define.txt template.txt



Dear chuangwailinjie

I would like to learn how to program. I hear you use the python language a lot--

is it sth I should consider?

And,by the way, is peihaozhu@xyz.com your correct email address/

chuangwailinjie,Thu Dec 24 16:49:26 2015



```