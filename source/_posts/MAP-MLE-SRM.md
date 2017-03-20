title: MAP、SRM、ERM与MLE
date: 2017-03-20 11:22:09
toc: true
tags: 数学
categories: 数学
---

# 最大似然与经验风险最小化

>当模型是条件概率分布，损失函数是对数损失函数时，经验风险最小化就等价于极大似然估计

首先给出对数形式的ERM的公式：
$$\min \frac{1}{n}\sum\limits\_{i=1}^n L(y\_i,p(y\_i\mid x\_i))$$

其中$L(y\_i,f(x\_i))$是损失函数，输出预测值为$f(x\_i)$，n是观察到的样本数。

---

最大似然的前提是从模型总体随机抽取样本观测值，所有的采样都是独立同分布的。
<!--more-->
假设$x\_1,x\_2,...,x\_n$为独立同分布的采样，$\theta$为模型参数，f为我们使用的模型，我们使用条件概率分布，遵循独立同分布。假设我们需要根据观察数据$x$估计没有观察到的总体参数$\theta$：

$$f(x\_1,x\_2,...,x\_n \mid \theta)=f(x\_1 \mid \theta)\times f(x\_2 \mid \theta)\times...\times f(x\_n \mid \theta)$$

此时似然定义为：

$$L(\theta \mid x\_1,x\_2,...,x\_n)=P(x\_1,x\_2,...,x\_n\mid \theta)=\prod\limits\_{i=1}^n f(x\_i \mid \theta)$$

在实际应用中常用的是取两边取对数，并取似然值得平均值：

$$\frac{1}{n} \log L(\theta \mid x\_1,x\_2,...,x\_n)=\frac{1}{n} \sum\limits\_{i=1}^n \log f(x\_i \mid \theta)$$

去取极大似然估计MLE：

$$
\arg\max\limits\_{\theta} \frac{1}{n} \sum\limits\_{i=1}^n \log f(x\_i\mid \theta)
= \min \frac{1}{n}\sum\limits\_{i=1}^n - \log f(x\_i \mid \theta)
$$

由于$f(\mid)$是是条件概率分布模型，那么$-\log f(x\_i\mid \theta)$便可以看做是对数似然损失函数。可以明显看出此时的经验风险最小化就等价于极大似然估计。上式是要求参数$\theta$，在这个参数条件下，使得已知数据$x$出现的概率最大。


# 后验概率与结构风险最小化

>当模型是条件概率分布、损失函数是对数损失函数、模型复杂度由模型的先验概率表示时，结构风险最小化就等价于最大后验概率估计。


先来一段后验概率最大化MAP的推导，摘自[Wiki](https://zh.wikipedia.org/wiki/%E6%9C%80%E5%A4%A7%E5%90%8E%E9%AA%8C%E6%A6%82%E7%8E%87)：

假设我们需要根据观察数据$x$估计没有观察到的总体参数 $\theta$，让$f$作为$x$的采样分布，这样$f(x\mid \theta)$就是在那个题参数为$\theta$时$x$的概率。函数$\theta \to f(x \mid \theta)$，即为似然函数，其估计$\hat{\theta}\_{ML}(x)=\arg\max\limits\_{\theta}f(x\mid \theta)$，就是$\theta$的最大似然估计。

假设$\theta$存在一个先验分布$g$，这就允许我们将$\theta$作为贝叶斯分布中的随机变量，这样$\theta$的后验分布就是:

$$\theta \to \frac{f(x \mid \theta)g(\theta)}{\int\_{\Theta}f(x \mid \theta\_1)g(\theta\_1)d\theta\_1}$$

其中$\Theta$是$g$的域，上式分母的下部就相当于对已知数据$x$概率的估计，这里用的公式是贝叶斯公式，由先验概率去求后验概率$P(A\mid B)=(P(B\mid A)*P(A))/P(B)$。

最大后验估计方法估计$\theta$为这个随机变量的后验分布的众数：

$$\hat{\theta}\_{MAP}(x)=\arg\max\limits\_{\theta} \frac{f(x \mid \theta)g(\theta)}{\int\_{\Theta}f(x \mid \theta\_1)g(\theta\_1)d\theta\_1}=\arg\max\limits\_{\theta}f(x\mid \theta)g(\theta)$$

后验分布的分母与$\theta$ 无关，在求解中分母不变，当成一个常数使用，所以在优化过程中不起作用。注意当前验$g$是常数函数时最大后验概率与最大似然估计的重合。

我们对上式进行一些变换(先加上对数，再将对数展开)，则上式等价于：

$$\hat{\theta}\_{MAP}(x)=\arg\max\limits\_{\theta} [\ln f(x\mid \theta)+\ln g(\theta)]$$

进一步的，有：

$$\hat{\theta}\_{MAP}(x)=\arg\max\limits\_{\theta} \ln f(x \mid \theta)+\arg\max\limits\_{\theta} \ln g(\theta)$$
可以发现，等式右边第一部分刚好为最大似然估计的公式，我们将最大似然估计的公式写出：

$$\max \frac{1}{n}\sum\limits\_{i=1}^n \ln f(x\_i \mid \theta)$$
将最大似然估计的公式代入，然后通过增加负号将最大后验概率分布公式的max改为min。这样，最大后验概率估计的公式可以写成下面这样：

$$\hat{\theta}\_{MAP}(x)=\arg\min\limits\_{\theta}\{[\frac{1}{n}\sum\limits\_{i=1}^n-\ln f(x\_i \mid \theta)]- g(\theta)\}$$

对比结构风险最小化公式：

$$\min\limits\_{f \in F}\frac{1}{n}\sum\limits\_{i=1}^n L(y\_i,f(x\_i))+\lambda J(f)$$

由于$f(\mid)$是模型，可以是条件概率分布模型，那么$-\ln f(x\_i\mid \theta)$便可以看做是对数似然损失函数。

$g(\theta)$表示模型的先验概率，且我们认为先验概率大的模型其复杂度小，所以$-g(\theta)$可以认为与复杂度成正比，$-g(\theta)$越大，复杂度越高。

此时，上式中的后半项就对应着结构风险最小化中的正则项。
