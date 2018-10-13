title: 2015.9CCF认证试题（3）
date: 2015-11-30 17:37:22
tags: algorithm
categories: algorithm
---

>代码来源[逍遥丶綦-最佳文章》](http://blog.csdn.net/qwb492859377/article/details/50950293)

# 最佳文章 #

## 问题描述 ##

- 小明最近在研究一门新的语言，叫做Q语言。Q语言单词和文章都可以用且仅用只含有小写英文字母的字符串表示，任何由这些字母组成的字符串也都是一篇合法的Q语言文章。
　　
- 在Q语言的所有单词中，小明选出了他认为最重要的n个。使用这些单词，小明可以评价一篇Q语言文章的“重要度”。
　　
- 文章“重要度”的定义为：在该文章中，所有重要的Q语言单词出现次数的总和。其中多次出现的单词，不论是否发生包含、重叠等情况，每次出现均计算在内。
<!--more-->
- 例如，假设n = 2，小明选出的单词是gvagv和agva。在文章gvagvagvagv中，gvagv出现了3次，agva出现了2次，因此这篇文章的重要度为3+2=5。
　　
>现在，小明想知道，一篇由m个字母组成的Q语言文章，重要度最高能达到多少。

## 输入格式 ##
　　
输入的第一行包含两个整数n, m，表示小明选出的单词个数和最终文章包含的字母个数。
　　
接下来n行，每行包含一个仅由英文小写字母构成的字符串，表示小明选出的这n个单词。

## 输出格式 ##
　　
输出一行一个整数，表示由m个字母组成的Q语言文章中，重要度最高的文章的重要度。

## 样例 ##

- 输入

3 15

agva

agvagva

gvagva

- 输出

11

- 说明

15个字母组成的重要度最高的文章为gvagvagvagvagva。
　　

在这篇文章中，agva出现4次，agvagva出现3次，gvagva出现4次，共计4+3+4=11次。

## 测评 ##

在评测时将使用10个评测用例对你的程序进行评测。
　　

设s为构成n个重要单词字母的总个数，例如在样例中，s=4+7+6=17；a为构成n个重要单词字母的种类数，例如在样例中，共有3中字母'a','g','v'，因此a=3。
　　

评测用例1和2满足2 ≤ n ≤ 3，1500 ≤ m ≤ 2000，s = 40；
　　

评测用例3和4满足m = 20，2 ≤ a ≤ 3；
　　

评测用例5、6和7满足2000 ≤ m ≤ 100000；
　　

评测用例8满足n = 2；
　　

所有的评测用例满足1 ≤ s ≤ 100，1 ≤ m ≤ 1015，每个单词至少包含1个字母，保证

单词中仅出现英文小写字母，输入中不含多余字符，不会出现重复的单词。

# 实现 #

```c++
#include <map>
#include <set>
#include <cmath>
#include <ctime>
#include <Stack>
#include <queue>
#include <cstdio>
#include <cctype>
#include <bitset>
#include <string>
#include <vector>
#include <cstring>
#include <iostream>
#include <algorithm>
#include <functional>
#define fuck(x) cout << "[" << x << "]"
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;
typedef vector<LL> vec;
typedef vector<vec> mat;//二维数组

const int MX = 1e4 + 5;
const LL INF = 0x3f3f3f3f3f3f3f3f;

int rear, root;

//Next二维数组中26个空间分别对26个小写英文字母进行试探
//Fail数组保存Trie树元素的Fail指针
//End数组进行词标记
int Next[MX][26], Fail[MX], End[MX];

//申请Trie元素节点并初始化
int New() {
    rear++;
    End[rear] = 0;
    for(int i = 0; i < 26; i++) {
        Next[rear][i] = -1;
    }
    return rear;
}

//初始化Trie树
void Init() {
    rear = 0;
    root = New();
}

//Trie树增加元素节点
void Add(char *A) {
    int n = strlen(A), now = root;
    for(int i = 0; i < n; i++) {
        int id = A[i] - 'a';
        if(Next[now][id] == -1) {
            Next[now][id] = New();
        }
        now = Next[now][id];
    }
    End[now]++;
}

//二维矩阵填充值val
void mat_fill(mat &A, LL val) {
    for(int i = 0; i < A.size(); i++) {
        for(int j = 0; j < A[0].size(); j++) {
            A[i][j] = val;
        }
    }
}


mat Build() {
    queue<int>Q;
    Fail[root] = root;
    for(int i = 0; i < 26; i++) {
        if(Next[root][i] == -1) {
            Next[root][i] = root;
        } else {
            Fail[Next[root][i]] = root;
            Q.push(Next[root][i]);
        }
    }
    while(!Q.empty()) {
        int u = Q.front(); 
		Q.pop();
        End[u] += End[Fail[u]];
        for(int i = 0; i < 26; i++) {
            if(Next[u][i] == -1) {
                Next[u][i] = Next[Fail[u]][i];
            } else {
                Fail[Next[u][i]] = Next[Fail[u]][i];
                Q.push(Next[u][i]);
            }
        }
    }
    mat A(rear, vec(rear));
    mat_fill(A, -INF);
    for(int i = 1; i <= rear; i++) {
        for(int j = 0; j < 26; j++) {
            int chd = Next[i][j];
            A[chd - 1][i - 1] = End[chd];
        }
    }
    return A;
}


//矩阵乘法
mat mat_mul(mat &A, mat &B) {
    mat C(A.size(), vec(B[0].size()));
    mat_fill(C, -INF);
    for(int i = 0; i < A.size(); i++) {
        for(int j = 0; j < B[0].size(); j++) {
            for(int k = 0; k < B.size(); k++) {
                if(A[i][k] + B[k][j] >= 0) {
                    C[i][j] = max(C[i][j], A[i][k] + B[k][j]);
                }
            }
        }
    }
    return C;
}


//矩阵快速幂优化
mat mat_pow(mat A, LL n) {
    mat B = A; n--;
    while(n) {
        if(n & 1) B = mat_mul(B, A);
        A = mat_mul(A, A);
        n >>= 1;
    }
    return B;
}


void print(mat &A) {
    for(int i = 0; i < A.size(); i++) {
        for(int j = 0; j < A[0].size(); j++) {
            fuck(A[i][j]);
        } printf("\n");
    }
}

char S[MX];

int main() {
    int n; LL m;
    scanf("%d%lld", &n, &m);
    Init();
    for(int i = 1; i <= n; i++) {
        scanf("%s", S);
        Add(S);
    }
    mat A = Build();
    A = mat_pow(A, m);

    LL ans = 0;
    for(int i = 0; i < rear; i++) {
        ans = max(ans, A[i][0]);
    }
    printf("%lld\n", ans);
    return 0;
}
```