title: Dropout
date: 2017-03-23 22:18:42
toc: true
tags: ML
categories: ML
---

# 前言

训练神经网络模型时，如果**训练样本较少，为了防止模型过拟合**，Dropout可以作为一种trikc供选择。Dropout是hintion最近2年提出的，源于其文章[Improving neural networks by preventing co-adaptation of feature detectors](https://arxiv.org/abs/1207.0580).中文大意为：通过阻止特征检测器的共同作用来提高神经网络的性能。本篇博文就是按照这篇论文简单介绍下Dropout的思想。

大部分内容来源[tornadomeet](http://www.cnblogs.com/tornadomeet/p/3258122.html)，先记录，之后填充。
<!--more-->
# 基础知识

　Dropout是指在模型训练时随机让网络某些隐含层节点的权重不工作，不工作的那些节点可以暂时认为不是网络结构的一部分，但是它的权重得保留下来（只是暂时不更新而已），因为下次样本输入时它可能又得工作了（有点抽象，具体实现看后面的实验部分）。

　　按照hinton的文章，他使用Dropout时训练阶段和测试阶段做了如下操作：

　　在样本的训练阶段，在没有采用pre-training的网络时（Dropout当然可以结合pre-training一起使用），hintion并不是像通常那样对权值采用L2范数惩罚，而是对每个隐含节点的权值L2范数设置一个上限bound，当训练过程中如果该节点不满足bound约束，则用该bound值对权值进行一个规范化操作（即同时除以该L2范数值），说是这样可以让权值更新初始的时候有个大的学习率供衰减，并且可以搜索更多的权值空间。

　　在模型的测试阶段，使用”mean network(均值网络)”来得到隐含层的输出，其实就是在网络前向传播到输出层前时隐含层节点的输出值都要减半（如果dropout的比例为50%），其理由文章说了一些，可以去查看（没理解）。

　　关于Dropout，文章中没有给出任何数学解释，Hintion的直观解释和理由如下：

1. 由于每次用输入网络的样本进行权值更新时，隐含节点都是以一定概率随机出现，因此不能保证每2个隐含节点每次都同时出现，这样权值的更新不再依赖于有固定关系隐含节点的共同作用，阻止了某些特征仅仅在其它特定特征下才有效果的情况。

2. 可以将dropout看作是模型平均的一种。对于每次输入到网络中的样本（可能是一个样本，也可能是一个batch的样本），其对应的网络结构都是不同的，但所有的这些不同的网络结构又同时share隐含节点的权值。这样不同的样本就对应不同的模型，是bagging的一种极端情况。个人感觉这个解释稍微靠谱些，和bagging，boosting理论有点像，但又不完全相同。

3. native bayes是dropout的一个特例。Native bayes有个错误的前提，即假设各个特征之间相互独立，这样在训练样本比较少的情况下，单独对每个特征进行学习，测试时将所有的特征都相乘，且在实际应用时效果还不错。而Droput每次不是训练一个特征，而是一部分隐含层特征。

4. 还有一个比较有意思的解释是，Dropout类似于性别在生物进化中的角色，物种为了使适应不断变化的环境，性别的出现有效的阻止了过拟合，即避免环境改变时物种可能面临的灭亡。


下面一个使用MNIST的CNN小例子使用dropout：

```python
# 进行20000次训练
for i in range(20000):
	# 随机取出50个样本数据，包括图片的灰度值x [28*28]，以及label数据y_
    batch = mnist.train.next_batch(50)
    if i%100 == 0:
	    # 这里没有再学习权值和偏置，没有对他们更新，是使用训练集做了一个简单的测试，所以概率设置为1
        train_accuracy = accuracy.eval(feed_dict={
            x:batch[0], y_: batch[1], keep_prob: 1.0})
        print("step %d, training accuracy %g"%(i, train_accuracy))
	# 训练时使用dropout，概率为0.5
    train_step.run(feed_dict={x: batch[0], y_: batch[1], keep_prob: 0.5})

# 测试时不使用dropout，将概率设置为1
print("test accuracy %g"%accuracy.eval(feed_dict={
    x: mnist.test.images, y_: mnist.test.labels, keep_prob: 1.0}))
```
