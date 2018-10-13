title: 使用PIL模块创建验证码文件
date: 2016-2-12 21:57:53
tags: python
categories: python
---

<!--more-->

图片模糊效果：

```python
from PIL import Image, ImageFilter

# 打开一个jpg图像文件，注意是当前路径:
im = Image.open('test.jpg')
# 应用模糊滤镜:
im2 = im.filter(ImageFilter.BLUR)
# 覆盖原图
im2.save('test.jpg', 'jpeg')
```

PIL的ImageDraw提供了一系列绘图方法，让我们可以直接绘图。下面的例子展示了一种创建随机验证码的方法：

```python
from PIL import Image,ImageFont,ImageFilter,ImageDraw
import os,random

#返回一个数字或者字母
def rndChar():
    def rndChar():
    x=random.random()
    return chr(random.randint(48,57)) if x<=0.33 else chr(random.randint(65,90)) if 0.33<x<=0.67 else chr(random.randint(97,122))

#返回背景颜色的其中一个RGB值
def rndColor():
    return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))

#返回前置text颜色的其中一个RGB值
def rndColor2():
    return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))

width=100*4
height=100

image=Image.new('RGB',(width,height),(255,255,255))

font=ImageFont.truetype(r'C:\Windows\Fonts\Arial.ttf', 50)

draw=ImageDraw.Draw(image)

#对每个像素点进行填充
for x in range(width):
    for y in range(height):
        draw.point((x,y),fill=rndColor())

#绘制生成的验证码
for t in range(4):
    draw.text((100*t+25,25),rndChar(),fill=rndColor2(),font=font)

#对验证码进行简单的模糊化处理
image=image.filter(ImageFilter.BLUR)
image.save('code.jpg',format='jpeg')

#使用默认的img查看器对保存的文件预览
os.system('start code.jpg')
```