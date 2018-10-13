title: tarjan强连通分量
date: 2015-12-02 22:24:06
tags: algorithm
categories: algorithm
---

# 引入 #

在有向图G中，如果两个顶点间至少存在一条路径，称两个顶点强连通(strongly connected)。如果有向图G的每两个顶点都强连通，称G是一个强连通图。非强连通图有向图的极大强连通子图，称为强连通分量(strongly connected components)。

下图中，子图{1,2,3,4}为一个强连通分量，因为顶点1,2,3,4两两可达。{5},{6}也分别是两个强连通分量。

![](http://www.cppblog.com/images/cppblog_com/sosi/WindowsLiveWriter/Tarjan_10D83/wps_clip_image-24103_thumb.png)

tarjan是一种由Robert Tarjan提出的求解有向图强连通分量的线性时间的算法。

## Tip ##

- DFN(n)为节点n搜索的次序编号(时间戳)，Low(n)为n或n的子树能够追溯到的最早的栈中节点的次序号。
<!--more-->
- Low数组是一个标记数组，记录该点所在的强连通子图所在搜索子树的根节点的DFN值

- 当DFN(n)=Low(n)时，栈里n以及n以上的顶点全部出栈，且刚刚出栈的就是一个极大强连通分量。

## 算法演示 ##

1. 从节点1开始DFS，把遍历到的节点加入栈中。搜索到节点u=6时，DFN[6]=LOW[6]，找到了一个强连通分量。退栈到u=v为止，{6}为一个强连通分量。

![](http://www.cppblog.com/images/cppblog_com/sosi/WindowsLiveWriter/Tarjan_10D83/wps_clip_image-16442_thumb.png)

2. 返回节点5，发现DFN[5]=LOW[5]，退栈后{5}为一个强连通分量。

![](http://www.cppblog.com/images/cppblog_com/sosi/WindowsLiveWriter/Tarjan_10D83/wps_clip_image-24939_thumb.png)

3. 返回节点3，继续搜索到节点4，把4加入堆栈。发现节点4向节点1有后向边，节点1还在栈中，所以LOW[4]=1。节点6已经出栈，(4,6)是横叉边，返回3，(3,4)为树枝边，所以LOW[3]=LOW[4]=1。

![](http://www.cppblog.com/images/cppblog_com/sosi/WindowsLiveWriter/Tarjan_10D83/wps_clip_image-17734_thumb.png)

4. 继续回到节点1，最后访问节点2。访问边(2,4)，4还在栈中，所以LOW[2]=DFN[4]=5。返回1后，发现DFN[1]=LOW[1]，把栈中节点全部取出，组成一个连通分量{1,3,4,2}。

![](http://www.cppblog.com/images/cppblog_com/sosi/WindowsLiveWriter/Tarjan_10D83/wps_clip_image-10846_thumb.png)

以上，求出了图中全部的三个强连通分量{1,3,4,2},{5},{6}。

运行Tarjan算法的过程中，每个顶点都被访问了一次，且只进出了一次堆栈，每条边也只被访问了一次，所以该算法的时间复杂度为O(N+M)。

Low[i]表示i所能直接或间接达到时间最小的顶点。(实际操作中Low[i]不一定最小，但不会影响程序的最终结果)


## 详解 ##

- 数组的初始化：当首次搜索到点p时，DFN与Low数组的值都为到该点的时间。

- 堆栈：每搜索到一个点，将它压入栈顶。

- 当点p有与点p'相连时，如果此时（时间为dnf[p]时）p'还未访问过，p的low值为两点的low值中较小的一个。

- 当点p有与点p'相连时，如果此时（时间为dfn[p]时）p'在栈中，p的low值为p的low值和p'的dfn值中较小的一个。

- 每当搜索到一个点经过以上操作后（也就是子树已经全部遍历）的low值等于dfn值，则将它以及在它之上的元素弹出栈。这些出栈的元素组成一个强连通分量。

- 继续搜索（或许会更换搜索的起点，因为整个有向图可能分为两个不连通的部分），直到所有点被遍历。

## 支撑 ##

1. Tarjan算法基于定理：在任何深度优先搜索中，同一强连通分量内的所有顶点均在同一棵深度优先搜索树中。也就是说，强连通分量一定是有向图的某个深搜树子树。

2. 可以证明，当一个点既是强连通子图Ⅰ中的点，又是强连通子图Ⅱ中的点，则它是强连通子图Ⅰ∪Ⅱ中的点。

3. low值记录该点所在强连通子图对应的搜索子树的根节点的Dfn值。该子树中的元素在栈中一定是相邻的，且根节点在栈中一定位于所有子树元素的最下方。

4. 强连通分量由若干个环组成的。所以，当有环形成时（也就是搜索的下一个点已在栈中），我们将这一条路径的low值统一，即这条路径上的点属于同一个强连通分量。

5. 如果遍历完整个搜索树后某个点的dfn值等于low值，则它是该搜索子树的根。这时，它以上（包括它自己）一直到栈顶的所有元素组成一个强连通分量。

# 实现 #

## 伪代码 ##

```
tarjan(u)
{
    DFN[u]=Low[u]=++Index//为节点u设定次序编号和Low初值
    Stack.push(u)//将节点u压入栈中
    for each(u,v) in E//枚举每一条边
        if (v is not visted)//如果节点v未被访问过
            tarjan(v)//继续向下找
            Low[u]=min(Low[u],Low[v])
        else if (v in S)//如果节点v还在栈内
                Low[u]=min(Low[u],DFN[v])
    if (DFN[u]==Low[u])//如果节点u是强连通分量的根
    repeat{
        v=S.pop//将v退栈，为该强连通分量中一个顶点
        print v
        until(u==v)
    }
```

## C++实现 ##

```C++
#define M 9999//题目中可能的最大点数
int STACK[M],top=0;//Tarjan算法中的栈
bool InStack[M];//检查是否在栈中
int DFN[M];//深度优先搜索访问次序
 
int Low[M];//能追溯到的最早的次序
int ComponentNumber=0;//有向图强连通分量个数
int Index=0;//索引号
vector<int> Edge[M];//邻接表表示
int InComponent[M];//记录每个点在第几号强连通分量里
int ComponentDegree[M];//记录每个强连通分量的度
 
void Tarjan(int i)
{
    int j;
    DFN[i]=Low[i]=Index++;
	isvisted[i]=1;
    InStack[i]=true;
	STACK[++top]=i;
    for (int e=0;e<Edge[i].size();e++)
    {
        j=Edge[i][e];
        if (DFN[j]==-1)//（i，e）中e还未被访问过
        {
            Tarjan(j);
            Low[i]=min(Low[i],Low[j]);
        }
        else if (InStack[j]) 
				Low[i]=min(Low[i],Low[j]);
    }
    if (DFN[i]==Low[i])
    {
        ComponentNumber++;
        do{
            j=STACK[top--];
            InStack[j]=false;
            push_back(j);
            InComponent[j]=ComponentNumber;
        }
        while (j!=i);
    }
}
```