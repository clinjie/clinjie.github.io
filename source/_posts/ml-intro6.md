title: ML学习-SVM
date: 2017-03-05 13:18:42
toc: true
tags: ML
categories: ML
---

支持向量机（Support Vector Machine）的求解通常是借助凸优化技术。

# 间隔与支持向量 #

给定训练样本集$D=\{(x\_1,y\_1),(x\_2,y\_2),...,(x\_m,y\_m)\},y\_i \in \{-1,+1 \}$
