title: subprocess模块的使用
date: 2016-12-18 22:09:48
toc: true
tags: python
categories: python
---

最近在考虑如何在一个独立的程序上加一个GUI壳子，原来的程序是通过console接受输入输出的，查阅资料发现了subprocess模块，这里记录一下。

# 引入 #

从名字就可以听出来，subprocess是python管理子进程的模块。运行python的时候，正常情况下我们都是在创建并运行一个进程。通过subprocess可以新建一个子进程执行程序，并通过subprocess提供的api与新创建的子进程联系。

subprocess中最基础也最重要的就是基于Popen()函数，Popen()方法根据参数新建一个进程并执行，后面的一些列参数是对这个新创建的进程的管理。
<!--more-->
会话消息也就是I/O流，正常情况下有三种stdin、stdout以及stderr。前两个都很好理解，第三个就是标准的错误输出信息。

Popen()方法通过对这三个参数的配置指定子进程I/O方式。一般支持的主要有两种方式：stdxx，这个也是默认的，就还是按原来的走；或者设置为Pipe，管道模式，这种模式下，子进程有一个缓冲区存储这输入输出信息，缓存等待着我们通过API进行数据的操作。这里实际上就是劫持了标准的I/O流。

# 一些常用方法 #

- terminate()

停止(stop)子进程。在windows平台下，该方法将调用Windows API TerminateProcess（）来结束子进程。

- kill()

杀死子进程

- communicate(input=None)

与子进程进行交互。向stdin发送数据，或从stdout和stderr中读取数据。可选参数input指定发送到子进程的参数。Communicate()返回一个元组：(stdoutdata, stderrdata)。注意：如果希望通过进程的stdin向其发送数据，在创建Popen对象的时候，参数stdin必须被设置为PIPE。同样，如果希望从stdout和stderr获取数据，必须将stdout和stderr设置为PIPE，这个方法与之前将标准I/O流设置成管道PIPE不同，communicate方法是在进程运行结束返回后将输出信息以及错误信息返回，在程序运行期间，无法通信。

# 具体程序相关 #

`p1=subprocess.Popen(cmd下执行程序的指令,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)`

将输入输出都设置为管道模式，错误信息重定向到输出，这样我们使用API获取输出信息时，能够直接拿到输出信息与错误信息。

- 获取输出信息

`s=p1.stdout.readline()`
`s=s.decode('gbk')`

从缓冲区中读取一行输出

- 写入信息并实时的推送到原程序中

`p1.stdin.write(s.encode())`
`p1.stdin.flush()`


因为劫持的标准I/O流，里面都是byte信息，所以为了能够使用，我们需要将byte转换成str，至于编码解码的编码集，需要根据服务器返回信息的不同测试设置。


- 实时的获取反馈信息

独立于GUI线程，也不是在主线程中，新建一个专门查询缓冲区的线程，如果缓冲区有未接受的信息，通过Qt的信号-槽模式，将需要传递的信息发给GUI处理函数。





