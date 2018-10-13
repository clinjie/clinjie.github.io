title: 对偶问题
date: 2017-03-16 17:22:09
tags: 数学
categories: 数学
---

# 对偶问题 #

再来看不等式约束优化问题：

$$
\begin{aligned}
&\min\limits\_{x} \ f(x)\\\\
&s.t.\ \ h\_i(x)=0,\ i=1,2,...,m\\\\
&g\_j(x) \leq 0,\ j=1,2,...,n\\\\
\end{aligned}
$$

---
定义Lagrange如下：
$$
L(x,\lambda,\mu)=f(x)+\sum\limits\_{i=1}^m\lambda\_ih\_i(x)+\sum\limits\_{j=1}^n\mu\_jg\_j(x)
$$

在优化理论中，目标函数 f(x) 会有多种形式：<!--more-->如果目标函数和约束条件都为变量 x 的线性函数, 称该问题为线性规划； 如果目标函数为二次函数, 约束条件为线性函数, 称该最优化问题为二次规划; 如果目标函数或者约束条件均为非线性函数, 称该最优化问题为非线性规划。每个线性规划问题都有一个与之对应的对偶问题，对偶问题有非常良好的性质，以下列举几个：

- 对偶问题的对偶是原问题；
- 无论原始问题是否是凸的，对偶问题都是凸优化问题；
- 对偶问题可以给出原始问题一个下界；
- 当满足一定条件时，原始问题与对偶问题的解是完全等价的；

上式的拉格朗日对偶函数：

$$
\begin{aligned}
\Gamma(\lambda,\mu)=
&\inf\limits\_{x \in D}\ L(x,\lambda,\mu)\\\\
=&\inf\limits\_{x \in D}\lbrace f(x)+\sum\limits\_{i=1}^m \lambda\_i h\_i(x)+\sum\limits\_{j=1}^n \mu\_jg\_j(x) \rbrace
\end{aligned}
$$

若$\hat{x} \in D$是约束问题可行域的点，则对任意的$\mu \geq 0$和$\lambda$都有$\sum\limits\_{i=1}^m \lambda\_i h\_i(x) + \sum\limits\_{j=1}^n\mu\_j g\_j(x) \leq 0$

进而有

$$\Gamma(\lambda,\mu)=\inf\limits\_{x \in D}L(x,\lambda,\mu) \leq L(\hat{x},\lambda,\mu) \leq f(\hat{x})$$

若对上面约束优化问题的最优值为$p^*$，则对任意$\mu \geq 0$和$\lambda$都有

$$\Gamma(\lambda,\mu)\leq p^*$$

对偶函数的最大值对应着原来约束条件优化问题的最大值，也就是说对偶问题能给主问题最优值的下界。

那么对偶函数能获得的最好的下界是什么呢？

$$\max\limits\_{\lambda,\mu}\ \Gamma(\lambda,\mu)\ s.t. \ \mu \geq 0$$

这就是原来约束问题对应的对偶问题，$\mu,\lambda$叫对偶变量。为了方便，我们把它称为对偶式，原来约束问题称为原式。

## 强弱对偶 ##

假设对偶式的最优值为$d^*$，显然有$d^* \leq p^*$，这称为弱对偶性，如果$d^* = p^*$，称为强对偶性。

如果主问题为凸优化问题（例如原式中$f(x),g\_j(x)$都是凸函数，$h\_i(x)$是仿射函数），且可行域中至少有一点使不等式约束严格成立，此时强对偶成立。

强对偶下，将拉格朗日函数分别对原变量和对偶变量求导，再令导数为零，即可得到原变量与对偶变量的数值关系。
