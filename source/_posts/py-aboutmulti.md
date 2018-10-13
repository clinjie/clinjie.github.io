title: 进程线程
date: 2016-1-11 21:57:53
tags: python
categories: python
---

对于操作系统来说，一个任务就是一个进程（Process），比如打开一个浏览器就是启动
一个浏览器进程，打开一个记事本就启动了一个记事本进程，打开两个记事本就启动了两
个记事本进程，打开一个Word 就启动了一个 Word 进程。


有些进程还不止同时干一件事，比如 Word，它可以同时进行打字、拼写检查、打印等事情。
在一个进程内部，要同时干多件事，就需要同时运行多个“子任务”，我们把进程内的这些
“子任务”称为线程（Thread）。
<!--more-->

由于每个进程至少要干一件事，所以，一个进程至少有一个线程。当然，像 Word 这种复杂
的进程可以有多个线程，多个线程可以同时执行，多线程的执行方式和多进程是一样的，
也是由操作系统在多个线程之间快速切换，让每个线程都短暂地交替运行，看起来就像同
时执行一样。当然，真正地同时执行多线程需要多核 CPU 才可能实现。

Python 既支持多进程，又支持多线程，我们会讨论如何编写这两种多任务程序

# process #

Unix/Linux 操作系统提供了一个 fork() 系统调用，它非常特殊。普通的函数调用，调用一次，返回一次，但是 fork() 调用一次，返回两次，因为操作系统自动把当前进程（称为父进
程）复制了一份（称为子进程），然后，分别在父进程和子进程内返回。

调用fork方法之后，子进程永远返回 0 ，而父进程返回子进程的ID。这样做的理由是，一个父进程可以 fork 出很多子进程，所以，父进程要记下每个子进程的 ID，而子进程只需要调用 getppid() 就可以拿到父进程的ID。


```python
import os
print('process (%s) is started...' % os.getpid())
pid=os.fork()
if pid==0:
	print('I am child process (%s) and my parent process id (%s)' % (os.getpid(),os.getppid()))
else :
	print('I am the process (%s) and created a child process (%s)' % (os.getpid(),pid))
```

上面的代码中，在未创建子进程之前现在主进程中打印输出一段主进程标识。随后通过调用os.fork()方法复制一份完全相同的process，并分别返回在两个进程中，此时两个进程都拿到了返回的pid，不同的是pid根据进程的不同返回的不同，主进程中返回的是子进程的pid，儿子进程获取的pid=0；随后我们就在两个进程中判断输出信息。

子进程中获取本身进程标识符使用os.getpid()，获取父进程pid使用os.getppid()

父进程(相对于子进程而言)获取本身进程标识符调用os.getpid()，而子进程的pid则一定要在fork返回时保存。

## multiprocessing ##

multiprocessing是python提供的跨平台的python进程支持，这使得windows/nt系列系统享受多进程编程。

```python
import os
from multiprocessing import Process
def run_proc(name):
    print('Run child process %s (%s)....' % (name,os.getpid()))
if __name__=='__main__':
    print('Parent process %s is running' % os.getpid())
    p=Process(target=run_proc,args=('test',))
    print('child process will start')
    p.start()
    p.join()
    print('parent child is running again')

#print information in win

Parent process 2688 is running
child process will start
Run child process test (976)....
parent child is running again

#print info in linux
Main process (5433) is running
child process test (5434) is running
Main process is running again
```

多次实验发现，使用multiprocessing模块之后，win系统下新创建的process标识符与父进程pid相差很多，而linux下两个进程pid相邻。

执行Process(func,args=())之后，此时已经创建了新的子进程，但是依然还没有执行，知道调用start()方法后，开始执行，join方法使暂停主进程任务，子进程执行完成之后，继续执行主进程join()后面代码。用于进程间的同步通信。

如果没有执行join方法，那么两个进程将会分别执行各自任务，此时可能出现混乱的输出

## 进程池 ##

如果要启动大量的子进程，可以用进程池的方式批量创建子进程：

```python
import os
import time,random
from multiprocessing import Pool
def func1(name):
    print('run (%s) pid ...' % os.getpid())
    s=time.time()
    time.sleep(random.random()*4)
    e=time.time()
    print('(%s) pid executed %0.2f' % (os.getpid(),(e-s)))
if __name__=='__main__':
    print('Main process (%s) is running' % os.getpid())
    p=Pool()
    for i in range(1,6):
        p.apply_async(func1,args=(i,))
    print('waitting all child process done')
    p.close()
    p.join()
    print('Done')

#输出
Main process (8128) is running
waitting all child process done
run (2412) pid ...
run (6756) pid ...
run (2560) pid ...
run (6948) pid ...
(6756) pid executed 0.78
run (6756) pid ...
(6948) pid executed 2.48
(2412) pid executed 3.30
(2560) pid executed 3.98
(6756) pid executed 3.42
Done
```

上面的代码在测试过程中，刚开始新创建的进程总是无法输出正确的信息，最后发现是打印输出是调用了错误的方法，方法名错误。所以正常情况下，使用进程池执行任务时，如果代码错误，将会跳过此次执行（后来发现似乎是只针对apply_async）

如果此处不使用join方法，而主进程的其他任务已经完全执行结束，将会终止所有进程。调用 join() 之前必须先调用close()，调用close()之后就不能继续添加新的Process了

默认情况下，pool的容积都是有大小的，在Linux下默认的容积是CPU核心的数量，如果创建的进程数量超过了pool容积，则会先执行前面新创建的进程，第一个进程任务结束后创建完成新的进程任务。当然我们可以在创建pool时就修改pool的容积

`p=Pool(7)`

此时池子的容量就是7

## 进程间通信 ##

Process之间肯定是需要通信的，操作系统提供了很多机制来实现进程间的通信。Python的multiprocessing 模块包装了底层的机制，提供了 Queue 、 Pipes 等多种方式来交换数据。我们以 Queue 为例，在父进程中创建两个子进程，一个往 Queue 里写数据，一个从 Queue里读数据：


```python
from multiprocessing import Process, Queue
import os, time, random
# 写数据进程执行的代码:
def write(q):
	for value in ['A', 'B', 'C']:
		print 'Put %s to queue...' % value
		q.put(value)
		time.sleep(random.random())
# 读数据进程执行的代码:
def read(q):
	while True:
		value = q.get(True)
		print 'Get %s from queue.' % value
if __name__=='__main__':
	# 父进程创建Queue，并传给各个子进程：
	q = Queue()
	pw = Process(target=write, args=(q,))
	pr = Process(target=read, args=(q,))
	# 启动子进程pw，写入:
	pw.start()
 	# 启动子进程pr，读取:
	pr.start()
	# 等待pw结束:
	pw.join()
	# pr进程里是死循环，无法等待其结束，只能强行终止:
	pr.terminate()
#运行结果如下：
Put A to queue...
Get A from queue.
Put B to queue...
Get B from queue.
Put C to queue...
Get C from queue.
```

multiprocessing模块中的Queue是阻塞式的队列模式，如果无法即时获取到数据，本进程将阻塞

父进程与子进程之间的通信需要用到的multiprocessing模块的Manger类，Queue类无法适用于此处场景

# 线程 #

Python 的线程是真正的Posix Thread，而不是模拟出来的线程。Python 的标准库提供了两个模块： thread 和threading ， thread 是低级模块， threading是高级模块，对 thread 进行了封装。绝大多数情况下，我们只需要使用 threading 这个高级模块。

启动一个线程就是把一个函数传入并创建 Thread 实例，然后调用 start() 开始执行：

```python
import time, threading
# 新线程执行的代码:
def loop():
	print 'thread %s is running...' %
	threading.current_thread().name
	n = 0
	while n < 5:
		n = n + 1
		print 'thread %s >>> %s' %(threading.current_thread().name, n)
		time.sleep(1)
	print 'thread %s ended.' % threading.current_thread().name

print 'thread %s is running...' % threading.current_thread().name
t = threading.Thread(target=loop, name='LoopThread')
t.start()
t.join()
print 'thread %s ended.' % threading.current_thread().name

#打印
thread MainThread is running...
thread LoopThread is running...
thread LoopThread >>> 1
thread LoopThread >>> 2
thread LoopThread >>> 3
thread LoopThread >>> 4
thread LoopThread >>> 5
thread LoopThread ended.
thread MainThread ended.
```

`threadinf.Thread(target,name)`

## 锁 ##

多线程和多进程最大的不同在于，多进程中，同一个变量，各自有一份拷贝存在于每个进程中，互不影响，而多线程中，所有变量都由所有线程共享，所以，任何一个变量都可以被任何一个线程修改，因此，线程之间共享数据最大的危险在于多个线程同时改一个变量，把内容给改乱了。

例如两个线程同时修改一个变量var，修改变量var的过程有2步，第一步是把需要修改的内容放到临时变量中，第二步就是赋值。而执行这几条语句时，线程可能中断，从而导致多个线程把同一个对象的内容改乱了。此时就需要把这个过程上锁，拿到锁的线程才能执行。

```python
var = 0
lock = threading.Lock()
def run_thread(n):
	for i in range(100000):
	# 先要获取锁:
		lock.acquire()
		try:
		# 放心地改吧:
			change_it(n)
 		finally:
		# 改完了一定要释放锁:
			lock.release()
```

当多个线程同时执行 lock.acquire() 时，只有一个线程能成功地获取锁，然后继续执行代码，其他线程就继续等待直到获得锁为止.获得锁的线程用完后一定要释放锁，否则那些苦苦等待锁的线程将永远等待下去，成为死线程。所以我们用 try...finally 来确保锁一定会被释放.

## threadlocal ##

各个子线程在使用变量的时候最好使用各自线程的局部变量，因为局部变量只有线程自己能看见，不会影响其他线程，而全局变量的修改必须加锁。

但是局部变量也有问题，就是在函数调用的时候，传递起来很麻烦，ThreadLocal 应运而生。

```python
import threading
# 创建全局ThreadLocal对象:
local_school = threading.local()
def process_student():
	print 'Hello, %s (in %s)' % (local_school.student,threading.current_thread().name)
def process_thread(name):
	# 绑定ThreadLocal的 student:
	local_school.student = name
	process_student()
t1 = threading.Thread(target= process_thread, args=('Alice',),name='Thread-A')
t2 = threading.Thread(target= process_thread, args=('Bob',),name='Thread-B')
t1.start()
t2.start()
t1.join()
t2.join()
执行结果：
Hello, Alice ( in Thread-A)
Hello, Bob ( in Thread-B)
```
全局变量 local_school 就是一个 ThreadLocal 对象，每个 Thread 对它都可以读写 student属性，但互不影响。你可以把 local_school 看成全局变量，但每个属性如local_school.student 都是线程的局部变量，可以任意读写而互不干扰，也不用管理锁的问题， ThreadLocal 内部会处理。

可以理解为全局变量 local_school 是一个 dict ，不但可以用 local_school.student ，还可以绑定其他变量，如 local_school.teacher 等等。ThreadLocal 最常用的地方就是为每个线程绑定一个数据库连接，HTTP请求，用户身份信息等，这样一个线程的所有调用到的处理函数都可以非常方便地访问这些资源。

