title: 二维码与Python
date: 2016-1-30 22:35:02
toc: true
tags: 
- Python
- 二维码
categories: Python
---

# 关于二维码 #

二维条码/二维码（2-dimensional bar code）是用某种特定的几何图形按一定规律在平面（二维方向上）分布的黑白相间的图形记录数据符号信息的；在代码编制上巧妙地利用构成计算机内部逻辑基础的“0”、“1”比特流的概念，使用若干个与二进制相对应的几何形体来表示文字数值信息，通过图象输入设备或光电扫描设备自动识读以实现信息自动处理：它具有条码技术的一些共性：每种码制有其特定的字符集；每个字符占有一定的宽度；具有一定的校验功能等。同时还具有对不同行的信息自动识别功能、及处理图形旋转变化点。 


## QRCode ##

QR Code码，是由Denso公司于1994年9月研制的一种矩阵二维码符号，它具有一维条码及其它二维条码所具有的信息容量大、可靠性高、可表示汉字及图象多种文字信息、保密防伪性强等优点。  

<!--more-->

从QR Code码的英文名称Quick Response Code可以看出，超高速识读特点是QR Code码区别于四一七条码、Data Matrix等二维码的主要特性。由于在用CCD识读QR Code码时，整个QR Code码符号中信息的读取是通过QR Code码符号的位置探测图形，用硬件来实现，因此，信息识读过程所需时间很短，它具有超高速识读特点。用CCD二维条码识读设备，每秒可识读30个含有100个字符的QR Code码符号；对于含有相同数据信息的四一七条码符号，每秒仅能识读3个符号；对于Data Martix矩阵码，每秒仅能识读2～3个符号。QR Code码的超高速识读特性使它能够广泛应用于工业自动化生产线管理等领域。  

在目前几十种二维条码中，常用的码制有：PDF417二维条码, Datamatrix二维条码, Maxicode二维条码, QR Code, Code 49, Code 16K ,Code one,等，除了这些常见的二维条码之外，还有Vericode条码、CP条码、Codablock F条码、田字码、 Ultracode条码，Aztec条码。

# pyqrcode  #  

pyqrcode 是 Python 的扩展用来生成二维条形码以及对二维条形码进行解码。利用pyqrcode可以很轻松的将我们需要的信息转换成为二进制编码图片，并通过本地图片浏览方式展示：

```
import qrcode
import os
import sys
import time

QRImagePath = os.getcwd() + '/qrcode.jpg'
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=2,
)
data=input()
qr.add_data(data)
qr.make(fit=True)
img = qr.make_image()
img.save('qrcode.jpg')


#针对不同的系统平台选取相应的系统调用代码
if sys.platform.find('darwin') >= 0:
    os.system('open %s' % QRImagePath)
elif sys.platform.find('linux')>=0:
    os.write('xdg-open %s' % QRImagePath)
else:
    os.system('call %s' % QRImagePath)
os.system('call %s' % QRImagePath)
time.sleep(5)
os.remove(QRImagePath)
```

![](http://7xowaa.com1.z0.glb.clouddn.com/ter_qrcode.png)


## 扩展 ##

使用上面的代码很不美观，所以我尝试使用python支持的GUI重新整理了相关的代码，使用PyQT5模块，所以在尝试使用相关代码的时候，需要已经安装pyqt5：

```
from PyQt5 import QtCore, QtGui, QtWidgets
import qrcode
import os
import sys
import time

from PyQt5.QtGui import QPixmap

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=2,
)

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(400, 300)
        self.label = QtWidgets.QLabel(Form)
        self.label.setGeometry(QtCore.QRect(10, 10, 71, 41))
        self.label.setObjectName("label")
        self.sourceEdit = QtWidgets.QTextEdit(Form)
        self.sourceEdit.setGeometry(QtCore.QRect(90, 10, 291, 31))
        self.sourceEdit.setObjectName("sourceEdit")
        self.picLab = QtWidgets.QLabel(Form)
        self.picLab.setGeometry(QtCore.QRect(30, 80, 221, 201))
        self.picLab.setObjectName("picLab")
        self.genButton = QtWidgets.QPushButton(Form)
        self.genButton.setGeometry(QtCore.QRect(300, 80, 75, 81))
        self.genButton.setObjectName("genButton")
        self.exitButton = QtWidgets.QPushButton(Form)
        self.exitButton.setGeometry(QtCore.QRect(300, 200, 75, 81))
        self.exitButton.setObjectName("exitButton")

        self.retranslateUi(Form)
		#退出按钮绑定的槽函数
        self.exitButton.clicked.connect(Form.close)
		#生成图片按钮绑定的自定义槽函数
        self.genButton.clicked.connect(self.generateImg)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "二维码生成"))
        self.label.setText(_translate("Form", "SourceCode"))
        self.genButton.setText(_translate("Form", "生成"))
        self.exitButton.setText(_translate("Form", "退出"))
        self.OkImage = os.getcwd() + r'\qrcode.png'

    def generateImg(self):
        qr.add_data(self.sourceEdit.toPlainText())
        qr.make(fit=True)
		#生成二维码图片
        img = qr.make_image()
		#需要注意的是，有序自身机制，使用png形式图片会相当方便，其他的格式在生成QPixmap形式时候会报null
        img.save('qrcode.png')
		#将已经生成的图片加载成为QPixmap格式
        qpic=QPixmap(self.OkImage).scaled(self.picLab.width(),self.picLab.height())
        self.picLab.setPixmap(qpic)
		#将已经生成的图片删除，不占用空间
        os.remove(self.OkImage)


if __name__=='__main__':
    import sys
    app=QtWidgets.QApplication(sys.argv)
    widget=QtWidgets.QWidget()
    ui=Ui_Form()
    ui.setupUi(widget)
    widget.show()
    sys.exit(app.exec_())
```
效果如图
![](http://7xowaa.com1.z0.glb.clouddn.com/qrcode.jpg)


## 二维码解析 ##

Python中关于二维码解析的现成模块有很多，比较著名的就是Zbar以及ZXing.然而很不幸的是，官方的版本都是支持到python2.x，下面是在python2.x的例子:

```
from PIL import Image
import zbar
scanner = zbar.ImageScanner()
scanner.parse_config("enable")
pil = Image.open("char.png").convert('L')
width, height = pil.size
#经测试，将pil.tostring()替换成了pil.tobytes()
raw = pil.tobytes()
image = zbar.Image(width, height, 'Y800', raw)
scanner.scan(image)
data = ''
for symbol in image:
    data+=symbol.data
del(image)
print data
```
其中 data就是我们需要的已经解析得到的内容。   


查阅了相关资料，关于Python3.x的zbar适配已经有人放出来了，叫做[zbarlight](https://github.com/Polyconseil/zbarlight "zbarlight")，我尝试按照作者的的步骤执行，却发生了一些麻烦，最终没有完成。作者关于win平台上的支持还没有足够重视。    

[http://zbar.sourceforge.net/](http://zbar.sourceforge.net/ "zbar")这是zbar的win软件版本，运行之后，我们可以直接使用命令行形式解析二维码图片。

```
zbarimg -d http://7xowaa.com1.z0.glb.clouddn.com/qrcode.jpg
```
zbar分为zbarimg和zbarcam分别对应图片格式、摄像头格式，摄像头形式在win平台不太管用，图片格式可以填写本地图片文件名，也可以使用URL.
效果图
![](http://7xowaa.com1.z0.glb.clouddn.com/zbar.jpg)



