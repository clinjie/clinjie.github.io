title: PL中的伪随机
date: 2015-12-20 14:46:11
tags: python
categories: python
---
![](http://7xowaa.com1.z0.glb.clouddn.com/chatu_suiji.jpg)

这里先说一下伪随机与真随机的区别:   

真正意义上的随机数（或者随机事件）在某次产生过程中是按照实验过程中表现的分布概率随机产生的，其结果是不可预测的，是不可见的。<!--more-->而计算机中的随机函数是按照一定算法模拟产生的，其结果是确定的，是可见的。我们可以这样认为这个可预见的结果其出现的概率是100%。所以用计算机随机函数所产生的“随机数”并不随机，是伪随机数。

当然了，在python中使用random模块的普通功能生成的数字都是伪随机数，这在一般情况下是够用了，如果想要体验真的随机性，应该使用os模块的urandom函数或者random模块的SystemRandom类，让数据接近真的随机性.


![](http://7xowaa.com1.z0.glb.clouddn.com/random.jpg)

getrandbits(n)以长整形形式返回给定的位数，输出时转换成为10进制数

uniform提供来年各个数值参数a、b，他会返回在a~b随机实数n

randrange能够产生该范围内的随机数。randrange(1,20,2)会产生小于20的随机正奇数
