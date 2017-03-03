title: python3.x识别验证码
date: 2016-12-11 19:55:21
toc: true
tags: python
categories: python
---


嗯，没心情写介绍了。

- python2.x使用pytesser

- python3.x使用pytesser3

```python
from pytesser3 import image_to_string
from PIL import Image

img=Image.open(r'image_path')
print(image_to_string(img))
```

对于偏移过的元素支持不好