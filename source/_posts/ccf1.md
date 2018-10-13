title: 2015/9CCF认证试题（1）
date: 2015-11-28 17:17:22
tags: algorithm
categories: algorithm
---


# 水题1 #

## 描述 ##

>给定一个整数数列，数列中连续相同的最长整数序列算成一段，问数列中共有多少段？
输入格式
输入的第一行包含一个整数n，表示数列中整数的个数。
第二行包含n个整数a1, a2, …, an，表示给定的数列，相邻的整数之间用一个空格分隔。

- 输出格式

输出一个整数，表示给定的数列有多个段。
- 样例输入

8

8 8 8 0 12 12 8 0
- 样例输出

5

- 样例说明

8 8 8是第一段，0是第二段，12 12是第三段，倒数第二个整数8是第四段，最后一个0是第五段。


## 实现 ##

```c++
#include <iostream>

using namespace std;
int main()
{
    int length;
    cin>>length;
    int code[length];
    cin>>code[0];
    int ans=0;
    if(length!=0)ans=1;
    for(int i=1;i<length;i++){
        cin>>code[i];
        if(code[i]!=code[i-1])
            ans++;
    }
    cout<<ans<<endl;
    return 0;
}
```
<!--more-->
# 水题 #

## 问题描述 ##
 
给定一个年份y和一个整数d，问这一年的第d天是几月几日？ 
注意闰年的2月有29天。满足下面条件之一的是闰年： 
1） 年份是4的整数倍，而且不是100的整数倍； 
2） 年份是400的整数倍。 

- 输入格式 

输入的第一行包含一个整数y，表示年份，年份在1900到2015之间（包含1900和2015）。 
输入的第二行包含一个整数d，d在1至365之间。 

- 输出格式 
　　
输出两行，每行一个整数，分别表示答案的月份和日期。 

- 样例输入 

2015 
80 

- 样例输出 

3 
21 

- 样例输入 

2000 

40 
- 样例输出 

2 
9


## 实现 ##

```c++
#include <iostream>

using namespace std;

bool isRun(int year){
    if(year%4==0&&year%100!=0)
        return true;
    if(year%400==0)
        return true;
    return false;
}

int main()
{
    int days[12]={31,28,31,30,31,30,31,31,30,31,30,31};
    int year,index;
    cin>>year>>index;
    bool isR=isRun(year);
    if(isR){
        //闰年操作
        days[1]=29;
        for(int i=1;i<12;i++)
            days[i]=days[i]+days[i-1];
        int month;
        for(int i=0;i<12;i++)
            if(index<days[i]){
                month=i+1;
                break;
            }
        cout<<month<<endl<<index-days[month-2]<<endl;
    }
    else{
        //普通年操作
        for(int i=1;i<12;i++)
            days[i]=days[i]+days[i-1];
        int month;
        for(int i=0;i<12;i++)
            if(index<days[i]){
                month=i+1;
                break;
            }
        cout<<month<<endl<<index-days[month-2]<<endl;
    }
    return 0;
}
```