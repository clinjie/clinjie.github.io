title: Selenium模拟测试教务数据
date: 2016-02-27 22:23:35
tags: Python
toc: true
categories: Python 
---

# 前言 #

![](http://img2.shangxueba.com/img/kaifa/20140904/11/8A6D1AC6AF702711BA356BF52388C639.png)

Selenium是什么，看看Encyclopedia上的说明：

*Selenium是一个用于Web应用程序测试的工具。Selenium测试直接运行在浏览器中，就像真正的用户在操作一样。支持的浏览器包括IE(7、8、9)、Mozilla Firefox、Mozilla Suite、Google Chrome等。这个工具的主要功能包括：测试与浏览器的兼容性——测试你的应用程序看是否能够很好得工作在不同浏览器和操作系统之上。测试系统功能——创建回归测试检验软件功能和用户需求。支持自动录制动作和自动生成 .Net、Java、Perl等不同语言的测试脚本。Selenium 是ThoughtWorks专门为Web应用程序编写的一个验收测试工具。*

简单地说，Selenium就是一个通过执行预先设置的Browser的指令，解放双手，提高工作效率。

<!--more-->

最近在无聊实现爬虫的时候，有些地方害苦了我。我们都知道，很多网页是通过JS行为动态变化了，网页内容并不是一成不变的。当我依然使用传统的爬虫方法直接解析返回的Response，显而易见是失败的，经常提示丢失用户信息等错误。

很明显，可以通过解析JS操作。

通过各大浏览器提供的工具、扩展等虽然都可以从茫茫数据中异步获取所需的json、jsonp数据，但是如果每次爬虫都要如此，对我而言实在是太累了，所以呢，使用Selenium呗。


# Selenium安装 #

## server的安装 ##

Python直接在终端使用`pip install -u`命令安装，如果想要替换默认的Pyhton安装版本，cd到想要使用的目录Scripts下。比如我通常使用Python版本是py3.x，现在想要暂时换到py2.x下：

`C:/Python27/Scripts/pip.exe install -u selenium`

注意在终端中使用的分隔符，Win平台下的目录系统分隔符`'\'`在终端中很可能不奏效，建议使用转义字符`'\\'`或者通用的`'/'`。

之后就是browser driver的安装;

## 安装browser driver ##

Selenium在PC平台上提供IE、Chrome、Firefox、Opera等真实浏览器的支持，以及PhantomJS、HtmlUnit等伪浏览器。其中FireFox、Safari、HtmlUnit都已经包含在webdriver包里面（遗憾的是由于HtmlUnit是Pure Java编写，不支持Pyhton平台），而其余的需要选择需要的driver下载。

- chromedriver[戳这里](http://vdisk.weibo.com/s/GLALSq503hN1?category_id=0&parents_ref=GLALSq503hML)

- Iedriver[戳这里](http://vdisk.weibo.com/s/GLALSq503hMK?category_id=0&parents_ref=GLALSq503hML)


- Operadriver[戳这里](https://github.com/operasoftware/operachromiumdriver/releases)

- PhantomJS[戳这里](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-windows.zip)

下载完成后，尝试运行，会发现无法正常使用。现在，你就把这个可执行程序移动到Python的环境变量中，使pyhton可以扫描到。

# Selenium的简单语法 #

- 输入框（text field or textarea）

```python
 #找到输入框元素：
element = driver.findElement(By.id("passwd-id"))
 #将输入框清空：
element.clear()
 #在输入框中输入内容：
element.sendKeys(“test”)
 #获取输入框的文本内容：
element.getText()
```

- 下拉选择框(Select)

```python
 #找到下拉选择框的元素：
select = driver.findElement(By.id("select"))
 
 #选择对应的选择项：
select.selectByVisibleText(“mediaAgencyA”)
 #或
select.selectByValue(“MA_ID_001”)
 
 #不选择对应的选择项：
select.deselectAll()
select.deselectByValue(“MA_ID_001”)
select.deselectByVisibleText(“mediaAgencyA”)
 #或者获取选择项的值：
select.getAllSelectedOptions()
select.getFirstSelectedOption()
```

**Tips:**

对下拉框进行操作时首先要定位到这个下拉框,然后对它进行操作

- 单选项(Radio Button)

```python
 #找到单选框元素：
bookMode =driver.findElement(By.id("BookMode"))
 #选择某个单选项：
bookMode.click()
 #清空某个单选项：
bookMode.clear()
 #判断某个单选项是否已经被选择
bookMode.isSelected()
```

- 多选项(checkbox)

```python
 #多选项的操作和单选的差不多：
checkbox =driver.findElement(By.id("myCheckbox."))
checkbox.click()
checkbox.clear()
checkbox.isSelected()
checkbox.isEnabled()
```

- 按钮(button)

```python
 #找到按钮元素：
saveButton = driver.findElement(By.id("save"))
 #点击按钮：
saveButton.click()
 #判断按钮是否enable:
saveButton.isEnabled ()
```
- 左右选择框
也就是左边是可供选择项，选择后移动到右边的框中，反之亦然。

```payhon
lang = new Select(driver.findElement(By.id("languages")))
lang.selectByVisibleText(“English”)
addLanguage =driver.findElement(By.id("addButton"))
addLanguage.click()
```

- 弹出对话框(Popup dialogs)

```python
alert = driver.switchTo().alert()
alert.accept()
alert.dismiss()
alert.getText()
```

- 表单(Form)
Form中的元素的操作和其它的元素操作一样，对元素操作完成后对表单的提交可以：

```python
approve = driver.findElement(By.id("approve"))
approve.click()
 #或者
approve.submit();//只适合于表单的提交
```

- 上传文件 (Upload File)
上传文件的元素操作：

```python
adFileUpload = driver.findElement(By.id("WAP-upload"))
String filePath = "C:\test\\uploadfile\\media_ads\\test.jpg"
adFileUpload.sendKeys(filePath)
```

- 导航 (Navigationand History)

```python
 #打开一个新的页面：
 driver.navigate().to("http://www.example.com")
 #通过历史导航返回原页面：
driver.navigate().forward()
driver.navigate().back()
```


- 获取页面CSS属性

```python
 #获取文字颜色
dr.findElement(By.id("tooltip")).getCssValue("color")
 #获取文字字号
dr.findElement(By.tagName("h3")).getCssValue("font")
```

# 爬虫 #

这次要爬虫的页面是一个教务管理系统,有着超级丑的界面，登录页面有三个信息需要我们了解，

![](http://7xowaa.com1.z0.glb.clouddn.com/selenuim_page.png)

- 用户类型--radio
- 用户名--input
- 密码--input

当我们输入正确的信息，选择合适的类型之后提交表格到验证页面，就可以返回用户的个人信息界面。

```python
from selenium import webdriver

c = webdriver.Chrome() # Get local session of chrome
c.get(your_url) # Load page
 #定位到用户元素  通过Xpath，通过chrome的审查元素可以直接复制
ele=c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[2]/td[2]/input')
 #直接send_key相当于append，容易忽略掉默认的hint
ele.clear()
ele.send_keys('******')
 #定位到密码元素
passwd=c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[3]/td[2]/input')
passwd.clear()
passwd.send_keys('******')
 #定位到用户类型单选并选择
c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[1]/td[1]/input').click()
 #定位到表单提交按钮
submit=c.find_element_by_class_name('button03')
submit.submit()#或者也可以用  submit.click()
```

如果没有失误，已经到了个人用户界面。最麻烦的就是这里，因为他是框架套框架，我们需要获取的框架的上一层还无法定位。

```html
<frameset framespacing="0" border="0" rows="100,*" frameborder="0" oncontextmenu="return false" oncopy="document.selection.empty()">
  <frame name="banner" scrolling="no" noresize target="contents" src="s_top.htm">
  <frameset cols="130,*">
    <frame name="contents" target="main" src="../scripts/tree.asp" scrolling="auto" style="background-color: #FFFF66" noresize>
    <frame name="main" src="../asp/s_welcome.asp">
  </frameset>
  <noframes>
  <body topmargin="0" leftmargin="0">

  <p>此网页使用了框架，但您的浏览器不支持框架。</p>

  </body>
  </noframes>
</frameset>
```

在Selenium中如果想要定位元素，首要的是你要在当前框架内，Selenium要一步步的切换框架。

`c.switch_to.frame(frame.id or frame.name)`

不能直接跳步进入最后的框架，这里我们要进入的框架是`'contents'`，最终，我讨巧使用get方式直接获取这个框架的源文件。因为这里的上下文信息（context）完全一样，我们使用get相当于将这个框架刷新一遍而已。

get这个框架之后，就可以继续进行元素的定位blablabla~~~~

这是完整的代码:

```python

from selenium import webdriver

c = webdriver.PhantomJS() # Get local session of firefox
c.get("http://222.195.8.201/") # Load page
ele=c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[2]/td[2]/input')
ele.clear()
ele.send_keys('********')
passwd=c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[3]/td[2]/input')
passwd.clear()
passwd.send_keys('********')
c.find_element_by_xpath('//*[@id="__01"]/tbody/tr[2]/td[2]/form/div/table/tbody/tr[1]/td[1]/input').click()
submit=c.find_element_by_class_name('button03')
submit.submit()
c.get('http://222.195.8.201/student/scripts/tree.asp')
#c.find_element_by_xpath('/html/body/table/tbody/tr[9]/td/input').click()
c.get('http://222.195.8.201/student/asp/Select_Success.asp')
content=c.find_element_by_xpath('/html/body/table/tbody').text

items=content.split('\n')
for i in  range(0,len(items)-1):
    item=items[i].split(' ')
    print(item[2],item[4],item[5])
```

尝试使用了多种的Browser Driver测试，在相同的网络环境下，同样的任务，PhantomJS速度最快、其次是Chrome，而FireFox简直感人.. 就这个例子来讲，PhantomJS因为不需要真实的浏览器在前端加载CSS等信息，只是纯粹的模拟运行，时间上只用了3.7s；Chrome虽然是一个完整的实例运行，速度也是相当不错，7s左右，Firefox要20+....

**END**