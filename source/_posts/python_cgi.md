title: Python CGI初体验
date: 2016-1-25 16:36:28
toc: true
tags: 
- cgi
- python
categories: python
---

# CGI小述 #

CGI（Common Gateway Interface,通用网页接口）。CGI是网络服务器可以将查询（一般来说是通过Web表单）传递到专门的程序（比如Python等）中并且在网页上显示结果的标准机制。它是创建万维网应用程序而不用编写特殊用途的应用服务器的简单方法。  

CGI(Common Gateway Interface) 是WWW技术中最重要的技术之一，有着不可替代的重要地位。CGI是外部应用程序（CGI程序）与Web服务器之间的接口标准，是在CGI程序和Web服务器之间传递信息的规程。CGI规范允许Web服务器执行外部程序，并将它们的输出发送给Web浏览器，CGI将Web的一组简单的静态超媒体文档变成一个完整的新的交互式媒体。
Common Gateway Interface，简称CGI。在物理上是一段程序，运行在服务器上，提供同客户端HTML页面的接口。这样说大概还不好理解。那么我们看一个实际例子：现在的个人主页上大部分都有一个留言本。留言本的工作是这样的：先由用户在客户端输入一些信息，如名字之类的东西。接着用户按一下“留言”（到目前为止工作都在客户端），浏览器把这些信息传送到服务器的CGI目录下特定的CGI程序中，于是CGI程序在服务器上按照预定的方法进行处理。在本例中就是把用户提交的信息存入指定的文件中。然后CGI程序给客户端发送一个信息，表示请求的任务已经结束。此时用户在浏览器里将看到“留言结束”的字样。整个过程结束。

绝大多数的CGI程序被用来解释处理来自表单的输入信息，并在服务器产生相应的处理，或将相应的信息反馈给浏览器。CGI程序使网页具有交互功能。   

Python CGI程序设计的关键工具是cgi、cgitb模块。

<!--more-->

# 实现 #

----------

## 处理步骤 ##

1. 通过Internet把用户请求送到web服务器。
2. web服务器接收用户请求并交给CGI程序处理。
3. CGI程序把处理结果传送给web服务器。
4. web服务器把结果送回到用户。   

CGI程序不是放在服务器上就能顺利运行，如果要想使其在服务器上顺利的运行并准确的处理用户的请求，则须对所使用的服务器进行必要的设置。
配置：根据所使用的服务器类型以及它的设置把CGI程序放在某一特定的目录中或使其带有特定的扩展名。

## 工作原理 ##

1. 浏览器通过HTML表单或超链接请求指向一个CGI应用程序的URL。
2. 服务器收发到请求。
3. 服务器执行指定CGI应用程序。
4. CGI应用程序执行所需要的操作，通常是基于浏览者输入的内容。
5. CGI应用程序把结果格式化为网络服务器和浏览器能够理解的文档（通常是HTML网页）。
6. 网络服务器把结果返回到浏览器中。


----------

## 服务器设置 ##

CGI是运行在服务器端的，所以与服务器的接触在所难免。    

Apache是web服务器，Tomcat是应用（java）服务器，它只是一个servlet容器，是Apache的扩展。 Apache和Tomcat都可以做为独立的web服务器来运行，但是Apache不能解释java程序（jsp,servlet）。
两者都是一种容器，只不过发布的东西不同：Apache是html容器，功能像IIS一样；Tomcat是jsp/servlet容器，用于发布jsp及java的，类似的有IBM的websphere、BEA的Weblogic，sun的JRun等等。
打个比方：Apache是一辆卡车，上面可以装一些东西如html等。但是不能装水，要装水必须要有容器（桶），Tomcat就是一个桶（装像Java这样的水），而这个桶也可以不放在卡车上。   

1. CGI程序应该放在通过网络可以访问的目录中，并且将他们标识为CGI脚本，这样网络服务器就不会将普通源代码作为网页处理。


- 将脚本放在叫做cgi-bin的子目录中.

- 将脚本文件的扩展名改为.cgi. 


2. 当把脚本放在正确位置之后，需要在脚本的开始处增加pound bang行。这一步是至关重要的，如果没要这行标识，网络服务器就不知道如何执行脚本。脚本可以用其他语言来写，比如Perl、Ruby。一般来讲，只要加上这句

```
#!/usr/bin/env python
```

这一这行文字是以UNIX风格填写的，前面无空行、结尾以'\n'而非'\r\n'.在Windows中，可以使用Python二进制版本的全路径：

```
#!C:\Python34\python.exe
```


3. 要做的最后一件事情就是这只合适的文件许可。确保每个人都可以读取和执行脚本文件，同时要确保这个文件只能由你写入。（就是在Linux中修改文件的权限）修改文件许可的Linux命令式chmod，只要运行下列命令

```	
chmod 755 somescript.cgi
```

即将文件权限设置为只能由本用户全部操作，而用户组以及其他用户只享有r、w权限，无x执行权限。在做好这些准备之后，应该能够将脚本作为网页打开、执行。

```
#!C:\Python34\python.exe 
   
print('Content-type: text/html')
print()#打印空行以结束首部

print("""<html>
<body>
<h1>Hello,Python</h1>
</body>
</html>
""")
```

下面分别来介绍Apache与Tomcat两种服务器上运行CGI。  

## Apache ##   

1. 打开http.conf，找到 #ScriptInterpreterSource Registry，把前面的#去掉。如果没有找到这句话，则自行添加。

2. 找到AddHandler cgi-script，去掉前面的#，在后面加上.py

3. 找到Options Indexes FollowSymLinks，在其后加上ExecCGI, 去掉 Indexes

4. 保存，重启apache。

之后将我们之前新建的CGI文件python_cgi.py保存在Apache服务器默认的工作目录htdocs下，创建新的项目目录cgitest或者直接在htdocs目录下，保存文件python_cgi.py或者python_cgi.cgi.打开Apache服务器，（apache默认port=80），在浏览器中输入 localhost/python_cgi.py、localhost/python_cgi.cgi或者在htdocs的其他可以访问的cgi路径。此时网页中显示
	Hello,World


## Tomcat ##   

1. 打开web.xml文件（D:\apache-tomcat-6.0.36\conf\web.xml），找到这一段被注释的节点（如下），如果你从没自己修改过，那应该是被注释的，你还需要添加一些参数。

```
<servlet>
<servlet-name>cgi</servlet-name>
<servlet-class>org.apache.catalina.servlets.CGIServlet</servlet-class>
<init-param>
<param-name>clientinputTimeout</param-name>
<param-value>100</param-value>
</init-param>
<init-param>
<param-name>debug</param-name>
<param-value>0</param-value>
</init-param>
<init-param>
<param-name>passShellEnvironment</param-name>
<param-value>true</param-value>
</init-param>
<init-param>
<param-name>cgiPathPrefix</param-name>
<param-value>WEB-INF/cgi-bin</param-value>
</init-param>
<init-param>
<param-name>executable</param-name>
<param-value>C:/Python34/python.exe</param-value>
</init-param>
<load-on-startup>5</load-on-startup>
</servlet>
```

解释几个重要的参数：

“passShellEnvironment”: 与Python解析器解析CGI脚本有关，但是一定要配置好Python的环境变量；

“cgiPathPrefix”: 与Server能够访问的脚本目录有关，与第二步内容相对应;

“executable”: （这是我的安装路径）与Python解析器有关，没有解析器，Server怎么解析呢~

2. 找到第二段被注释的节点：

```
<servlet-mapping>
<servlet-name>cgi</servlet-name>
<url-pattern>/cgi-bin/*</url-pattern>
</servlet-mapping>
```

这里的/cgi-bin/*指定了浏览器访问的地址，与前面WEB-INF/cgi-bin相对应。

3. 配置权限：

打开context.xml，添加：privileged="true"

```
<Context privileged="true">
<!-- Default set of monitored resources -->
<WatchedResource>WEB-INF/web.xml</WatchedResource>
<!-- Uncomment this to disable session persistence across Tomcat restarts -->
<!--
<Manager pathname="" />
-->
<!-- Uncomment this to enable Comet connection tacking (provides events
on session expiration as well as webapp lifecycle) -->
<!--
<Valve className="org.apache.catalina.valves.CometConnectionManagerValve" />
-->
</Context>
```
此时Tomcat应该就可以正常解析放在正确路径的cgi程序了。还是上面的python cgi文件python_cgi.py：

1. 在Tomcat默认的工作目录下面新建项目cgitest，即cgitest目录。

2. 在新建的项目目录下，新建WEB-INF目录，这个是Web程序的标准安全目录，客户端无法访问，只能在服务器端访问

3. 将原来创建的python_cgi.py存放在WEB-INF目录下的cgi-bin目录下。

现在就可以将Tomcat WEB容器启动，Tomcat自动将cgitest部署，访问 [http://localhost:8080/cgitest/cgi-bin/python-cgi.py ](http://localhost:8080/cgitest/cgi-bin/python-cgi.py )，出现了与Apache相同的效果。  


当然了，CGI的功能肯定远不止如此，更多的细节我会在其他文章中记录。



