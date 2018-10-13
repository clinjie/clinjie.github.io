title: DP介绍-二维苹果收集
date: 2016-04-26 23:17:22
tags: algorithm
categories: algorithm
---


# 问题引出 #

>平面上有N*M个格子，每个格子中放着一定数量的苹果。你从左上角的格子开始，每一步只能向下走或是向右走，每次走到一个格子上就把格子里的苹果收集起来，这样下去，你最多能收集到多少个苹果。

# 分析 #

问题最红需要我们求出整个格子里最终能收集到多少苹果，这个问题直接求解是没有办法的。我们可以换个办法依次趋近这个问题的结果。

>当前位置（x，y）能够获取的苹果数目最多是多少。

这个问题就比较好说了，因为到达当前位置的前置节点只有两个，也就是他的上方位置或左侧位置（先不讨论边界问题）。我们从格子的起点开始，每次获取当前位置上侧、左侧位置节点的苹果数目对比即可。

<!--more-->
毫无疑问，现在这个已经被我们分解的多个子问题的问题集已经符合DP问题的基本条件：

- 最优化原理（最优子结构性质） 

- 无后效性

- 子问题的重叠性

以`s[length][length]`记录每个格子包含的苹果数目，`dp[length][length]`记录到达当前节点最多获取的苹果数目，即子问题的状态。问题的状态转移方程：

`dp[x][y] = max( if(x>0) dp[x-1][y] , if(y>0) dp[x][y-1])`


# 实现 #

```c++
#include<iostream>
#include<string.h>
using namespace std;
int a[100][100];
int dp[100][100];
int m,n;

//递归版本
void dp_fun(int x,int y)
{
  dp[x][y] = a[x][y];
  int max = 0;
  if(x > 0 && max < dp[x-1][y])
    max = dp[x-1][y];
  if(y > 0 && max < dp[x][y-1])
    max = dp[x][y-1];
  dp[x][y] += max;
  if(x<m-1)
    dp_fun(x+1,y);	
  if(y<n-1)
    dp_fun(x,y+1);
  return;
} 

/*递推版本  调用dp_fun(m,n);
void dp_fun(int x,int y)
{
    /*dp[0][0]=a[0][0];
    for(int i=1;i<x;i++)
        dp[i][0]=dp[i-1][0]+a[i][0];
    for(int i=1;i<y;i++)
        dp[0][i]=dp[0][i-1]+a[0][i];
    for(int i=1;i<x;i++)
        for(int j=1;j<y;j++){
        int max_value=dp[i][j-1]>dp[i-1][j]?dp[i][j-1]:dp[i-1][j];
        dp[i][j]=a[i][j]+max_value;
        }*/
    for(int i=1;i<x;i++)
        a[i][0]=a[i-1][0]+a[i][0];
    for(int i=1;i<y;i++)
        a[0][i]=a[0][i-1]+a[0][i];
    for(int i=1;i<x;i++)
        for(int j=1;j<y;j++){
        int max_value=a[i][j-1]>a[i-1][j]?a[i][j-1]:a[i-1][j];
        a[i][j]+=max_value;
        }
    return;
}
*/

int main()
{
  memset(dp,0,sizeof(dp));
  //m、n代表格子的数目，在本例中<=100 
  cin>>m>>n;
  for(int i=0;i<m;i++)
    for(int j=0;j<n;j++)
      cin>>a[i][j];
  dp_fun(0,0);
  for(int i=0;i<m;i++)
  {
    for(int j=0;j<n;j++)
      cout<<dp[i][j]<<"\t";
    cout<<endl;
  }
  return 0;
}
```

![](http://peihao.space\img\article\DP-getapples.png)