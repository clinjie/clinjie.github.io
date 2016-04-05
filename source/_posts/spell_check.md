title: 简单的拼写检查
date: 2016-01-25 22:28:30
tags:
- python
- 贝叶斯
categories: python
---
大家在使用谷歌或者百度搜索时，输入搜索内容时，谷歌总是能提供非常好的拼写检查，比如你输入 speling，谷歌会马上返回 spelling。
下面是用python代码实现的一个简易但是具备完整功能的拼写检查器:

```
import re, collections
def words(text): return re.findall('[a-z]+', text.lower()) 
def train(features):
    model = collections.defaultdict(lambda: 1)
    for f in features:
        model[f] += 1
    return model
NWORDS = train(words(open('big.txt').read()))
alphabet = 'abcdefghijklmnopqrstuvwxyz'
def edits1(word):
   splits     = [(word[:i], word[i:]) for i in range(len(word) + 1)]
   deletes    = [a + b[1:] for a, b in splits if b]
   transposes = [a + b[1] + b[0] + b[2:] for a, b in splits if len(b)>1]
   replaces   = [a + c + b[1:] for a, b in splits for c in alphabet if b]
   inserts    = [a + c + b     for a, b in splits for c in alphabet]
   return set(deletes + transposes + replaces + inserts)
def known_edits2(word):
    return set(e2 for e1 in edits1(word) for e2 in edits1(e1) if e2 in NWORDS)
def known(words): return set(w for w in words if w in NWORDS)
def correct(word):
    candidates = known([word]) or known(edits1(word)) or known_edits2(word) or [word]
    return max(candidates, key=NWORDS.get)
```

<!--more-->

可以看出来，代码量很少，correct函数是程序的入口，传进去错误拼写的单词会返回正确。

```
>>> correct("cpoy")
'copy'
>>> correct("engilsh")
'english'
>>> correct("sruprise")
'surprise'
>>> correct('thiink')
'think'
```

除了这段代码外，作为机器学习的一部分，肯定还应该有大量的样本数据，准备了样本数据。


- [big.txt-戳这里](https://www.jianguoyun.com/p/DV8glFIQpYz2BRi50RI)   
- [或者戳这里：）](https://drive.google.com/open?id=0B-dTuxrWHzSzSW9RRFNIWDJPQWs)


**背后原理**

----------
上面的代码是基于贝叶斯来实现的，事实上谷歌百度实现的拼写检查也是通过贝叶斯实现，不过肯定比这个复杂多了。
首先简单介绍一下背后的原理，如果读者之前了解过了，可以跳过这段。
给一个词，我们试图选取一个最可能的正确的的拼写建议（建议也可能就是输入的单词）。有时也不清楚（比如lates应该被更正为late或者latest），我们用概率决定把哪一个作为建议。我们从跟原始词w相关的所有可能的正确拼写中找到可能性最大的那个拼写建议c：

```
argmaxc  P(c|w)
```

通过贝叶斯定理，上式可以转化为

```
argmaxc P(w|c) P(c) / P(w)
```

下面介绍一下上式中的含义：

P(c|w)代表在输入单词w 的情况下，你本来想输入单词c的概率。
P(w|c)代表用户想输入单词c却输入w的概率，这个可以我们认为给定的。
P(c)代表在样本数据中单词c出现的概率
P(w)代表在样本数字中单词w出现的概率
可以确定P(w)对于所有可能的单词c概率都是一样的，所以上式可以转换为
argmaxc P(w|c) P(c)
我们所有的代码都是基于这个公式来的，下面分析具体代码实现

代码分析

利用words()函数提取big.txt中的单词

```
def words(text): return re.findall('[a-z]+', text.lower())
```
re.findall(‘[a-z]+’是利用python正则表达式模块，提取所有的符合’[a-z]+’条件的，也就是由字母组成的单词。（这里不详细介绍正则表达式了，有兴趣的同学可以看正则表达式简介。text.lower()是将文本转化为小写字母，也就是“the”和“The”一样定义为同一个单词。

利用train()函数计算每个单词出现的次数然后训练出一个合适的模型

```
def train(features):
    model = collections.defaultdict(lambda: 1)
    for f in features:
        model[f] += 1
    return model

NWORDS = train(words(open('big.txt').read()))
```

这样NWORDS[w]代表了单词w在样本中出现的次数。如果有一个单词并没有出现在我们的样本中该怎么办？处理方法是将他们的次数默认设为1，这里通过collections模块和lambda表达式实现。collections.defaultdict()创建了一个默认的字典，lambda：1将这个字典中的每个值都默认设为1。（lambda表达式可以看lambda简介

现在我们处理完了公式argmaxc P(w|c) P(c)中的P(c)，接下来处理P(w|c)即想输入单词c却错误地输入单词w的概率，通过 “edit distance“－－将一个单词变为另一个单词所需要的编辑次数来衡量，一次edit可能是一次删除，一个交换（两个相邻的字母），一次插入，一次修改。下面的函数返回一个将c进行一次编辑所有可能得到的单词w的集合：

```
def edits1(word):
   splits     = [(word[:i], word[i:]) for i in range(len(word) + 1)]
   deletes    = [a + b[1:] for a, b in splits if b]
   transposes = [a + b[1] + b[0] + b[2:] for a, b in splits if len(b)>1]
   replaces   = [a + c + b[1:] for a, b in splits for c in alphabet if b]
   inserts    = [a + c + b     for a, b in splits for c in alphabet]
   return set(deletes + transposes + replaces + inserts)
```

相关论文显示，80-95%的拼写错误跟想要拼写的单词都只有1个编辑距离，如果觉得一次编辑不够，那我们再来一次

```
def known_edits2(word):
    return set(e2 for e1 in edits1(word) for e2 in edits1(e1) if e2 in NWORDS)
```

同时还可能有编辑距离为0次的即本身就拼写正确的：

```
def known(words):
    return set(w for w in words if w in NWORDS)
```

我们假设编辑距离1次的概率远大于2次的，0次的远大于1次的。下面通过correct函数先选择编辑距离最小的单词，其对应的P(w|c)就会越大，作为候选单词，再选择P(c)最大的那个单词作为拼写建议

```
def correct(word):
    candidates = known([word]) or known(edits1(word)) or known_edits2(word) or [word]
    return max(candidates, key=NWORDS.get)
```