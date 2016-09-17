title: string全排列
date: 2016-09-14 22:24:06
tags:
- algorithm
categories: algorithm
---

# 字符串全排列 #

## 规则 ##

最简单的思路就是使用递归实现：

- 将最左边字符固定，后面的依次全排

- 上一步的依次安排实际上是一次小集合的字符串全排
<!--more-->
- 将次左边字符固定，剩下的全排

- 将此次左边固定...

- 直到最后一个数

- 第一轮结束，将原始字符串的最左边字符与次左边字符交换位置

- 按照上面的顺序依次进行

- 将原始字符串从左数第3位固定到最左边

- 依次进行

- ...直到左右进行完毕输出


## 实例 ##

举例来讲：原是字符串为'abc'

1. a固定，剩下两个准备全排

2. 剩下的两个中b固定，剩下的全排

3. 只剩下一个字符，完成一次输出

4. 一次递归后返回上一步，将c固定

5. 剩下b全排，输出

6. a固定的虽有结果输出完毕

7. 将b或c固定到首位

8. 按照上面顺序进行全排

# 实现 #

```c++
#include <iostream>
#include <cstring>
using namespace std;


void callFunc(char * str,int from,int to){
    if(to<=1)
        return ;
    if(from==to){
        for(int i=0;i<strlen(str);i++)
            cout<<str[i];
        cout<<'\n';
    }
    else{
        for(int i=from;i<to;i++){
            swap(str[from],str[i]);
            callFunc(str,from+1,to);
            swap(str[i],str[from]);
        }
    }
}

int main()
{

    char s[]={'a','b','c','d','\0'};
    callFunc(s,0,strlen(s));

    return 0;
}
```

上面要注意的是，`char s[]={'a','b','c','d'}`，当使用strlen函数计算字符数组长度是总是输出错误数值11，发现strlen函数使用的查询'\0'字符数组，上面字符数组没有字符串结尾字符，所以函数越界。或者可以直接使用string类型:


```c++
#include <iostream>
#include <cstring>
using namespace std;

void callFunc(string str,int from,int to){
    if(to<=1)
        return ;
    if(from==to){
        for(int i=0;i<3;i++)
            cout<<str[i];
        cout<<'\n';
    }
    else{
        for(int i=from;i<to;i++){
            swap(str[from],str[i]);
            callFunc(str,from+1,to);
            swap(str[i],str[from]);
        }
    }
}

int main()
{

    string xxx ="abc";
    cout<<xxx.size()<<endl;
    callFunc(xxx,0,3);

    return 0;
}
```