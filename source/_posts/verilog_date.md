title: verilog笔记
date: 2016-03-24 15:23:35
toc: true
tags: 
- Verilog HDL
categories: Verilog
---

# 模块 #

## 模块介绍 ##

- 模块是Verilog HDL语言的基本单元，数字系统是用模块的形式来描述。

- 模块是描述某个设计的功能、结构和其他模块通信的外部端口。
<!--more-->
- Verilog HDL中的各个模块是并行运行的

- 模块可以调用其他模块的实例   

## 模块结构 ##

```C
module <模块名>(<端口列表>)
	端口说明（input，output，inout）
	参数定义（可选）
	数据类型定义//wire、reg、task、function
	连续赋值语句（assign）//组合逻辑
	过程块（always和initial）
	-行为描述语句
	低层模块实例//调用其它模块
	任务和函数
	延时说明块
endmodule
```

# 语句模块描述方式 #

Verilog有三种建模方式，分别是

- 结构化描述方式

- 数据流描述方式

- 行为描述方式

## 结构型描述 ##

通过实例进行描述的方法，将预定义的基本原件实例嵌入语言中，监控实例的输入，一单任何一个发生变化便重新运算并输出。

## 数据流型描述 ##

是一种描述组合逻辑功能的方法，用`assign`连续赋值语句来实现。

连续赋值语句完成如下的组合功能：等式右边的所有变量受持续监控，每当这些变量中有任何一个发生变化，整个表达式被重新赋值并送给等式左端。

## 行为级描述 ##

是通过描述行为特性来实现，关键词是`always`，含义是一单敏感变量发货时能变化，就重新一次进行赋值，有无限循环之意。这种描述方法常用来实现时序电路，也可用来描述组合功能。


## Tip ##

用户可以混用上述三种描述方法，但需要说明的是，模块中门的实例、模块实例语句、assign语句和always语句是并发执行的，即执行顺序和书写次序无关。

- Verilog HDL区分大小写

- Verilog HDL关键字一般为小写


其中数据流描述方式经常使用连续赋值语句，某个值被赋给某个网线变量。

`assign [delay] net_name = expression;`

注意在各assign 语句之间，是并行执行的，即各语句的执行与语句之间的顺序无关。

行为描述方式经常使用always、initial语句赋值。使用reg进行寄存器的声明。always是指一直在重复运行，由always后面括号的变量变化时触发。在always以及end之间是串行顺序执行的。

数据流型描述是一种描述组合逻辑功能的方法，用assign连续赋值语句来实现。


# 常量 #

## 数字 ##

语法：

`<位宽>'<进制><数值>`

其中位宽是指对应二进制的位数    

需要注意的是，尾款小于相应数值的实际位数时，相应的高位部分被忽略。`4'D61`与`4'B1101`相同。因为十进制下`61==111101`，这里要求二进制4bit，所以是`1101`.


## parameter ##

语法:

```
parameter 参数名1=表达式，参数名2=表达式，......；

例：

parameter count_bits=8;
parameter sel=8,code=8'ha3;
parameter datawidth=8;addwidth=datawidth*2;
```

使用常量的目的:

- 便于阅读

- 便于修改 

## 变量 ##

- 网络型 nets type

指硬件电路中的各种连接，输出始终根据输入的变化更新其值的变化。

- 寄存器型 register type 

常指硬件中电路中具有状态保持作用的器件，如触发器、寄存器等等。


----------
nets type中最主要的就是wire型变量，常用来表示用assign语句赋值的组合逻辑信号。可以取值为0，1，x（不定值），z（高阻）    

注意，Verilog HDL模块中的输入输出信号类型缺省时，自动定义为wire型变量。

语法：
wire 数据1，数据2，......数据n.

例子：

```
wire a,b,c //定义了三个wire型变量

wire[7:0] databus //定义了8bit宽wire型向量数据总线

wire[20:1] addrbus  //定义了20bit宽的wire型向量地址总线
```


----------
这里记录下register type中的reg型，常用的寄存器型变量

语法： reg 数据1，数据2，数据3......;

例子：

```
reg a,b;

reg[8:1] data //定义可8bit宽的reg型向量

reg[7:0] mymem[1023:0] //定义了1024字节（8bit*1024）的存储器
```

# 常用语句 #

- 赋值   		连续赋值语句、过程赋值语句

- 条件语句 		if-else语句、case语句

- 循环语句 		forever、repeat、while、for语句

- 结构说明语句 	initial、always、task、function语句

- 编译预处理语句 	'define 'include 'timescale语句

## 过程块 ##

1. always过程块

模板：

```C
always @(<敏感信号表达式>)
begin
	//过程赋值
	//if语句	
	//case语句
	//while、repeat、for语句
	//task、function调用
end
```

当敏感信号表达式的值改变时候，就执行一遍块内语句。同时always过程块是不能够嵌套使用的。

**关键字**`posedge`与`negedge`关键字分别是上升沿以及下降沿

例如：同步时序电路的时钟信号为clk，clear为异步清零信号。敏感信号可写为：

```
//上升沿触发，高电平清0有效
always @(posedge clk or posedge clear)

//上升沿触发，低电平清0有效
always @(posedge clk or negedge clear)
```

例如当`negedge clear`表示当`clear==0`时

```
always @(posedge clk or negedge clear)
	begin
		if(!clear)//当clear==0时候，always会由事件驱动
			qout=0;
		else
			qout=in;
	end
```

2. initial过程块

initial模板：

```
initial
begin
	语句1；
	语句2；
	......
end
```

对变量和存贮器初始化

```C
initial
begin
	reg1=0;
	for(addr=0;addr<size;addr=addr+1)
		memory[addr]=0;
end
```

- initial语句主要面向功能模拟，通常不具有可综合性。

- 模拟0时刻开始执行，只执行一次

- 同一模块内的多个initial过程块，模拟0时刻开始并行执行。

initial与always语句一样，是不能嵌套使用的。即在initial语句中不能再次嵌套initial语句块。 


## 赋值语句 ##

1. 连续赋值语句assign常用于对wire型变量进行赋值

```C
input a,b;
output c;
assign c=a&b;
```
a,b信号的任何变化，都将随时反映到c上来。

2. 过程赋值语句**常用于对reg型变量进行赋值**

一般分为两种方式：

- 非阻塞赋值：一条非阻塞赋值语句的执行是不会阻塞下一条语句的执行，也就是收本条非阻塞赋值语句的执行完毕之前，下一条语句也可以开始执行。非阻塞赋值语句在块结束时才一同完成赋值操作，在一块内非阻塞赋值语句并行执行。赋值符号`<=`

-  阻塞赋值：该语句结束时就完成赋值操作，前面的语句没有完成之前，后面的语句是不能执行的，在一块内非阻塞赋值语句顺序执行。赋值符号`=`

非阻塞赋值：

```
module non_block (c, a,b,clk);
output c,b;
input a,clk;
reg c,b;
always @(posedge clk)
	begin
		b<=a;
		c<=b;
	end
endmodule
```
由于是非阻塞赋值，bc在clk上升沿同时进行状态变化。所以`b<=a;c<=b;`语句在同时执行，所以c的值是b上一个上升沿的值，b的值被赋值为a上一个上升沿的值。

![仿真图片](/img/article/verilog_data_setvalue.jpg)

阻塞赋值：

```
module block (c, a,b,clk);
output c,b;
input a,clk;
reg c,b;
always @(posedge clk)
	begin
		b=a;
		c=b;
	end
endmodule
```

顺序执行有`c==b`

![仿真图片](/img/article/verilog_date_setvalue2.jpg)


## 条件语句 ##

if-else语句块

`pass`

case语句

```C
case （<敏感表达式>）
	值1：语句或语句块1 ；//case分支项
	值2：语句或语句块2 ；
	……
	值n：语句或语句块n ；
	default：语句或语句块n+1；//可省略
endcase
```

## Tips ##

- 若没有列出所有条件分支，编译器认为条件不满足时，会引进触发器保持原值。

- 时序电路可利用上述特性来保持状态。

- 组合电路必须列出所有条件分支，否则会产生隐含触发器。


8bit二进制乘法器  integer

```
module mult_for (outcome,a,b);
parameter size=8 ;
output[2*size:1] outcome;
input[size:1] a,b; //乘数
reg[2*size:1] outcome; //积
integer i;
always @(a or b)
	begin
		outcome=0;
		for (i=1;i<=size;i=i+1)
		if(b[i]) outcome=outcome+( a<<(i-1) ) ;
	end
endmodule
```

# task、function #

## task ##

定义格式：

```
task<任务名>
	端口与类型说明
	局部变量说明
	语句或语句块
endtask
```

调用格式：

`<任务名>(port1，port2，port3,......)`


## 函数function ##

定义格式:

```C
function <返回值位宽或类型> <函数名>
	输入端口与类型说明
	局部变量说明
	语句或语句块
endfunction
```

调用格式:

`<函数名> (<输入表达式1>,<输入表达式2>,<输入表达式3>,......)`

```
module function_example(i,out);
input[7:0] in;
output[2:0] out;
reg[2:0] out;
	function[2:0] gefun;
		input[7:0] x; //输入端口说明
		reg[2:0] count;
		integer i;
		begin
			count=0;
			for(i=0;i<=7;i=i+1)
				if(x[i]==1'b0)count=count+1;
			gefun=count;
		end
	endfunction
	always @(in) out=gefun(in);//这里要注意的是 in要与x位宽相同
endmodule
```

Verilog中函数function声明，在声明的最后一句一般都是对结果赋值。也就是对函数名赋值。如上例中，函数名gefun，在声明最后一句就是对gefun的赋值。

# 编译预处理 #

- `define

- `include

- `timescale

编译指令以"`"反引号开头。不同于整数的单引号，预编译使用的是反引号，一般在键盘的左上角。


# 顺序与并行 #

- assign语句`之间`:并行执行（同时执行）

- 过程块`之间`（always、initial）：并行执行

- assign语句与过程块`之间`：并行执行

- 过程块（initial、always）内部

1. 串行块（begin-end）：顺序执行---非阻塞语句类似于并行语句

2. 并行快（fork-join）：并行执行

