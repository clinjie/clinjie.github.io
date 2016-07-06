title: 2015.9CCF认证试题（2）
date: 2015-11-28 17:37:22
tags: algorithm
toc: true
categories: algorithm
---


# 模板生成 #

## 问题描述 ##

成成最近在搭建一个网站，其中一些页面的部分内容来自数据库中不同的数据记录，但是页面的基本结构是相同的。例如，对于展示用户信息的页面，当用户为 Tom 时，网页的源代码是

![](http://115.28.138.223/RequireFile.do?fid=Mbg3eNaq)

而当用户为 Jerry 时，网页的源代码是

![](http://115.28.138.223/RequireFile.do?fid=69mbB6TA)


这样的例子在包含动态内容的网站中还有很多。为了简化生成网页的工作，成成觉得他需要引入一套模板生成系统.

模板是包含特殊标记的文本。成成用到的模板只包含一种特殊标记，格式为`{{ VAR }}`，其中`VAR`是一个变量。该标记在模板生成时会被变量`VAR`的值所替代。

例如，如果变量`name = "Tom"`，则`{{ name }}`会生成`Tom`。具体的规则如下：
　　
- 变量名由大小写字母、数字和下划线`(_)`构成，且第一个字符不是数字，长度不超过 16个字符。

- 变量名是大小写敏感的，`Name`和`name`是两个不同的变量。 　

- 变量的值是字符串。 　

- 如果标记中的变量没有定义，则生成空串，相当于把标记从模板中删除。 　
<!--more-->
- 模板不递归生成。也就是说，如果变量的值中包含形如`{{ VAR }}`的内容，不再做进一步的替换。


1. 输入格式
　　
输入的第一行包含两个整数 m, n，分别表示模板的行数和模板生成时给出的变量个数。接下来 m 行，每行是一个字符串，表示模板。
　　

接下来 n 行，每行表示一个变量和它的值，中间用一个空格分隔。值是字符串，用双引号 (") 括起来，内容可包含除双引号以外的任意可打印 ASCII 字符（ASCII 码范围 32, 33, 35~126）。

2. 输出格式
　　
输出包含若干行，表示模板生成的结果。

- 样例输入

```html
11 2
< !DOCTYPE html>
< html>
< head>
< title>User {{ name }}</title>
< /head>
< body>
< h1>{{ name }}</h1>
< p>Email: <a href="mailto:{{ email }}">{{ email }}</a></p>
< p>Address: {{ address }}</p>
< /body>
< /html>
name "David Beckham"
email "david@beckham.com"
```



- 样例输出
 

```html
<!DOCTYPE html>
< html>
< head>
< title>User David Beckham</title>
< /head>
< body>
< h1>David Beckham</h1>
< p>Email: <a href="mailto:david@beckham.com">david@beckham.com</a></p>
< p>Address: </p>
< /body>
< /html>
```

- 评测用例规模与约定

1. 0 ≤ m ≤ 100 　　0 ≤ n ≤ 100 　　

2. 输入的模板每行长度不超过80个字符（不包含换行符）。 　

3. 输入保证模板中所有以`{{`开始的子串都是合法的标记，开始是两个左大括号和一个空格，然后是变量名，结尾是一个空格和两个右大括号`}}`。

4. 输入中所有变量的值字符串长度不超过100个字符（不包括双引号）。 　

5. 保证输入的所有变量的名字各不相同。


## 实现 ##

```c++
#include <iostream>
#include <string.h>
#include <cstdio>

using namespace std;

int main()
{
    int m,n;
    bool flag;
    cin>>m>>n;
    getchar();
    string src[m],des[m];
    string varstr[n][2];
    for(int i=0;i<m;i++)
        getline(cin,src[i]);
    for(int i=0;i<n;i++)
    {
        cin>>varstr[i][0];
        getline(cin,varstr[i][1]);
        int start=varstr[i][1].find("\"");
        int end=varstr[i][1].rfind("\"");
        varstr[i][1]=varstr[i][1].substr(start+1,end-start-1);
    }

    for(int i=0;i<m;i++){
        while(true){
            flag=false;
            int startx=src[i].find("{{");
            int endx=src[i].find("}}");
            if(startx<0||endx<0)break;
            string var=src[i].substr(startx+3,endx-startx-4);
            for(int i=0;i<n;i++){
                if(var==varstr[i][0]){
                    flag=true;
                    var=varstr[i][1];
                    break;
                }
            }
            if(!flag)var="";
            des[i]=des[i]+src[i].substr(0,startx)+var;
            src[i]=src[i].substr(endx+2,src[i].length()-endx-2);
        }
        des[i]=des[i]+src[i];
        cout<<des[i]<<endl;
    }

    return 0;
}
```


# 高速公路 #

## 问题描述 ##

>某国有n个城市，为了使得城市间的交通更便利，该国国王打算在城市之间修一些高速公路，由于经费限制，国王打算第一阶段先在部分城市之间修一些单向的高速公路。 现在，大臣们帮国王拟了一个修高速公路的计划。看了计划后，国王发现，有些城市之间可以通过高速公路直接（不经过其他城市）或间接（经过一个或多个其他城市）到达，而有的却不能。如果城市A可以通过高速公路到达城市B，而且城市B也可以通过高速公路到达城市A，则这两个城市被称为便利城市对。 国王想知道，在大臣们给他的计划中，有多少个便利城市对。 

- 输入格式 

输入的第一行包含两个整数n, m，分别表示城市和单向高速公路的数量。 
接下来m行，每行两个整数a, b，表示城市a有一条单向的高速公路连向城市b。 

- 输出格式 
　　
输出一行，包含一个整数，表示便利城市对的数量。 

- 样例输入 

5 5 

1 2 

2 3 

3 4 

4 2 

3 5 

- 样例输出 

3 

- 样例说明 

有3个便利城市对，它们分别是(2, 3), (2, 4), (3, 4)，请注意(2, 3)和(3, 2)看成同一个便利城市对。 

- 评测用例规模与约定 

1. 前30%的评测用例满足1 ≤ n ≤ 100, 1 ≤ m ≤ 1000； 

2. 前60%的评测用例满足1 ≤ n ≤ 1000, 1 ≤ m ≤ 10000； 

3. 所有评测用例满足1 ≤ n ≤ 10000, 1 ≤ m ≤ 100000


## 实现 ##

```c++
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <vector>
#include <stack>
using namespace std;
#define maxn 10005

vector<int> G[maxn];
stack<int> s;

int dfn[maxn];
int low[maxn];
int in_stack[maxn];
int col_num[maxn];
int vis[maxn];


int cur_time, color;
void tarjan(int u){
    dfn[u]=low[u]=cur_time++;
    s.push(u);
    in_stack[u]=1;
    vis[u]=1;

    int d=G[u].size();
    for(int i=0;i<d;i++){
        int v=G[u][i];
        if(!vis[v]){
		//防止v是之前已被访问过、但已出栈，所以不使用in_stack，因为不可能跟
		//上述情况的v节点构成强连通分量
            tarjan(v);
            low[u]=min(low[u],low[v]);
        }
        else if(in_stack[v]){
		//强连通分量必定是相邻的，一起在栈中
            low[u]=min(low[u],dfn[v]);
        }
    }

    if(dfn[u]==low[u]){
        color++;
        int v;
        do{
            v=s.top();
            s.pop();
            in_stack[v]=0;
            col_num[color]++;
        }while(u!=v);
    }
}

int main()
{
    int n,m;
    while(scanf("%d %d",&n,&m)!=EOF){
        for(int i=0;i<m;i++){
            int u,v;
            scanf("%d %d",&u,&v);
            G[u].push_back(v);
        }
        while(!s.empty())s.pop();
        cur_time=0;
        color=0;
        memset(col_num, 0, sizeof(col_num));
        memset(in_stack, 0, sizeof(in_stack));
        memset(vis, 0, sizeof(vis));
        for(int i=1;i<=n;i++){
            if(!vis[i])tarjan(i);
        }
        int res=0;
        for(int i=1;i<=color;i++){
            if(col_num[i]>1){
                res+=(col_num[i]*(col_num[i]-1))/2;
            }
        }
        cout<<res<<endl;
    }
    return 0;
}
```