title: Python中的numpy
date: 2016-03-17 22:23:35
toc: true
tags: 
- Python
- Numpy
categories: Python
---

![](/img/article/article_numpy.png)

# Numpy #

*NumPy系统是Python的一种开源的数值计算扩展。这种工具可用来存储和处理大型矩阵，比Python自身的嵌套列表（nested list structure)结构要高效的多（该结构也可以用来表示矩阵（matrix））*。<!--more-->据说NumPy将Python相当于变成一种免费的更强大的MatLab系统。

NumPy（Numeric Python）提供了许多高级的数值编程工具，如：矩阵数据类型、矢量处理，以及精密的运算库。专为进行严格的数字处理而产生。多为很多大型金融公司使用，以及核心的科学计算组织如：Lawrence Livermore，NASA用其处理一些本来使用C++，Fortran或Matlab等所做的任务。

# 多维数组 #

多维数组的类型是：`numpy.ndarray`

## 使用numpy.array方法 ##

- 以list或tuple变量为参数产生一维数组：

```python
>>> print(np.array([1,2,3,4]))
[1 2 3 4]
>>> print(np.array((1.2,2,3,4)))
[ 1.2  2.   3.   4. ]
>>> print type(np.array((1.2,2,3,4)))
<type 'numpy.ndarray'>
```

- 以list或tuple变量为元素产生二维数组：


```python
>>> print(np.array([[1,2],[3,4]]))
[[1 2]
 [3 4]]
```

- 指定数据类型

例如numpy.int32, numpy.int16, and numpy.float64等：

```python
>>> print np.array((1.2,2,3,4), dtype=np.int32)
[1 2 3 4]
```

- 使用numpy.arange方法

```python
>>> print(np.arange(15))
[ 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14]

>>> print type(np.arange(15))
<type 'numpy.ndarray'>

>>> print np.arange(15).reshape(3,5)
[[ 0  1  2  3  4]
 [ 5  6  7  8  9]
 [10 11 12 13 14]]
>>> print type(np.arange(15).reshape(3,5))
<type 'numpy.ndarray'>
```

- 使用numpy.linspace方法

例如，在从1到3中产生9个数：

```python
>>> print(np.linspace(1,3,10))
[ 1.          1.22222222  1.44444444  1.66666667  1.88888889  2.11111111
  2.33333333  2.55555556  2.77777778  3.        ]
```

- 使用numpy.zeros，numpy.ones，numpy.eye

可以构造特定的矩阵

```python
>>> print(np.zeros((3,4)))
[[ 0.  0.  0.  0.]
 [ 0.  0.  0.  0.]
 [ 0.  0.  0.  0.]]

>>> print(np.ones((4,3)))
[[ 1.  1.  1.]
 [ 1.  1.  1.]
 [ 1.  1.  1.]
 [ 1.  1.  1.]]

>>> print(np.eye(4))
[[ 1.  0.  0.  0.]
 [ 0.  1.  0.  0.]
 [ 0.  0.  1.  0.]
 [ 0.  0.  0.  1.]]
```

- 创建一个三维数组：

```python
>>> print(np.ones((3,3,3)))
[[[ 1.  1.  1.]
  [ 1.  1.  1.]
  [ 1.  1.  1.]]

 [[ 1.  1.  1.]
  [ 1.  1.  1.]
  [ 1.  1.  1.]]

 [[ 1.  1.  1.]
  [ 1.  1.  1.]
  [ 1.  1.  1.]]]
```

## 获取数组的属性 ##

```python
>>> a = np.zeros((2,3,2))
>>> print(a.ndim)   #数组的维数
3
>>> print(a.shape)  #数组每一维的大小
(2, 3, 2)
>>> print(a.size)   #数组的元素数
12
>>> print(a.dtype)  #元素类型
float64
>>> print(a.itemsize)  #每个元素所占的字节数
8
```

- 数组索引，切片，赋值


```python
>>>a = np.array( [[2,3,4],[5,6,7]] )
>>> print(a)
[[2 3 4]
 [5 6 7]]
>>> print(a[1,2]) #index从0开始
7
>>> print a[1,:]
[5 6 7]
>>> print(a[1,1:2])
[6]
>>> a[1,:] = [8,9,10] #直接赋值
>>> print(a)
[[ 2  3  4]
 [ 8  9 10]]
```

- 使用for操作元素

```python
>>> for x in np.linspace(1,3,3):
...     print(x)
...
1.0
2.0
3.0
```

- 基本的数组运算

先构造数组a、b：

```python
>>> a = np.ones((2,2))
>>> b = np.eye(2)
>>> print(a)
[[ 1.  1.]
 [ 1.  1.]]
>>> print(b)
[[ 1.  0.]
 [ 0.  1.]]
```

- 数组的加减乘除

```python
>>> print(a > 2)
[[False False]
 [False False]]
>>> print(a+b)
[[ 2.  1.]
 [ 1.  2.]]
>>> print(a-b)
[[ 0.  1.]
 [ 1.  0.]]
>>> print(b*2)
[[ 2.  0.]
 [ 0.  2.]]
>>> print((a*2)*(b*2))
[[ 4.  0.]
 [ 0.  4.]]
>>> print(b/(a*2))
[[ 0.5  0. ]
 [ 0.   0.5]]
>>> print((b*2)**4)
[[ 16.  0]
 [ 0  16.]]
```

- 使用数组对象自带的方法

```python
>>> a.sum() #a的元素个数
4.0
>>> a.sum(axis=0)   #计算每一列（二维数组中类似于矩阵的列）的和
array([ 2.,  2.])
>>> a.min()
1.0
>>> a.max()
1.0
```
- 使用numpy下的方法

```python
>>> np.sin(a)
array([[ 0.84147098,  0.84147098],
       [ 0.84147098,  0.84147098]])
>>> np.max(a)
1.0
>>> np.floor(a)
array([[ 1.,  1.],
       [ 1.,  1.]])
>>> np.exp(a)
array([[ 2.71828183,  2.71828183],
       [ 2.71828183,  2.71828183]])
>>> np.dot(a,a)   ##矩阵乘法
array([[ 2.,  2.],
       [ 2.,  2.]])
```

- 合并数组

使用numpy下的vstack和hstack函数：

```python
>>> a = np.ones((2,2))
>>> b = np.eye(2)
>>> print(np.vstack((a,b)))
#顾名思义 v--vertical  垂直
[[ 1.  1.]
 [ 1.  1.]
 [ 1.  0.]
 [ 0.  1.]]
>>> print(np.hstack((a,b)))
#顾名思义 h--horizonal 水平
[[ 1.  1.  1.  0.]
 [ 1.  1.  0.  1.]]
```


----------

看一下这两个函数有没有涉及到浅拷贝这种问题：

```python
>>> c = np.hstack((a,b))
>>> print c
[[ 1.  1.  1.  0.]
 [ 1.  1.  0.  1.]]
>>> a[1,1] = 5
>>> b[1,1] = 5
>>> print c
[[ 1.  1.  1.  0.]
 [ 1.  1.  0.  1.]]
```

可以看到，a、b中元素的改变并未影响c。

- 深拷贝数组

数组对象自带了浅拷贝和深拷贝的方法，但是一般用深拷贝多一些：

```python
>>> a = np.ones((2,2))
>>> b = a
>>> print(b is a)
True
>>> c = a.copy()  #深拷贝
>>> c is a
False
```

- 基本的矩阵运算

转置：

```python
>>> a = np.array([[1,0],[2,3]])
>>> print(a)
[[1 0]
 [2 3]]
>>> print(a.transpose())
[[1 2]
 [0 3]]
```

- 迹：

```python
>>> print(np.trace(a))
4
```

- numpy.linalg关于矩阵运算的方法

`>>> import numpy.linalg as nplg`

- 特征值、特征向量：

```python
>>> print nplg.eig(a)
(array([ 3.,  1.]), array([[ 0.        ,  0.70710678],
       [ 1.        , -0.70710678]]))
```

# 矩阵对象 #

numpy模块中的矩阵对象为numpy.matrix，包括矩阵数据的处理，矩阵的计算，以及基本的统计功能，转置，可逆性等等，包括对复数的处理，均在matrix对象中。 

`class numpy.matrix(data,dtype,copy)`:

- 返回一个矩阵，其中data为ndarray对象或者字符形式；

- dtype:为data的type；

- copy:为bool类型。

```python
>>> a = np.matrix('1 2 7; 3 4 8; 5 6 9')
>>> a             #矩阵的换行必须是用分号(;)隔开，内部数据必须为字符串形式(‘ ’)，矩
matrix([[1, 2, 7],       #阵的元素之间必须以空格隔开。
[3, 4, 8],
[5, 6, 9]])

>>> b=np.array([[1,5],[3,2]])
>>> x=np.matrix(b)   #矩阵中的data可以为数组对象。
>>> x
matrix([[1, 5],
[3, 2]])
```

## 矩阵对象的属性 ##

- matrix.T transpose

：返回矩阵的转置矩阵

- matrix.H hermitian (conjugate) transpose

：返回复数矩阵的共轭元素矩阵

- matrix.I inverse

：返回矩阵的逆矩阵

- matrix.A base array

：返回矩阵基于的数组

## 矩阵对象的方法 ##

- all([axis, out]) :沿给定的轴判断矩阵所有元素是否为真(非0即为真)

- any([axis, out]) :沿给定轴的方向判断矩阵元素是否为真，只要一个元素为真则为真。

- argmax([axis, out]) :沿给定轴的方向返回最大元素的索引（最大元素的位置）.

- argmin([axis, out]): 沿给定轴的方向返回最小元素的索引（最小元素的位置）

- argsort([axis, kind, order]) :返回排序后的索引矩阵

- astype(dtype[, order, casting, subok, copy]):将该矩阵数据复制，且数据类型为指定的数据类型

- byteswap(inplace) Swap the bytes of the array elements

- choose(choices[, out, mode]) :根据给定的索引得到一个新的数据矩阵（索引从choices给定）

- clip(a_min, a_max[, out]) :返回新的矩阵，比给定元素大的元素为a_max，小的为a_min

- compress(condition[, axis, out]) :返回满足条件的矩阵

- conj() :返回复数的共轭复数

- conjugate() :返回所有复数的共轭复数元素

- copy([order]) :复制一个矩阵并赋给另外一个对象，b=a.copy()

- cumprod([axis, dtype, out]) :返回沿指定轴的元素累积矩阵

- cumsum([axis, dtype, out]) :返回沿指定轴的元素累积和矩阵

- diagonal([offset, axis1, axis2]) :返回矩阵中对角线的数据

- dot(b[, out]) :两个矩阵的点乘

- dump(file) :将矩阵存储为指定文件,可以通过pickle.loads()或者numpy.loads()如:a.dump(‘d:\\a.txt’)

- dumps() :将矩阵的数据转存为字符串.

- fill(value) :将矩阵中的所有元素填充为指定的value

- flatten([order]) :将矩阵转化为一个一维的形式，但是还是matrix对象

- getA() :返回自己，但是作为ndarray返回

- getA1()：返回一个扁平（一维）的数组（ndarray）

- getH() :返回自身的共轭复数转置矩阵

- getI() :返回本身的逆矩阵

- getT() :返回本身的转置矩阵

- max([axis, out]) ：返回指定轴的最大值

- mean([axis, dtype, out]) :沿给定轴方向，返回其均值

- min([axis, out]) ：返回指定轴的最小值

- nonzero() :返回非零元素的索引矩阵

- prod([axis, dtype, out]) :返回指定轴方型上，矩阵元素的乘积.

- ptp([axis, out]) :返回指定轴方向的最大值减去最小值.

- put(indices, values[, mode]) :用给定的value替换矩阵本身给定索引（indices）位置的值

- ravel([order]) :返回一个数组，该数组是一维数组或平数组

- repeat(repeats[, axis]) :重复矩阵中的元素，可以沿指定轴方向重复矩阵元素，repeats为重复次数

- reshape(shape[, order]) :改变矩阵的大小,如：reshape([2,3])

- resize(new_shape[, refcheck]) :改变该数据的尺寸大小

- round([decimals, out]) :返回指定精度后的矩阵，指定的位数采用四舍五入，若为1，则保留一位小数

- searchsorted(v[, side, sorter]) :搜索V在矩阵中的索引位置

- sort([axis, kind, order]) :对矩阵进行排序或者按轴的方向进行排序

- squeeze([axis]) :移除长度为1的轴

- std([axis, dtype, out, ddof]) :沿指定轴的方向，返回元素的标准差.

- sum([axis, dtype, out]) ：沿指定轴的方向，返回其元素的总和

- swapaxes(axis1, axis2):交换两个轴方向上的数据.

- take(indices[, axis, out, mode]) :提取指定索引位置的数据,并以一维数组或者矩阵返回(主要取决axis)

- tofile(fid[, sep, format]) :将矩阵中的数据以二进制写入到文件

- tolist() :将矩阵转化为列表形式

- tostring([order]):将矩阵转化为python的字符串.

- trace([offset, axis1, axis2, dtype, out]):返回对角线元素之和

- transpose(*axes) :返回矩阵的转置矩阵，不改变原有矩阵

- var([axis, dtype, out, ddof]) ：沿指定轴方向，返回矩阵元素的方差

- view([dtype, type]) :生成一个相同数据，但是类型为指定新类型的矩阵。

## 举例 ##

```python
>>> a = np.asmatrix('0 2 7; 3 4 8; 5 0 9')
>>> a.all()
False
>>> a.all(axis=0)
matrix([[False, False,  True]], dtype=bool)
>>> a.all(axis=1)
matrix([[False],
[ True],
[False]], dtype=bool)

Astype方法
>>> a.astype(float)
matrix([[ 12.,   3.,   5.],
[ 32.,  23.,   9.],
[ 10., -14.,  78.]])

Argsort方法
>>> a=np.matrix('12 3 5; 32 23 9; 10 -14 78')
>>> a.argsort()
matrix([[1, 2, 0],
[2, 1, 0],
[1, 0, 2]])

Clip方法
>>> a
matrix([[ 12,   3,   5],
[ 32,  23,   9],
[ 10, -14,  78]])
>>> a.clip(12,32)
matrix([[12, 12, 12],
[32, 23, 12],
[12, 12, 32]])

Cumprod方法
>>> a.cumprod(axis=1)
matrix([[    12,     36,    180],
[    32,    736,   6624],
[    10,   -140, -10920]])

Cumsum方法
>>> a.cumsum(axis=1)
matrix([[12, 15, 20],
[32, 55, 64],
[10, -4, 74]])

Tolist方法
>>> b.tolist()
[[12, 3, 5], [32, 23, 9], [10, -14, 78]]

Tofile方法
>>> b.tofile('d:\\b.txt')

compress()方法
>>> from numpy import *
>>> a = array([10, 20, 30, 40])
>>> condition = (a > 15) & (a < 35)
>>> condition
array([False, True, True, False], dtype=bool)
>>> a.compress(condition)
array([20, 30])
>>> a[condition]                                      # same effect
array([20, 30])
>>> compress(a >= 30, a)                              # this form a
so exists
array([30, 40])
>>> b = array([[10,20,30],[40,50,60]])
>>> b.compress(b.ravel() >= 22)
array([30, 40, 50, 60])
>>> x = array([3,1,2])
>>> y = array([50, 101])
>>> b.compress(x >= 2, axis=1)                       # illustrates 
the use of the axis keyword
array([[10, 30],
[40, 60]])
>>> b.compress(y >= 100, axis=0)
array([[40, 50, 60]])
```