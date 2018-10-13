title: Trie树
date: 2016-01-20 22:24:06
tags:
- algorithm
categories: algorithm
---


>文章大部分内容引用自Encyclopedia


>Trie树，即字典树。是一种树形结构，哈希树的变种。典型应用是用于统计，排序和保存大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。

Trie树可以用来作为搜索引擎中的分词处理手段。

# 描述 #

根节点不包含字符，除根节点外每一个节点都只包含一个字符； 从根节点到某一节点，路径上经过的字符连接起来，为该节点对应的字符串； 每个节点的所有子节点包含的字符都不相同。


## 实现 ##

1. 从根结点开始一次搜索；
<!--more-->
2. 取得要查找关键词的第一个字母，并根据该字母选择对应的子树并转到该子树继续进行检索；

3. 在相应的子树上，取得要查找关键词的第二个字母,并进一步选择对应的子树进行检索。

4. 迭代过程……

5. 在某个结点处，关键词的所有字母已被取出，则读取附在该结点上的信息，即完成查找。

## 示例 ##

给出say，she，shr，he，her这5个单词作为构造Trie树的元素，构造的Trie树应该是这样的。

![AC自动机算法-飘过的小牛](http://images.cppblog.com/cppblog_com/mythit/ac1.jpg)

## 应用 ##

- 串的快速检索

给出N个单词组成的熟词表，以及一篇全用小写英文书写的文章，请你按最早出现的顺序写出所有不在熟词表中的生词。
在这种问题下，我们可以用数组枚举、哈希、用字典树，先把熟词建一棵树，然后读入文章进行比较，这种方法效率是比较高的。

- “串”排序

给定N个互不相同的仅由一个单词构成的英文名，让你将他们按字典序从小到大输出
用字典树进行排序，采用数组的方式创建字典树，这棵树的每个结点的所有儿子很显然地按照其字母大小排序。对这棵树进行先序遍历即可。

- 最长公共前缀

对所有串建立字典树，对于两个串的最长公共前缀的长度即他们所在的结点的公共祖先个数，于是，问题就转化为当时公共祖先问题。

# C++实现 #


HDU1251

- Input

输入数据的第一部分是一张单词表,每行一个单词,单词的长度不超过10,它们代表的是老师交给Ignatius统计的单词,一个空行代表单词表的结束.第二部分是一连串的提问,每行一个提问,每个提问都是一个字符串.

注意:本题只有一组测试数据,处理到文件结束.

- Output

对于每个提问,给出以该字符串为前缀的单词的数量.


- Sample Input

banana
band
bee
absolute
acm

ba
b
band
abc

- Sample Output

2
3
1
0

```c++
#include<iostream>
#include<cstring>
using namespace std;

typedef struct Trie_node
{
	int count;                    // 统计单词前缀出现的次数
	struct Trie_node* next[26];   // 指向各个子树的指针
	bool exist;                   // 标记该结点处是否构成单词  
}TrieNode , *Trie;

TrieNode* createTrieNode()
{
	TrieNode* node = (TrieNode *)malloc(sizeof(TrieNode));
	node->count = 0;
	node->exist = false;
	memset(node->next , 0 , sizeof(node->next));    // 初始化为空指针
	return node;
}

void Trie_insert(Trie root, char* word)
{
	Trie node = root;
	char *p = word;
	int id;
	while( *p )
	{
		id = *p - 'a';
		if(node->next[id] == NULL)
		{
			node->next[id] = createTrieNode();
		}
		node = node->next[id];  // 每插入一步，相当于有一个新串经过，指针向下移动
		++p;
		node->count += 1;      // 这行代码用于统计每个单词前缀出现的次数（也包括统计每个单词出现的次数）
	}
	node->exist = true;        // 单词结束的地方标记此处可以构成一个单词
}

int Trie_search(Trie root, char* word)
{
	Trie node = root;
	char *p = word;
	int id;
	while( *p )
	{
		id = *p - 'a';
		node = node->next[id];
		++p;
		if(node == NULL)
			return 0;
	}
	return node->count;
}

int main(void)
{
    Trie root = createTrieNode();     // 初始化字典树的根节点
    char str[12] ;
	bool flag = false;
	while(gets(str))
	{
		if(flag)
			printf("%d\n",Trie_search(root , str));
		else
		{
			if(strlen(str) != 0)
			{
				Trie_insert(root , str);
			}
			else
				flag = true;
		}
	}

    return 0;
}
```