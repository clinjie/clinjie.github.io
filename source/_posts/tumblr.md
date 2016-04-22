title: 宅福利-Tumblr
date: 2016-04-20 22:17:22
tags: python
categories: python
---

![](http://7xowaa.com1.z0.glb.clouddn.com/tumblr.jpg)

本篇文章是[洗白种子文件](http://peihao.space/2016/03/16/alter_torrent/)的兄弟篇，也是为了安利一个宅男宅女极好的网站--[汤不热](https://www.tumblr.com/).


<!--more-->

*Tumblr（中文名：汤博乐）成立于2007年，是目前全球最大的轻博客网站，也是轻博客网站的始祖。Tumblr（汤博乐）是一种介于传统博客和微博之间的全新媒体形态，既注重表达，又注重社交，而且注重个性化设置，成为当前最受年轻人欢迎的社交网站之一。雅虎公司董事会2013年5月19日决定，以11亿美元收购Tumblr。*

tumblr是纯粹基于兴趣的社交网站，产品形态好用只是一个方面，更重要的是，可以只关注自己感兴趣的人和博客，而且不必为了维持真实好友关系和自己被期望的网络形象而去做一些自己不想做的事（比如逃避家长监控）

好了，不装x，目前国内青年使用Tumblr频率最高的动机不是为了寻觅上面叹为观止的写真、艺术创造，而是为了解决青春期荷尔蒙沉淀过多问题。Tumblr上面有大量的喜闻乐见的po主，他们经常更新自己的站点，包括一颗赛艇的pic和video。而且，最重要的，到目前为止，GFW还没有明确的将网站放到黑名单...


当你有了Tumblr博主账号之后，你可以轻松的访问获取他发布的每一条资源分享。然而可能因为服务器的缘故，国内请求受限，速度很慢，好吧，编程改变世界.|

```python
import re
import requests
Res=list()
Res1=list()
outputfile = open('result.txt','w')
blogname=input('plz input the username:')
def func(keys):
    for key in keys:
        baseurl = 'http://'+blogname.strip()+'.tumblr.com/api/read?type='+key+'&num=50&start='    #pic
        start = 0   #start from num zero
        while True:
            url = baseurl + str(start)
            pagecontent = requests.get(url).text
            if key=='photo':
                result=re.findall('<photo-url .*?>(.*?)</photo-url>',pagecontent)
                for item in result:
                    Res.append(item)
            else:
                result=re.findall('source src="(.*?)"',pagecontent)
                for item in result:
                    Res1.append(item)
            if (len(result) < 50):
                break
            else:
                start += 50
func(('video','photo'))
if Res:
    for item in Res:
        outputfile.writelines(item+'\n')
if Res1:
    for item in Res1:
        outputfile.writelines(item+'\n')
outputfile.close()

#dbdnsjzbebhsuiwbdbdjsnd       guoyua
```

运行上面的代码，输入正确的站主name，就可以在当前目录下的`result.txt`文件写入所有的pic和video。


听过实验，pic会有很多的重复内容，因为会返回原图的不同尺寸url，这里我没有对他进行排重获取高分辨率，因为我懒。不会告诉你在代码最后一行不小心留下了潘多拉魔盒.

[下载戳我](https://www.jianguoyun.com/p/DbSPNO0QpYz2BRi1qhM)

![](http://7xowaa.com1.z0.glb.clouddn.com/tumblr2.jpg)