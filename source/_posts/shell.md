title: shell学习记录
date: 2018-10-12 12:24:06
tags:
- shell
- linux
categories: linux
---

# shell学习

最简单的shell命令：

```bash
#!/bin/bash
echo "hello world"
```

保存为test.sh，为该文件添加x权限`chmod +x test.sh`，随后使用`./test.sh`执行该脚本

## 变量

shell中可以像其他语言中一样定义变量/使用变量，需要注意的是，变量定义的时候等号前后不要有空格；在使用变量的时候，要在变量名前面添加`$`访问

```bash
#!/bin/bash
myText="hello world"
myNum=100
echo $myText
echo myNum
```

执行脚本，返回结果：

```bash
hello world
myNum
```

使用`$`符号的变量可以正常被访问，否则输出的将是纯文本内容

## 运算符

```bash
#!/bin/bash
echo "hello world!"
a=3
b=5
val=`expr $a + $b`
echo "Total value : $val"
val=`expr $a - $b`
echo "Total value : $val"
```

几个注意的点：val定义的时候，符号既不是双引号也不是单引号，而是反单引号，同时要在前面加上`expr`关键字


![](http://opu8lkq3n.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-10-13%20%E4%B8%8A%E5%8D%889.55.29.png)

```bash
#!/bin/bash
echo "hello world!"
a=3
b=5
val=`expr $a + $b`
echo "Total value : $val"
val=`expr $a - $b`
echo "Total value : $val"

if [ $a == $b ]
then
        echo "a is equal to b"
fi
if [ $a != $b ]
then
        echo "a si not equal to b"
fi

if [ $a == $b ]
then
	echo "a is equal to b"
elif [ $a -gt $b ]
then
	echo "a is greater than b"
elif [ $a -lt $b ]
then 
	echo "a is less than b"
else
	echo "None of the condition met"
fi
```

其他一些关键字，要注意的是，`[ $a == $b ]`两个变量不要跟括号相邻


**关系运算符**

![](http://opu8lkq3n.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-10-13%20%E4%B8%8A%E5%8D%889.55.39.png)

**字符串运算符**

![](http://opu8lkq3n.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-10-13%20%E4%B8%8A%E5%8D%889.55.47.png)


**文件运算符**

![](http://opu8lkq3n.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-10-13%20%E4%B8%8A%E5%8D%889.55.55.png)

## 字符串操作

```bash
#!/bin/bash
mtext="hello"
mtext2="world"
mtext3=$mtext" "$mtext2
echo $mtext3
echo ${#mtext3}
echo ${mtext3:1:4}
```

输出结果：

```bash
hello world
11
ello
```

## 数组操作

```bash
array=(1 2 3 4 5)
array2=(aa bb cc dd ee)
value=${array[3]}
echo $value
value2=${array2[3]}
echo $value2
length=${#array[*]}
echo $length
```

输出结果为：

```
4
dd
5
```

## 其他

```bash
echo "hello \n world"
echo "hello world" > a.txt
echo `date`
```

以上三个语句分别是输出换行后的`hello world`，将内容`hello world`重定向到文件a.txt，以及最后的输出日期功能


## 循环

**for循环**

```bash
for i in {1..5}
do
	echo $i
done

for i in 5 6 7 8 9
do 
	echo $i
done

for File in ./*
do
	echo $File
done
```

**while循环**

```bash
counter=0
while [ $counter -lt 5 ]
do
	counter=`expr $counter + 1`
	echo $counter
done


while read FILM
do
	echo "the file name is $FILM"
done
```

第二个循环需要手动停止循环，程序接受标准输入，并将其输出

## 函数

```bash
test(){
	aNum=3
	bNum=5
	return $(($aNum+$bNum))
}
test
res=$?
echo $res
```

**带参数函数**

```bash
test(){
        echo $1"  "$2"  "$3
}
test 1 2 3
```

需要注意的是，当参数数量大于10的时候，`$10`不能获取第10个参数，需要使用`${10}`


