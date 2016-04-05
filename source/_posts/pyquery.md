title: pyquery小记
date: 2016-02-28 20:51:24
tags: pyquery
categories: 网页解析
---

pyquery库是jQuery的Python实现，可以用于解析HTML网页内容，使用方法：

```python
from pyquery import PyQuery as pq
```

1. 可加载一段HTML字符串，或一个HTML文件，或是一个url地址，例：

```python
d = pq("<html><title>hello</title></html>")
d = pq(filename=path_to_html_file)
d = pq(url='http://www.baidu.com') # 此处url必须写全
```

<!--more-->

2. `html()` 和 `text()` ——获取相应的HTML块或文本块，例：

```python
p = pq("<head><title>hello</title></head>")
p('head').html()  # 返回<title>hello</title>
p('head').text()  # 返回hello
```

3. 根据HTML标签来获取元素，例：

```python
d = pq('<div><p>test 1</p><p>test 2</p></div>')   
d('p')    # 返回[<p>,<p>]
print d('p')  # 返回<p>test 1</p><p>test 2</p>
print d('p').html()  # 返回test 1
```

注意：当获取到的元素不只一个时，`html()`、`text()`方法只返回首个元素的相应内容块

4. `eq(index)` ——根据给定的索引号得到指定元素

接上例，若想得到第二个p标签内的内容，则可以：

```python
print d('p').eq(1).html()   # 返回test 2
```
5. `filter()` ——根据类名、id名得到指定元素，例：

```python
d = pq("<div><p id='1'>test 1</p><p class='2'>test 2</p></div>")
d('p').filter('#1')   # 返回[<p#1>]
d('p').filter('.2')   # 返回[<p.2>]
```

6. `find()` ——查找嵌套元素，例：

```python
d = pq("<div><p id='1'>test 1</p><p class='2'>test 2</p></div>")
d('div').find('p')   # 返回[<p#1>, <p.2>]
d('div').find('p').eq(0)  #返回[<p#1>]
```

7. 直接根据类名、id名获取元素，例：

```python
d = pq("<div><p id='1'>test 1</p><p class='2'>test 2</p></div>")
d('#1').html() # 返回test 1
d('.2').html() # 返回test 2
```

8. 获取属性值，例：

```python
d = pq("<p id='my_id'><a href='http://hello.com'>hello</a></p>")
d('a').attr('href')  # 返回http://hello.com
d('p').attr('id')  # 返回my_id
```

9. 修改属性值，例：

```python
d('a').attr('href', 'http://baidu.com')
```

10. `addClass(value)` ——为元素添加类，例：

```python
d = pq('<div></div>')
d.addClass('my_class')   # 返回[<div.my_class>]
```

11. `hasClass(name)` #返回判断元素是否包含给定的类，例：

```python
d = pq("<div class='my_class'></div>")
d.hasClass('my_class')   # 返回True
```

12. `children(selector=None)` ——获取子元素，例：

```python
d = pq("<span><p id='1'>hello</p><p id='2'>world</p></span>")
d.children()   # 返回[<p#1>, <p#2>]
d.children('#2')   # 返回[<p#2>]
```

13. `parents(selector=None)`——获取父元素，例：

```python
d = pq("<span><p id='1'>hello</p><p id='2'>world</p></span>")
d('p').parents()    # 返回[<span>]
d('#1').parents('span')   # 返回[<span>]
d('#1').parents('p')   # 返回[]
```

14. `clone()` ——返回一个节点的拷贝
15. `empty()` ——移除节点内容
16. `nextAll(selector=None)` ——返回后面全部的元素块，例：

```python
d = pq("<p id='1'>hello</p><p id='2'>world</p><img scr='' />")
d('p:first').nextAll()   # 返回[<p#2>, <img>]
d('p:last').nextAll()   # 返回[<img>]
```

17. `not_(selector)` ——返回不匹配选择器的元素，例：

```python
d = pq("<p id='1'>test 1</p><p id='2'>test 2</p>")
d('p').not_('#2')    # 返回[<p#1>]
```
