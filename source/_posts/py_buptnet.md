title: 校园网一键登录注销
date: 2016-09-12 22:23:35
tags: Python
categories: Python 
---

通过python的requests模块实现的一键登录、注销、查看校园网

<!--more-->
```python
# -*- coding: utf-8 -*-
import requests
import re

session=requests.session()

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 UBrowser/5.5.10106.5 Safari/537.36',
                           'Referer' : 'http://10.3.8.211/F.htm',
                           'Connection':'keep-alive',
                           'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                           'Accept-Encoding':'gzip, deflate'}

cookies={
    'myusername':'*****',#username
    'username':'******',#username
    'smartdot':'*****'#passwd
}

postData={
    'DDDDD':'*******',#username
    'upass':'******',#passwd
    '0MKKey':''
}

url='http://10.3.8.211'
detectx=session.get('http://10.3.8.211/')
detectx.encoding='GB2312'
result1=detectx.text
if re.findall('上网注销窗',result1):
    flow=(re.findall("flow='(.*?)'",result1))[0]
    flow=((float)(flow.strip()))/1024
    fee=(re.findall("fee='(.*?)'",result1))[0]
    fee=(float(fee.strip()))/10000
    print('已登陆\n流量使用： '+str(flow)+'MB\n剩余余额 ：'+str(fee)+'元')

    #str=raw_input('是否注销？')
    str=input('是否注销？')
    if str=='yes':
        session.get('http://10.3.8.211/F.htm')
        print('注销成功')
else :
    startLogin=session.post(url,data=postData)
    startLogin.encoding='GB2312'
    detectx=session.get(url)
    detectx.encoding='GB2312'
    result1=detectx.text
    flow=(re.findall("flow='(.*?)'",result1))[0]
    flow=((float)(flow.strip()))/1024
    fee=(re.findall("fee='(.*?)'",result1))[0]
    fee=(float(fee.strip()))/10000
    print('登陆成功\n流量使用： '+str(flow)+'MB\n剩余余额 ：'+str(fee)+'元')
    #str=raw_input('是否注销？')
    str=input('是否注销？')
    if str=='yes':
        session.get('http://10.3.8.211/F.htm')
        print('注销成功')
```

运行成功之后可以通过pyinstaller将py转换win平台可用exe文件。