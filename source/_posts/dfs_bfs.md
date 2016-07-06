title: 图的遍历
date: 2016-07-04 22:24:06
toc: true
tags: algorithm
categories: algorithm
---

一般来讲，图的遍历主要分为深度优先遍历（DFS，Depth-First Traversa）和广度优先遍历（BFS,Breadth-First Traversa）。

# DFS #

在G中任选一顶点v为初始出发点(源点)，则深度优先遍历可定义如下：

首先访问出发点v，并将其标记为已访问过；

依次从v出发搜索v的每个邻接点w。若w未曾访问过，则以w为新的出发点继续进行深度优先遍历，直至图中所有和源点v有路径相通的顶点(亦称为从源点可达的顶点)均已被访问为止。


若此时图中仍有未访问的顶点，则另选一个尚未访问的顶点作为新的源点重复上述过程，直至图中所有顶点均已被访问为止。可以看出深度优先遍历是一个递归的过程。

<!--more-->

图的深度优先遍历类似于树的前序遍历。采用的搜索方法的特点是尽可能先对纵深方向进行搜索。这种搜索方法称为深度优先搜索(Depth-First Search)。相应地，用此方法遍历图就很自然地称之为图的深度优先遍历。

## 图例 ##

![](http://pic002.cnblogs.com/images/2011/288799/2011071509060990.jpg)

上图的DFS遍历顺序为：


`0->1->3->7->4->2->5->6`

## 实现 ##

- 邻接矩阵

```c++
//visited数组维持图中节点是否已经访问
//Edge[u][v]维持从u->v连线的权值，u==v时权值为0，两节点不可达则Max
void AdjMWGraph::Depth(int v,int visited[])
{ 
   	visited[v]=1;
 	for(int u=0;u<numV;u++)
  	{ 
		if(Edge[v][u]==0||Edge[v][u]==MaxWeight)
			continue;
    	if(!visited[u])
			//继续递归
			Delpth(u,visited);
	}
}
```

时间复杂度O（n2）

- 邻接表形式

```c++
Void AdjTWGraph::DepthFirst(int v, int visited[])
{ 
	int vj; 
	Edge *p;
  	visited[v]=1;
  	p=Vertices[v].adj;     //取v的邻接边结点
  	while(p!=NULL)
  	{
		vj=p->dest;       //取v的邻接点编号
   		if(visited[vj]==0)
			DepthFirst(vj, visited);
   		p=p->next;       //取下一个邻接边结点
	}
}
```

O(n+e)

## 应用 ##

搜索引擎搜索优化、八皇后问题

# BFS #

1. 从图中某个顶点V0出发，并访问此顶点；

2. 从V0出发，访问V0的各个未曾访问的邻接点W1，W2，…,Wk;然后,依次从W1,W2…,Wk出发访问各自未被访问的邻接点；

3. 重复步骤2，直到全部顶点都被访问为止。

## 图例 ##

依然使用之前的图

![](http://pic002.cnblogs.com/images/2011/288799/2011071509060990.jpg)

上图的DFS遍历顺序为：


`0->1->2->3->4->5->6->7`

## 实现 ##

- 邻接矩阵形式

```c++
void AdjMWGraph::Depth(int v,int visited[])
{  
	sqQueue<int> q;        //定义队列queue
   	q.EnQueue(v);        //顶点v入队列
   	while(!q.IsEmpty())        //当队列非空时循环
	{  
		v=q.DeQueue();        //出队列得到队头顶点u
        cout<<endl<<"顶点"<<v+1<<"权值："<<Vertices[col];//访问定点v          
        visited[col]=1;//标记顶点v已访问
        for(int col=0;col<numV;col++)
			//v到col之间可达，同时col节点从未被访问
        	if(Edge[v][col]>0&&Edge[v][col]<MaxWeight&&visited[col]==0)
        		q.EnQueue(col);
	}
}
```

O（n2）

- 邻接表形式

```c++
void AdjTWGraph::BroadFirst(int v, int visited[])
{   
	int vj;   
	Edge *p;   
	SqQueue <int> Q; 
	Q.EnQueue(v);
    while(!Q.IsEmpty())               //队列不空，循环
	{   
		v=Q.DeQueue();         //出队并且访问顶点v   
		visited[v]=1;
      	p=Vertices[v].adj;             //取v的邻接边结点
    	while(p!=NULL)   
		{ 
			vj=p->dest;     //取v的邻接点编号vj
     		if(visited[vj]==0) 
				Q.EnQueue(vj);             //vj未访问，入队
       		p=p->next;             //取下一个邻接边结点
    }
   }
}
```
O（n+e）

## 应用 ##

广度优先生成树、最短路径（Dijkstra）