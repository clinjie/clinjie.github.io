title: xpath笔记
date: 2016-02-28 20:38:23
toc: true
tags: xpath
categories: 网页解析
---

XPath即为XML路径语言，它是一种用来确定XML（标准通用标记语言的子集）文档中某部分位置的语言。XPath基于XML的树状结构，提供在数据结构树中找寻节点的能力。起初 XPath 的提出的初衷是将其作为一个通用的、介于XPointer与XSLT间的语法模型。但是 XPath 很快的被开发者采用来当作小型查询语言。

简单说，xpath就是: 选择XML文件中节点的方法。


所谓节点（node），就是XML文件的最小构成单位，一共分成7种。

- element（元素节点）

<!--more-->
- attribute（属性节点）

- text （文本节点）

- namespace （名称空间节点）

- processing-instruction （处理命令节点）

- comment （注释节点）

- root （根节点）

# xpath表达式的基本格式 #

xpath通过"路径表达式"（Path Expression）来选择节点。在形式上，"路径表达式"与传统的文件系统非常类似.


1. 斜杠（/）作为路径内部的分割符。

2. 同一个节点有绝对路径和相对路径两种写法。

3. 绝对路径（absolute path）必须用"/"起首，后面紧跟根节点，比如/step/step/...。

4. 相对路径（relative path）则是除了绝对路径以外的其他写法，比如 step/step，也就是不使用"/"起首。

5. "."表示当前节点。

6. ".."表示当前节点的父节点


# 选择节点的基本规则 #

- nodename（节点名称）：表示选择该节点的所有子节点

- "/"：表示选择根节点

- "//"：表示选择任意位置的某个节点

- "@"： 表示选择某个属性

# 选择节点的实例 #

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<bookstore>
  <book>
    <title lang="eng">Harry Potter</title>
    <price>29.99</price>
  </book>
  <book>
    <title lang="eng">Learning XML</title>
    <price>39.95</price>
  </book>
</bookstore>
```

1. `bookstore` ：选取 bookstore 元素的所有子节点。

2. `/bookstore` ：选取根节点bookstore，这是绝对路径写法。

3. `bookstore/book` ：选取所有属于 bookstore 的子元素的 book元素，这是相对路径写法。

4. `//book` ：选择所有 book 子元素，而不管它们在文档中的位置。

5. `bookstore//book` ：选择所有属于 bookstore 元素的后代的 book 元素，而不管它们位于 bookstore 之下的什么位置。

6. `//@lang` ：选取所有名为 lang 的属性。

# xpath的谓语条件（Predicate） #

所谓"谓语条件"，就是对路径表达式的附加条件。

所有的条件，都写在方括号"[]"中，表示对节点进行进一步的筛选。


1. `/bookstore/book[1]` ：表示选择bookstore的第一个book子元素。

2. `/bookstore/book[last()]` ：表示选择bookstore的最后一个book子元素。

3. `/bookstore/book[last()-1]` ：表示选择bookstore的倒数第二个book子元素。

4. `/bookstore/book[position()<3]` ：表示选择bookstore的前两个book子元素。

5. `//title[@lang]` ：表示选择所有具有lang属性的title节点。

6. `//title[@lang='eng']` ：表示选择所有lang属性的值等于"eng"的title节点。

7. `/bookstore/book[price]` ：表示选择bookstore的book子元素，且被选中的book元素必须带有price子元素。

8. `/bookstore/book[price>35.00]` ：表示选择bookstore的book子元素，且被选中的book元素的price子元素值必须大于35。

9. `/bookstore/book[price>35.00]/title` ：表示在例14结果集中，选择title子元素。

10. `/bookstore/book/price[.>35.00]` ：表示选择值大于35的"/bookstore/book"的price子元素。

# 通配符 #

- "*"表示匹配任何元素节点。

- "@*"表示匹配任何属性值。

- node()表示匹配任何类型的节点


1. `//*` ：选择文档中的所有元素节点。

2. `/*/*` ：表示选择所有第二层的元素节点。

3. `/bookstore/*` ：表示选择bookstore的所有元素子节点。

4. `//title[@*]` ：表示选择所有带有属性的title元素。

# 选择多个路径 #

用"|"选择多个并列的路径。

1. `//book/title | //book/price` ：表示同时选择book元素的title子元素和price子元素。

