title: Gray Code
date: 2016-04-16 22:17:22
toc: false
tags: algorithm
categories: algorithm
---

The gray code is a binary numeral system where two successive values differ in only one bit.

Given a non-negative integer n representing the total number of bits in the code, print the sequence of gray code. A gray code sequence must begin with 0.

For example, given n = 2, return [0,1,3,2]. Its gray code sequence is:

```
00 - 0
01 - 1
11 - 3
10 - 2
```
<!--more-->
Note:
For a given n, a gray code sequence is not uniquely defined.

For example, [0,2,3,1] is also a valid gray code sequence according to the above definition.

For now, the judge is able to judge based on one instance of gray code sequence. Sorry about that.

```
public class Solution {
    public List<Integer> grayCode(int n) {
		List list=new LinkedList<>();
        int length=1<<n;
        for(int i=0;i<length;i++)
        	list.add(i^(i>>1));
        return list;
    }
}
```

格雷码的是特点是：
相邻两数的格雷码，仅仅有一位二进制发生变化。
而且在其范围内的最小值和最大值，也仅仅有一位二进制发生变化。

```
000^000-->000

001^000-->001
010^001-->011

011^001-->010

100^010-->110

101^010-->111

110^011-->101

111^011-->100
```

每两个数字作为一组，每组之间都只会差一个数字，即最后一位，第一个是0，第二个是1.组内的两个数字与之异或的数字是相同的，所以保证了组内变换后两个数字一定会有差别，而且只会有一位差别.

组与组之间靠近的两个数字，后面一个将前面一个数字最右方连续的1全部置为0，然后在连续1前面一位置为1，而与他们异或的格式也很是类似。全都相对于本身右移一位，结果两两异或，数字相同的（1与1、0与0）结果为0，只在原本自身相对变化的两位出现交替，后面一个数字比前面一个数字在最前方多了一个1.

这样组内、组间都与前面数字差一位，保证了Gray Code的间隔都为1，而最大的数字与最小的数字也只差一位，因为异或的特性，使后面部分都变为了0.

递归生成码表

这种方法基于格雷码是反射码的事实，利用递归的如下规则来构造：
1位格雷码有两个码字
- (n+1)位格雷码中的前2n个码字等于n位格雷码的码字，按顺序书写，加前缀0
- (n+1)位格雷码中的后2n个码字等于n位格雷码的码字，按逆序书写，加前缀1

![](http://7xowaa.com1.z0.glb.clouddn.com/gray-code.png)