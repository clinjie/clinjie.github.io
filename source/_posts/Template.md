title: Pycharm模板
date: 2015-12-13 21:35:02
tags: 
- 随感
categories: 生活
---

- Step1

进入*File->settings->Editor->File and Code Templates->Python Script*

- Step2

<!--more-->

添加以下内容：

`# encoding: utf-8`

- Step3

额外的板信息

```python
# encoding: utf-8

#set( $SITE = "http://peihao.space" )

"""
@version: ??
@author: chuangwailinjie
@license: Apache Licence 
@contact: chuangwailinjie@gmail.com
@site: ${SITE}
@software: ${PRODUCT_NAME}
@file: ${NAME}.py
@time: ${DATE} ${TIME}
"""

def func():
    pass


class Main():
    def __init__(self):
        pass


if __name__ == '__main__':
    pass
```