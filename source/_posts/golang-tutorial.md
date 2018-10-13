title: Golang入门
date: 2018-04-26 16:04:44
tags: Go
categories: Go
---
# 永远的Hello World


Hello world

```go
package main
import "fmt"
func main()
	/*Golang语言注释*/
	fmt.Println("Hello,World!")
}
```

1. 第一行代码 package main 定义了包名。你必须在源文件中非注释的第一行指明这个文件属于哪个包，如：package main。package main表示一个可独立执行的程序，每个 Go 应用程序都包含一个名为 main 的包。

2. main 函数是每一个可执行程序所必须包含的，一般来说都是在启动后第一个执行的函数（如果有 init() 函数则会先执行该函数）。

3. 当标识符（包括常量、变量、类型、函数名、结构字段等等）以一个大写字母开头，如：Group1，那么使用这种形式的标识符的对象就可以被外部包的代码所使用（客户端程序需要先导入这个包），这被称为导出（像面向对象语言中的 public）；标识符如果以小写字母开头，则对包外是不可见的，但是他们在整个包的内部是可见并且可用的

<!--more-->

## 结构

Go使用package来组织，只要package名称为main的包可以包含main函数，一个可执行程序有且仅有一个main包。

```
import "fmt"
import "io"
/*与下面等同*/

import {
"fmt",
"io"
}
```

可以将导入的包起别名

```
import fmt2 "fmt"
/*上面的代码使用fmt2，位fmt起了别名*/
```

省略调用，在调用其他包的方法的时候，不需要再先写其他的包名

```
import . "fmt"
Println("Hello,Wolrld!")
```

其他一些用法

```go
package main

// 导入其他包
import . "fmt"

// 常量定义
const PI = 3.14

// 全局变量的声明和赋值
var name = "gopher"

// 一般类型声明
type newType int

// 结构的声明
type gopher struct{}

// 接口的声明
type golang interface{}

// 由main函数作为程序入口点启动
func main() {
    Println("Hello World!")
}
```

Go语言中，使用大小写来决定该常量、变量、类型、接口、结构或函数是否可以被外部包所调用。函数名首字母小写即为 private ，函数名首字母大写即为 public 。

## 数据类型

1. 布尔类型

```
var flag bool=true;
```


2. 数字类型

整形：`uint/int/byte`

浮点型： `float32/float64`

复数型：`complex`


3. 字符串

字符串中的字节使用UTF8编码标识Unicode文本。

Unicoder有2个字节形式、4个字节形式

UTF8是变长编码，英文1个字节，汉字3个字节，生僻的为4-6字节


4. 派生类型

例如指针、数组、结构化、Channel、函数、切片、接口、Map


下面是一些变量赋值代码：

```go
/*全局变量声明*/
var isActivate bool
/*忽略类型的声明*/
var enabled,disabled = true, flase

func test(){
	/*普通声明*/
	var available bool
	*简短声明*/
	valid := flase
	/*赋值操作*/
	vailable = true
}
```


值类型：

所有像int、float、bool和string这些基本类型都属于值类型，使用这些类型的变量直接指向存在内存中的值，使用等号赋值的时候，实际上是在内存中将数值进行了拷贝。可以使用`&i`获取变量i的内存地址


引用类型：


一个引用类型的变量r1存储的是r1值值所有的内存地址，或者内存地址中第一个字所在的位置，这个地址被称之为指针。

对于局部变量，仅仅声明不赋值不使用，以及仅仅声明赋值不进行使用都是不行的，会报错。局部变量必须使用。

声明的几种方法：`var + type`，`var`，`:=`

空白标识符_也用与抛弃值，，因为他是一个只读类型的变量。


### 数组

```
var number = [6] int{1,2,3,5}
number := [6]int{1,2,3,5}

/*numbers[0]=1...numbers[4]=0,numbers[5]=0*/
```

### 常量


常量是一个简单值的标识符，在程序运行时，不会被修改的量。使用const进行标识


常量还可以用作枚举：

```
const (
    Unknown = 0
    Female = 1
    Male = 2
)
```

常量可以用len(), cap(), unsafe.Sizeof()函数计算表达式的值。其中`unsafe.Sizeof`表示占用的内存字节数；例如`a=12;fmt.Println(unsafe.Sizrof(a))`输出的就是8，因为a的类型为int8；对于一个字符串，`unsafe.Sizeof`一直都是16字节，因为他是一个结构，其中8个字节指向了存储的空间，8个字节保存了这个字符串的长度。



**iota**


iota，特殊常量，可以认为是一个可以被编译器修改的常量。

在每一个const关键字出现时，被重置为0，然后再**下一个const出现之前**，每出现一次iota，其所代表的数字会自动增加1。

```go
const (
    a = iota//0
    b = iota//1
    c = iota//2
)

const (
            a = iota   //0
            b          //1
            c          //2
            d = "ha"   //d="ha"   iota = 3
            e          //e="ha"   iota = 4
            f = 100    //f=100    iota = 5
            g          //g=100    iota = 6
            h = iota   //7
            i          //8
    )
```


### 一些运算符

位运算运算符：

& 按位与，!按位或，^按位异或，<<左移运算（高位丢弃，低位补0），>>右移运算


### channel

Channel是Go中的一个核心类型，你可以把它看成一个管道，通过它并发核心单元就可以发送或者接收数据进行通讯

channel包含三种形式定义，分别是双向管道，以及两个单向（单发送和单接受）

```go
chan T          // 可以接收和发送类型为 T 的数据  
chan<- float64  // 只可以用来发送 float64 类型的数据  
<-chan int      // 只可以用来接收 int 类型的数据  


ch <- v    // 发送值v到Channel ch中  
v := <-ch  // 从Channel ch中接收数据，并将数据赋值给v  
```


### 条件语句

if语句，if else，wiitch，select


```go
if a<20{
	fmt.Println("xixi")
}

if a < 20 {
       fmt.Printf("a 小于 20\n" );
} else {
       fmt.Printf("a 不小于 20\n" );
}


var grade string = "B"
var marks int = 90

switch marks {
   case 90: grade = "A"
   case 80: grade = "B"
   case 50,60,70 : grade = "C"
   default: grade = "D"  
}


/*select随机执行一个可运行的case。如果没有case可运行，它将阻塞，直到有case可运行*/
var c1, c2, c3 chan int
var i1, i2 int
select {
   case i1 = <-c1:
      fmt.Printf("received ", i1, " from c1\n")
   case c2 <- i2:
      fmt.Printf("sent ", i2, " to c2\n")
   case i3, ok := (<-c3):
      if ok {
         fmt.Printf("received ", i3, " from c3\n")
      } else {
         fmt.Printf("c3 is closed\n")
      }
   default:
      fmt.Printf("no communication\n")
}    
```

### 循环语句

for循环的几种形式：

```go
/*和C语言的for循环一样*/
for init;condition;post

/*和while循环一样*/
for condition {}

for {}

for key,value := range oldMap{}
```

goto 语句可以无条件地转移到过程中指定的行。

```go
LOOP: for a < 20{
	if a == 15{
		a += 1
		goto LOOP
	}
}
```

示例：打印小于100的素数

```go
func main() {
	for a := 2;a<=100;a+=1{
		flag := true
		for i := 2; i <= a/2; i+=1{
			if a%i == 0{
				flag = false
				break
			}
		}
		if flag{
			fmt.Println(a)
		}
	}
}
```


### 函数


```
func function_name( [parameter list] ) [return_types] {}
```

实例：

```go
func max(num1,num2 int) int{
	if num1>num2{
		return num1
	}else{
		return num2
	}
}
```


重写打印素数

```go
/*检查数值是否为素数*/
func check(num int) bool{
	for a:=2;a<=num/2;a+=1{
		if num%a==0{
			return false
		}
	}
	return true

}

func main() {
	for a := 2;a<=100;a+=1{
		if check(a){
			fmt.Println(a)
		}
	}
}
```


### 指针

```go
 var a int= 20   /* 声明实际变量 */
   var ip *int        /* 声明指针变量 */

   ip = &a  /* 指针变量的存储地址 */

   fmt.Printf("a 变量的地址是: %x\n", &a  )

   /* 指针变量的存储地址 */
   fmt.Printf("ip 变量储存的指针地址: %x\n", ip )

   /* 使用指针访问值 */
   fmt.Printf("*ip 变量的值: %d\n", *ip )
```

指针数组：

数组中的每个元素都是指针：

```
 a := []int{10,100,200}
 var ptr [3]*int
 for  i = 0; i < 3; i++ {
      ptr[i] = &a[i]
   }

   for  i = 0; i < 3; i++ {
      fmt.Printf("a[%d] = %d\n", i,*ptr[i] )
   }
```

指针作为参数

```go
func swap(x *int, y *int) {
   var temp int
   temp = *x   
   *x = *y      
   *y = temp   
}

var a int = 100
var b int = 200

swap(&a, &b)
```

### 结构体

type对结构体进行命名

```
type Books struct {
   title string
   author string
   subject string
   book_id int
}

var Book1 Books
Book1.title = "Go 语言"
Book1.author = "www.runoob.com"
Book1.subject = "Go 语言教程"
Book1.book_id = 6495407
```

使用指向结构体的指针，访问结构体内部元素

```
var struct_pointer *Books
struct_pointer = &Book1
struce_pointer.title
```

### 切片

Go 数组的长度不可改变，在特定场景中这样的集合就不太适用，Go中提供了一种灵活，功能强悍的内置类型切片("动态数组")，与数组相比切片的长度是不固定的，可以追加元素，在追加时可能使切片的容量增大。


```
s :=[] int {1,2,3 } /*不设置数组长度，此时分片的初始len=cap=3*/
s :=make([]int,len,cap) /*其中len是当前使用的长度，cap是当前切片最大可以容纳多少元素*/
```

copy函数与append函数

```
var numbers []int
printSlice(numbers)

numbers = append(numbers, 0)
printSlice(numbers)/*[0]*/

numbers = append(numbers, 1)
printSlice(numbers)/*[0,1]*/

numbers = append(numbers, 2,3,4)
printSlice(numbers)/*[0,1,2,3,4]*/

numbers1 := make([]int, len(numbers), (cap(numbers))*2)

copy(numbers1,numbers)/*将numbers中的元素拷贝到切片numbers1中*/
printSlice(numbers1)   
```


### Range方法

```
func main() {
    nums := []int{2, 3, 4}
    sum := 0
    for _, num := range nums {
        sum += num
    }
    fmt.Println("sum:", sum)

    for i, num := range nums {
        if num == 3 {
            fmt.Println("index:", i)
        }
    }

    kvs := map[string]string{"a": "apple", "b": "banana"}
    for k, v := range kvs {
        fmt.Printf("%s -> %s\n", k, v)
    }

    for i, c := range "go" {
        fmt.Println(i, c)
    }
}
```

### map

Map 是一种无序的键值对的集合。Map 最重要的一点是通过 key 来快速检索数据，key 类似于索引，指向数据的值。

Map 是一种集合，所以我们可以像迭代数组和切片那样迭代它。不过，Map 是无序的，我们无法决定它的返回顺序，这是因为 Map 是使用 hash 表来实现的。

```
var countryCapitalMap map[string]string
countryCapitalMap = make(map[string]string)

countryCapitalMap["France"] = "Paris"
countryCapitalMap["Italy"] = "Rome"
countryCapitalMap["Japan"] = "Tokyo"
countryCapitalMap["India"] = "New Delhi"

for country := range countryCapitalMap {
   fmt.Println("Capital of",country,"is",countryCapitalMap[country])
}

/* 查看元素在集合中是否存在 */
captial, ok := countryCapitalMap["United States"]
/* 如果 ok 是 true, 则存在，否则不存在 */
if(ok){
   fmt.Println("Capital of United States is", captial)  
}else {
   fmt.Println("Capital of United States is not present")
}

/*删除map中的某个元素*/
delete(countryCapitalMap,"France")
```



### 语言类型转换

```go
func main() {
   var sum int = 17
   var count int = 5
   var mean float32

   mean = float32(sum)/float32(count)
   fmt.Printf("mean 的值为: %f\n",mean)/*3.400000*/
}
```

### 接口

```go
type Phone interface {
    call()
}

type NokiaPhone struct {
}

/*可以看出来与普通函数不同，普通函数是func func_name() type{}*/
/*而这里是func () interface_func_name() type{}*/
func (nokiaPhone NokiaPhone) call() {
    fmt.Println("I am Nokia, I can call you!")
}

type IPhone struct {
}

func (iPhone IPhone) call() {
    fmt.Println("I am iPhone, I can call you!")
}

func main() {
    var phone Phone

    phone = new(NokiaPhone)
    phone.call()

    phone = new(IPhone)
    phone.call()

}
```

在上面的例子中，我们定义了一个接口Phone，接口里面有一个方法call()。然后我们在main函数里面定义了一个Phone类型变量，并分别为之赋值为NokiaPhone和IPhone。然后调用call()方法


### 错误处理

Go 语言通过内置的错误接口提供了非常简单的错误处理机制。

error类型是一个接口类型，这是它的定义：

```go
type error interface {
    Error() string
}
```

我们需要在相应的地方实现这个接口方法。

函数通常在最后的返回值中返回错误信息。使用errors.New 可返回一个错误信息

```
func Sqrt(f float64) (float64, error) {
    if f < 0 {
        return 0, errors.New("math: square root of negative number")
    }
    // 实现
}
```
