title: AC自动机
date: 2016-07-21 22:24:06
toc: true
tags:
- algorithm
- 模式匹配
categories: algorithm
---


>文章大部分内容参考自[CSDN--飘过的小牛](http://blog.csdn.net/niushuai666/article/details/7002823)


>AC自动机，全程是Aho-Corasick automaton，该算法在1975年产生于贝尔实验室，是著名的多模匹配算法。

要讲清楚比较吃力，直接上实例边消化边理解会好很多。


# 示例 #

## 构造 ##

1. 构造一棵Trie，作为AC自动机的搜索数据结构。

2. 构造fail指针，使当前字符失配时跳转到具有最长公共前后缀的字符继续匹配。如同 KMP算法一样， AC自动机在匹配时如果当前字符匹配失败，那么利用fail指针进行跳转。由此可知如果跳转，跳转后的串的前缀，必为跳转前的模式串的后缀并且跳转的新位置的深度（匹配字符个数）一定小于跳之前的节点。所以我们可以利用 bfs在 Trie上面进行 fail指针的求解。

3. 扫描主串进行匹配。

<!--more-->
## 过程记录 ##

给出5个单词，say，she，shr，he，her。给定字符串为yasherhs。问多少个单词在字符串中出现过

首先我们需要建立一棵Trie。但是这棵Trie不是普通的Trie，而是带有一些特殊的性质。

Trie树有3个重要的指针，分别为p, p->fail, temp。

1. 指针p，指向当前匹配的字符。若p指向root，表示当前匹配的字符序列为空。（root是Trie入口，没有实际含义）。

2. 指针p->fail，p的失败指针，指向与字符p相同的结点，若没有，则指向root。

3. 指针temp，测试指针（自己命名的，容易理解！~），在建立fail指针时有寻找与p字符匹配的结点的作用，在扫描时作用最大，也最不好理解。

[](http://www.cppblog.com/images/cppblog_com/mythit/ac1.jpg)


## 构造fail ##

用BFS来构造失败指针，与KMP算法相似的思想。

- 首先，root入队，第1次循环时处理与root相连的字符，也就是各个单词的第一个字符h和s，因为第一个字符不匹配需要重新匹配，所以第一个字符都指向root（root是Trie入口，没有实际含义）失败指针的指向对应下图中的(1)，(2)两条虚线；

- 第2次进入循环后，从队列中先弹出h，接下来p指向h节点的fail指针指向的节点，也就是root；p=p->fail也就是p=NULL说明匹配序列为空，则把节点e的fail指针指向root表示没有匹配序列，对应图-2中的(3)，然后节点e进入队列；

- 第3次循环时，弹出的第一个节点a的操作与上一步操作的节点e相同，把a的fail指针指向root，对应图-2中的(4)，并入队；

- 第4次进入循环时，弹出节点h(图中左边那个)，这时操作略有不同。由于p->next[i]!=NULL(root有h这个儿子节点，图中右边那个)，这样便把左边那个h节点的失败指针指向右边那个root的儿子节点h，对应图-2中的(5)，然后h入队。

- 以此类推：在循环结束后，所有的失败指针就是图-2中的这种形式。

## 扫描遍历 ##

[](http://www.cppblog.com/images/cppblog_com/mythit/ac2.JPG)

构造好Trie和失败指针后，我们就可以对主串进行扫描了。这个过程和KMP算法很类似，但是也有一定的区别，主要是因为AC自动机处理的是多串模式，需要防止遗漏某个单词，所以引入temp指针。
匹配过程分两种情况：(1)当前字符匹配，表示从当前节点沿着树边有一条路径可以到达目标字符，此时只需沿该路径走向下一个节点继续匹配即可，目标字符串指针移向下个字符继续匹配；(2)当前字符不匹配，则去当前节点失败指针所指向的字符继续匹配，匹配过程随着指针指向root结束。重复这2个过程中的任意一个，直到模式串走到结尾为止。

对照上图，看一下模式匹配这个详细的流程，其中模式串为yasherhs。

- 对于i=0,1。Trie中没有对应的路径，故不做任何操作；

- i=2,3,4时，指针p走到左下节点e。因为节点e的count信息为1，所以cnt+1，并且讲节点e的count值设置为-1，表示改单词已经出现过了，防止重复计数，最后temp指向e节点的失败指针所指向的节点(即图中右边相同的e节点开始)继续查找，以此类推，最后temp指向root，退出while循环，这个过程中count增加了2。表示找到了2个单词she和he。

- 当i=5时，程序进入第5行，p指向其失败指针的节点，也就是右边那个e节点，随后在第6行指向r节点，r节点的count值为1，从而count+1，循环直到temp指向root为止。

- 最后i=6,7时，找不到任何匹配，匹配过程结束。


# 实现 #

## HDU2222 ##

- Input

First line will contain one integer means how many cases will follow by.
Each case will contain two integers N means the number of keywords and N keywords follow. (N <= 10000)
Each keyword will only contains characters 'a'-'z', and the length will be not longer than 50.
The last line is the description, and the length will be not longer than 1000000.


- Output

Print how many keywords are contained in the description.

- Sample Input

1
5
she
he
say
shr
her
yasherhs

- Sample Output

3


```c++
#include <stdio.h>
#include <algorithm>
#include <iostream>
#include <string.h>
#include <queue>
using namespace std;

struct Trie
{
    int next[500010][26],fail[500010],end[500010];
    int root,L;
    int newnode()
    {
        for(int i = 0;i < 26;i++)
            next[L][i] = -1;
        end[L++] = 0;
        return L-1;
    }
    void init()
    {
        L = 0;
        root = newnode();
    }
    void insert(char buf[])
    {
        int len = strlen(buf);
        int now = root;
        for(int i = 0;i < len;i++)
        {
            if(next[now][buf[i]-'a'] == -1)
                next[now][buf[i]-'a'] = newnode();
            now = next[now][buf[i]-'a'];
        }
        end[now]++;
    }
    void build()
    {
        queue<int>Q;
        fail[root] = root;
        for(int i = 0;i < 26;i++)
            if(next[root][i] == -1)
                next[root][i] = root;
            else
            {
                fail[next[root][i]] = root;
                Q.push(next[root][i]);
            }
        while( !Q.empty() )
        {
            int now = Q.front();
            Q.pop();
            for(int i = 0;i < 26;i++)
                if(next[now][i] == -1)
                    next[now][i] = next[fail[now]][i];
                else
                {
                    fail[next[now][i]]=next[fail[now]][i];
                    Q.push(next[now][i]);
                }
        }
    }
    int query(char buf[])
    {
        int len = strlen(buf);
        int now = root;
        int res = 0;
        for(int i = 0;i < len;i++)
        {
            now = next[now][buf[i]-'a'];
            int temp = now;
            while( temp != root )
            {
                res += end[temp];
                end[temp] = 0;
                temp = fail[temp];
            }
        }
        return res;
    }
    void debug()
    {
        for(int i = 0;i < L;i++)
        {
            printf("id = %3d,fail = %3d,end = %3d,chi = [",i,fail[i],end[i]);
            for(int j = 0;j < 26;j++)
                printf("%2d",next[i][j]);
            printf("]\n");
        }
    }
};
char buf[1000010];
Trie ac;
int main()
{
    int T;
    int n;
    scanf("%d",&T);
    while( T-- )
    {
        scanf("%d",&n);
        ac.init();
        for(int i = 0;i < n;i++)
        {
            scanf("%s",buf);
            ac.insert(buf);
        }
        ac.build();
        scanf("%s",buf);
        printf("%d\n",ac.query(buf));
    }
    return 0;
}
```

## 位置记录 ##

- 模式串集合：{"nihao","hao","hs","hsr"}

- 待匹配文本："sdmfhsgnshejfgnihaofhsrnihao"

```
#include<iostream>
#include<string.h>
#include<malloc.h>
#include <queue>
using namespace std;

typedef struct node{
    struct node *next[26];  //接收的态
    struct node *par;   //父亲节点
    struct node *fail;  //失败节点
    char inputchar;
    int patterTag;    //是否为可接收态
    int patterNo;   //接收态对应的可接受模式
}*Tree,TreeNode;
char pattern[4][30]={"nihao","hao","hs","hsr"};

/**
申请新的节点，并进行初始化
*/
TreeNode *getNewNode()
{
    int i;
    TreeNode* tnode=(TreeNode*)malloc(sizeof(TreeNode));
    tnode->fail=NULL;
    tnode->par=NULL;
    tnode->patterTag=0;
    for(i=0;i<26;i++)
        tnode->next[i]=NULL;
    return tnode;
}

/**
将Trie树中，root节点的分支节点，放入队列
*/
int  nodeToQueue(Tree root,queue<Tree> &myqueue)
{
    int i;
    for (i = 0; i < 26; i++)
    {
        if (root->next[i]!=NULL)
            myqueue.push(root->next[i]);
    }
    return 0;
}

/**
建立trie树
*/
Tree buildingTree()
{
    int i,j;
    Tree root=getNewNode();
    Tree tmp1=NULL,tmp2=NULL;
    for(i=0;i<4;i++)
    {
        tmp1=root;
        for(j=0;j<strlen(pattern[i]);j++)   ///对每个模式进行处理
        {
            if(tmp1->next[pattern[i][j]-'a']==NULL) ///是否已经有分支，Trie共用节点
            {
                tmp2=getNewNode();
                tmp2->inputchar=pattern[i][j];
                tmp2->par=tmp1;
                tmp1->next[pattern[i][j]-'a']=tmp2;
                tmp1=tmp2;
            }
            else
                tmp1=tmp1->next[pattern[i][j]-'a'];
        }
        tmp1->patterTag=1;
        tmp1->patterNo=i;
    }
    return root;
}

/**
建立失败指针
*/
int buildingFailPath(Tree root)
{
    int i;
    char inputchar;
    queue<Tree> myqueue;
    root->fail=root;
    for(i=0;i<26;i++)   ///对root下面的第二层进行特殊处理
    {
        if (root->next[i]!=NULL)
        {
            nodeToQueue(root->next[i],myqueue);
            root->next[i]->fail=root;
        }
    }

    Tree tmp=NULL,par=NULL;
    while(!myqueue.empty())
    {
        tmp=myqueue.front();
        myqueue.pop();
        nodeToQueue(tmp,myqueue);

        inputchar=tmp->inputchar;
        par=tmp->par;

        while(true)
        {
            if(par->fail->next[inputchar-'a']!=NULL)
            {
                tmp->fail=par->fail->next[inputchar-'a'];
                break;
            }
            else
            {
                if(par->fail==root)
                {
                    tmp->fail=root;
                    break;
                }
                else
                    par=par->fail->par;
            }
        }
    }
    return 0;
}

/**
进行多模式搜索，即搜寻AC自动机
*/
int searchAC(Tree root,char* str,int len)
{
    TreeNode *tmp=root;
    int i=0;
    while(i < len)
    {
        int pos=str[i]-'a';
        if (tmp->next[pos]!=NULL)
        {
            tmp=tmp->next[pos];
            if(tmp->patterTag==1)    ///如果为接收态
            {
                cout<<i-strlen(pattern[tmp->patterNo])+1<<'\t'<<tmp->patterNo<<'\t'<<pattern[tmp->patterNo]<<endl;
            }
            i++;
        }
        else
        {
            if(tmp==root)
                i++;
            else
            {
                tmp=tmp->fail;
                if(tmp->patterTag==1)    //如果为接收态
                    cout<<i-strlen(pattern[tmp->patterNo])+1<<'\t'<<tmp->patterNo<<'\t'<<pattern[tmp->patterNo]<<endl;
            }
        }
    }
    while(tmp!=root)
    {
        tmp=tmp->fail;
        if(tmp->patterTag==1)
            cout<<i-strlen(pattern[tmp->patterNo])+1<<'\t'<<tmp->patterNo<<'\t'<<pattern[tmp->patterNo]<<endl;
    }
    return 0;
}

/**
释放内存，DFS
*/
int destory(Tree tree)
{
    if(tree==NULL)
        return 0;
    queue<Tree> myqueue;
    TreeNode *tmp=NULL;

    myqueue.push(tree);
    tree=NULL;
    while(!myqueue.empty())
    {
        tmp=myqueue.front();
        myqueue.pop();

        for (int i = 0; i < 26; i++)
        {
            if(tmp->next[i]!=NULL)
                myqueue.push(tmp->next[i]);
        }
        free(tmp);
    }
    return 0;
}

int main()
{
    char a[]="sdmfhsgnshejfgnihaofhsrnihao";
    Tree root=buildingTree();   ///建立Trie树
    buildingFailPath(root); ///添加失败转移
    cout<<"待匹配字符串："<<a<<endl;
    cout<<"模式"<<pattern[0]<<" "<<pattern[1]<<" "<<pattern[2]<<" "<<pattern[3]<<" "<<endl<<endl;
    cout<<"匹配结果如下："<<endl<<"位置\t"<<"编号\t"<<"模式"<<endl;
    searchAC(root,a,strlen(a)); ///搜索
    destory(root);  ///释放动态申请内存
    return 0;
}
```