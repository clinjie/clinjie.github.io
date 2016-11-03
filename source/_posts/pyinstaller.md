title: pyinstaller打包pyqt5问题解决
date: 2016-10-23 15:28:30
tags: python
categories: python
---

pyinstaller打包使用pyqt5模块的时候，在win平台下，由于pyinstaller无法准确获取QT动态库文件路径，会报错导致无法打开运行程序，并提示错误信息`pyinstaller failed to execute script pyi_rth_qt5plugins`此时我们需要在打包的时候直接告诉pyinstaller到哪里去找，这个路径分隔符需要是unix形式：

`pyinstaller --paths C:/****/Python/Python35-32/Lib/site-packages/PyQt5/Qt/bin -F -w ****.py`