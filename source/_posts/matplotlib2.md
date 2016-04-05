title: Matplotlib快速绘图（2）
date: 2016-04-01 23:27:51
toc: true
tags: matplotlib
categories: matplotlib
---


matplotlib 是python最著名的绘图库，它提供了一整套和matlab相似的命令API，十分适合交互式地进行制图。而且也可以方便地将它作为绘图控件，嵌入GUI应用程序中。

它的文档相当完备，并且 Gallery页面 中有上百幅缩略图，打开之后都有源程序。因此如果你需要绘制某种类型的图，只需要在这个页面中浏览/复制/粘贴一下<!--more-->，基本上都能搞定。

 

在Linux下比较著名的数据图工具还有gnuplot，这个是免费的，Python有一个包可以调用gnuplot，但是语法比较不习惯，而且画图质量不高。

而 Matplotlib则比较强：Matlab的语法、python语言、latex的画图质量（还可以使用内嵌的latex引擎绘制的数学公式）。

# 绘制一组幂函数 #

matplotlib的pyplot子库提供了和matlab类似的绘图API，方便用户快速绘制2D图表

先从一个简单的例子开始讨论。假设要在一个图形中显示一组幂函数。这组幂函数的基不同，分别为10，自然对数 e 和2。可以用如下 Python 脚本去描绘这组曲线，生成的图形如下

```python
from matplotlib.pylab import * 
import numpy as np
 
x = linspace(-6, 6, 300) 
f1 = np.power(9, x) 
f2 = np.power(e, x) 
f3 = np.power(2, x)  

plot(x, f1, 'red',  x, f2, 'blue', x, f3, 'pink', linewidth=2.5) 
axis([-6, 4, -0.5, 10])
text(1, 7.5, r'$10^x$', fontsize=14)
text(2.2, 7.5, r'$e^x$', fontsize=14)
text(3.2, 7.5, r'$2^x$', fontsize=14)
title('A simple example', fontsize=14)

savefig('power.png')
show()
```

![](/img/article/matplotlib/power.png)

程序的第一行装载了 pylab 模块。接下来的几行语句（至 savefig 之前）运行 Matlab 程序，因为 linspace， plot，axis, text, title 这些函数在 pylab 中也存在。这个例子展示了 Matplotlib 中几个比较常用的绘图函数，如 plot，axis，title 等的用法。其中 plot 是一个功能十分强大的函数, 通过改变它的参数选项，可以灵活地修改图形的各种属性，比如选用的线型，颜色，宽度等。

# 显示图形中的数学公式 #

Matplotlib 可以支持一部分 TeX 的排版指令，因此用户在绘制含有数学公式的图形时会感到很方便并且可以得到比较满意的显示效果，所需要的仅仅是一些 TeX 的排版知识。下面的这个例子显示了如何在图形的不同位置上, 如坐标轴标签，图形的标题以及图形中适当的位置处，显示数学公式。相应的 Python 程序如下.

```python
from matplotlib.pylab import *
def  f(x, c):
    m1 = sin(3*pi*x)
    m2 = exp(-c*x)
    m3 = sin(x)
    return multiply(m1, m2,m3)
x = linspace(0, 4, 100)
sigma = 0.6
plot(x, f(x, sigma), 'r', linewidth=2)
xlabel(r'time  t', fontsize=16)
ylabel(r'Amplitude  $f(x)$', fontsize=16)
title(r'$f(x)$ is damping  with x', fontsize=16)
text(2.0, 0.5, r'$f(x) = \rm{sin}(3 \pi  x^2) e^{\sigma x}$', fontsize=20)
savefig('latex.png', dpi=75)
show()
```

![](/img/article/matplotlib/latex.png)

从程序中可以看出，在 Matplotlib 中进行有关数学公式的排版是很简单的。与 TeX 排版时的约定一样，要插入的公式部分由一对美元符号 $ 来进行标识，而具体的排版命令与 TeX 一样。在任何可以显示文本的地方（如轴的标签，标题处等）都可以插入需要的公式。需要注意的是，数学公式所在的字符串开始之处有一个标记 r，表示该字符串是一个 raw string。这是因为排版公式时，字符串所包含的内容必须按照 TeX 的规范，而不是其他的规范，来进行解析。所以使用 raw string 可以避免其它规则解释字符串中某些特殊字符所带来的歧义。从生成的图形可以看到，公式显示的效果是比较美观的。

另外在这对美元符号之间如果想要使用正常的字符，可以插入`\rm{}`，并在括号里添加文字，一些特殊的字体如`math.pi`，可以在美元符号内使用`\pi`,幂级数角标使用`{}`.

# GLP 集合计算结果的可视化 #

Python 是一种比较适合用来进行科学计算的脚本语言，如果利用了 Numeric 及 Numarray 模块，它的计算能力还能得到进一步的增强。 Matplotlib 也充分利用了这两个模块，可以高质量地完成计算结果可视化的工作。下面是一个计算和显示两维好格子点 GLP (Good Lattice Point Set)集合的例子。 GLP 集合是一种用算法产生的伪随机数的集合,它在一些优化计算中很有用，详细的介绍可以在参考文献里找到。下面的 Python 程序先定义了一个函数 glp(n1, n2) 用以产生需要的 GLP 集合, 接着利用 Matplotlib 来显示它的分布情况（应该是均匀分布的）。

```python
from matplotlib.pylab import *
def glp(n1, n2):
	q = zeros((2, n2), float)
	h1 = 1; h2 = n1
	for i in arange(n2-1):
		q[0][ i] = (fmod(h1*(i+1), n2)-0.5)/n2
		q[1][ i] = (fmod(h2*(i+1), n2)-0.5)/n2
	q[0][n2-1] = (n2-0.5)/n2
	q[1][n2-1] = (n2-0.5)/n2
	return q
n1 = 454; n2 = 745
q = glp(n1, n2)
x = q[0, :]
y = q[1, :]
#y. 表示yello dot
plot(x, y, 'y.', linewidth=2)
axis([0, 1, 0, 1])
title(r'$\rm{GLP \ set \ with} \ n_1 = 454, \ n_2 = 745$')
savefig('glp.png')
show()
```

![](/img/article/matplotlib/glp.png)

最初我们是用 Matlab 来完成这个工作的，现在用 Python 来实现一样很简洁。程序中函数 glp 的实现主要是利用了模快 Numeric，计算得到的结果用 plot 函数直接加以显示，十分方便。这个例子（包括上一个例子）显示了，在利用 Python 进行某些科学及工程计算时，Matplotlib 往往能简洁高效地完成计算结果可视化的工作。