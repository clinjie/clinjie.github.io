title: Verilog小叙(三)
date: 2016-03-09 22:23:35
toc: true
tags: 
- Verilog HDL
- 仿真
categories: Verilog 
---

好的，接着上篇文章[Verilog小叙(二)](/2016/03/08/verilog_hdl2/)

# 数据流建模 #

之前的介绍中，我们已经初步了解到数据流描述方式，本节对数据流的建模方式进一步讨论，主要讲述连续赋值语句、阻塞赋值语句、非阻塞赋值语句，并针对一个系统设计频率计数器的实例进行讲解。

## 连续赋值语句 ##

数据流的描述是采用连续赋值语句(assign )语句来实现的。语法如下：
`assign net_type = 表达式；`
连续赋值语句用于组合逻辑的建模。 等式左边是wire 类型的变量。等式右边可以是常量、由运算符如逻辑运算符、算术运算符参与的表达。
如下几个实例：

<!--more-->

```C
wire [3:0] Z, preset,clear; //线网说明
assign z = preset & clear; //连续赋值语句
wire cout, cin ;
wire [3:0] sum, a, bB;
. . .
assign {cout,sum} = a + b + cin;
assign mux = (s == 3)? d : 'bz;
```
注意如下几个方面：
1. 连续赋值语句的执行是：只要右边表达式任一个变量有变化，表达式立即被计算，计算的结果立即赋给左边信号。
2. 连续赋值语句之间是并行语句，因此与位置顺序无关。

**Tips：**
实际电路中赋值语句的执行其实会有ps级别的延迟，这个延迟是线、门器件本身特性造成的，不过只要是同步电路，那么ps级别延迟就可以忽略不计，因为后续的寄存器是在时钟上升沿采样，ps级别延迟和一个典型的时钟周期来比，完全不用考虑。

## 阻塞赋值语句 ##

“=”用于阻塞的赋值，凡是在组合逻辑（如在assign 语句中）赋值的请用阻塞赋值。阻塞赋值“=”在begin 和end 之间的语句是顺序执行，属于串行语句
说明：
always语句的敏感变量如果不含有时钟，即always（*）这样描述，那么也属于组合逻辑，需要使用阻塞赋值。
一个组合逻辑的例子：

```C
always @(*) begin
if ( new_vld_after == 1'b1 )
port_win = new_port_after ;
else if ( new_vld_before ==1'b1 )
port_win = new_port_before ;
else
port_win = last_sel_port ;
end//阻塞赋值在begin-end之间串行执行
```

## 非阻塞赋值语句 ##

`“<=”`用于阻塞的赋值，凡是在时序逻辑（如在always语句中）赋值的请用非阻塞赋值，非阻塞赋值`“<=”`在`begin`和`end`之间的语句是并行执行，属于并行执语句。

**Tips：**

`时序逻辑值`的是`带有时钟的always块逻辑`，只有always带有时钟，那么这个逻辑才能是寄存器。
一个时序逻辑的例子：
```C
always @(posedge sys_clk or negedge sys_rst_n) begin
if (sys_rst_n ==1'b0)
clk_cnt <= 26'b0;
else
clk_cnt <= clk_cnt + 26'b1;
end
```

## 数据流建模具体实例 ##

以上面的频率计数器为例，其中的AND2模块我们用数据流来建模。

![](http://7xowaa.com1.z0.glb.clouddn.com/top_down.png)

AND2模块对应文件AND2.v 的内容如下：

```C
module AND2 (A0, A1, Y);
input A0;
input A1;
output Y;
wire A0;
wire A1;
wire Y;
assign Y = A0 & A1;//连续赋值语句
endmodule
```

# 行为建模 #

在第四节中，我们已经对行为描述方式有个概念，这里对行为建模进一步的描述，并通过一个系统设计频率计数器加以巩固。

## 简介 ##

行为建模方式是通过对设计的行为的描述来实现对设计建模，一般是指用过程赋值语句（`initial`语句和`always`语句）来设计的称为行为建模。

## 顺序语句块 ##

语句块提供将两条或更多条语句组合成语法结构上相当于一条语句的机制。这里主要讲Verilog HDL的顺序语句块(begin . . . end)：语句块中的语句按给定次序顺序执行。
顺序语句块中的语句按顺序方式执行。每条语句中的时延值与其前面的语句执行的模拟时间相关。一旦顺序语句块执行结束，跟随顺序语句块过程的下一条语句继续执行。顺序语句块的语法如下：

```C
begin [:block_id{declarations}]
procedural_statement (s)
end
```

例如：
```
// 产生波形:
begin
 #2 Stream = 1;
 #5 Stream = 0;
 #3 Stream = 1;
 #4 Stream = 0;
 #2 Stream = 1;
 #5 Stream = 0;
end
```

假定顺序语句块在第10个时间单位开始执行。两个时间单位后第1条语句执行，即第12个时间单位。此执行完成后，下1条语句在第17个时间单位执行(延迟5 个时间单位)。然后下1条语句在第20个时间单位执行，以此类推。该顺序语句块执行过程中产生的波形如图：

![](http://7xowaa.com1.z0.glb.clouddn.com/verilog_stream.png)

## 过程赋值语句 ##

Verilog HDL中提供两种过程赋值语句initial和always语句，用这两种语句来实现行为的建模。这两种语句之间的执行是并行的，即语句的执行与位置顺序无关。这两种语句通常与语句块（begin ....end）相结合，则语句块中的执行是按顺序执行的。

1. initial 语句

----------
initial语句只执行一次，即在设计被开始模拟执行时开始（0时刻）。*通常只用在对设计进行仿真的测试文件中，用于对一些信号进行初始化和产生特定的信号波形*。
语法如下：（大家只要先有个概念就可以）

```C
initial
[timing_control] procedural_statement
procedural_statement 是下列语句之一：
procedural_assignment(blocking or non-blocking) //阻塞或非阻塞性过程赋值语句
procedural_continuous_assignment
conditional_statement
case_statement
loop_statement
wait_statement
disable_statement
event_trigger
task_enable (user or system)
```

例子如上产生一个信号波形：

```C
initial
begin
#2 Stream = 1;
#5 Stream = 0;
#3 Stream = 1;
#4 Stream = 0;
#2 Stream = 1;
#5 Stream = 0;
end
```


说明：
initial只能使用在仿真中，是不可综合语法，很多初学者在开始的时候以为initial是可以综合的。

2. always 语句

----------
always语句与initial语句相反，是被重复执行，执行机制是通过对一个称为敏感变量表的**事件驱动**来实现的，下面会具体讲到。always 语句可实现组合逻辑或时序逻辑的建模。
例子1：

```C
initial
clk = 0 ；
always
#5 clk = ~clk；
```

因为always 语句是重复执行的，因此，clk是初始值为0 的，周期为10 的方波。
例子2： D触发器

```C
//并行执行
always @ ( posedge clk or negedge rst ) begin
	if （ rst == 1’b0 ）//当rst为0时
		q <= ‘ b 0;
	else
		q <= d;
end
```
上面*括号内的内容称为敏感变量*，即整个always 语句当敏感变量有变化时被执行，否则不执行。因此，当rst为0时，q被复位，在时钟上升沿时，d被采样到q。


例子3： 2选一的分配器

`always @( sel ，a ，b）`
`c = sel ? a ：b；`

这里的sel ，a，b 同样称为敏感变量，当三者之一有变化时，always 被执行，当sel 为 1 ，c被赋值为a ，否则为b 。描述的是一个组合逻辑 mux 器件。
说明：
Verilog 2001语法定义敏感变量可以使用“*”代替，
例子3的2 选一的分配器可以这样写：：
```
always @(*）
c = sel ? a ：b；
```
此处强烈建议大家使用*替代敏感变量，减少错误发生。

**Tips:**

1. 对**组合逻辑**的always 语句，敏感变量建议使用*替代。
2. 对组合逻辑器件的赋值采用阻塞赋值 “=”。
3. 时序逻辑器件的赋值语句采用非阻塞赋值 “<=”；

# 状态机 #

有限状态机英文名字，*Finite State Machine*，简称状态机，缩写为FSM。

有限状态机是指输出取决于过去输入部分和当前输入部分的时序逻辑电路。有限状态机又可以认为是组合逻辑和寄存器逻辑的一种组合。状态机特别适合描述那些发生有先后顺序或者有逻辑规律的事情，其实这就是状态机的本质。状态机就是对具有逻辑顺序或时序规律的事件进行描述的一种方法


根据状态机的输出是否与输入条件相关，可将状态机分为两大类，即摩尔 (Moore) 型状态机和米勒 (Mealy) 型状态机。

- Mealy状态机：时序逻辑的输出不仅取决于当前状态，还取决于输入。

- Moore状态机：时序逻辑的输出只取决于当前。

根据实际写法，状态机还可以分为一段式、二段式和三段式状态机。
- 一段式： 把整个状态机写在一个always模块中， 并且这个模块既包含状态转移，又含有组合逻辑输入 /输出 。

- 二段式： 状态切换用时序逻辑，次态输出和信号输出用组合逻辑。

- 三段式： 状态切换用时序逻辑，次态输出用组合逻辑，信号输出用时序逻辑。

**Tips：**

实际应用中三段式使用最多，也最为可靠，避免了状态和输入输出的干扰，推荐大家使用第三种写法，我们实际项目中基本全部是第三种写法。本文也着重讲解三段式。

## Mealy状态机 ##

- 下一个状态 = F(当前状态，输入信号)； 

- 输出信号 = G(当前状态，输入信号)；

![](http://7xowaa.com1.z0.glb.clouddn.com/mealy.png)

## Moore状态机 ##

- 下一个状态 = F(当前状态，输入信号)； 

- 输出信号 = G(当前状态)；

![](http://7xowaa.com1.z0.glb.clouddn.com/moore.png)

## 三段式状态机 ##

两段式直接采用组合逻辑输出，而三段式则通过在组合逻辑后再增加一级寄存器来实现时序逻辑输出。这样做的好处是可以有效地滤去租个逻辑输出的毛刺，同时可以有效地进行时序计算与约束，另外对于总线形式的输出信号来说，容易使总线数据对齐，从而减小总线数据间的偏移，减小接收端数据采样出错的频率。
三段式状态机的基本格式是：

- 第一个always语句实现同步状态跳转；

- 第二个always语句实现组合逻辑；

- 第三个always语句实现同步输出。

Verilog描述状态机需要注意的事项：

1. 定义模块名和输入出端口；

2. 定义输入、输出变量或寄存器；

3. 定义时钟和复位信号；

4. 定义状态变量和状态寄存器；

5. 用时钟沿触发的`always`块表示状态转移过程；

6. 在复位信号有效时给状态寄存器赋初始值；

7. 描述状态的转换过程：符合条件，从一个状态到另外一个状态。否则留在原状态；

8. 验证状态转移的正确性，必须完整和全面。

一个三段式状态机例子：

```java
module divider7_fsm (
//input
input sys_clk ,    //系统时钟
input sys_rst_n ,  //系统复位，以n结尾-低为有效
//output
output reg clk_divide_7 // 七分Clock
);

//reg define

reg [6:0] curr_st ; // 状态机目前的状态
reg [6:0] next_st ; // 状态机下一时刻状态
reg clk_divide_7 ; // 时钟七分频
//wire define
//parameter define
//one hot code design
parameter S0 = 7'b0000000;
parameter S1 = 7'b0000001;
parameter S2 = 7'b0000010;
parameter S3 = 7'b0000100;
parameter S4 = 7'b0001000;
parameter S5 = 7'b0010000;
parameter S6 = 7'b0100000;
/********************************************
** Main Program
**
*********************************************/
//同步状态跳转  时钟上升沿或下降沿系统复位为低是事件驱动
always @(posedge sys_clk or negedge sys_rst_n) begin
	if (sys_rst_n ==1'b0) begin
		curr_st <= 7'b0;//非阻塞赋值，并行
	end
	else begin//系统时钟上升沿
		curr_st <= next_st;
	end
end
//实现组合逻辑
always @(*) begin
	case (curr_st)
		S0: begin
			next_st = S1;
		end
		S1: begin
			next_st = S2;
		end
		S2: begin
			next_st = S3;
		end
		S3: begin
			next_st = S4;
		end
		S4: begin
			next_st = S5;
		end
		S5: begin
			next_st = S6;
		end
		S6: begin
			next_st = S0;
		end
		default: next_st = S0;
	endcase
end
//control divide clock offset实现同步输出
always @(posedge sys_clk or negedge sys_rst_n) begin
	if (sys_rst_n ==1'b0) begin
		clk_divide_7 <= 1'b0;
	end
	else if ((curr_st == S0) | (curr_st == S1) | (curr_st == S2) | (curr_st == S3))
		clk_divide_7 <= 1'b0;
	else if ((curr_st == S4) | (curr_st == S5) | (curr_st == S6))
		clk_divide_7 <= 1'b1;
	else
		;
end
endmodule
//end of RTL code
```

说明：
1. 本状态机采用独热码设计，简称one-hot code，独热码编码的最大优势在于状态比较时仅仅需要比较一个位，从而一定程度上简化了译码逻辑。
2. 一般状态机状态编码使用二进制编码、格雷码、独热码。 各种编码比较: 二进制编码、格雷码编码使用最少的触发器，消耗较多的组合逻辑，而独热码编码反之。独热码编码的最大优势在于状态比较时仅仅需要比较一个位，从而一定程度上简化了译码逻辑。虽然在需要表示同样的状态数时，独热编码占用较多的位，也就是消耗较多的触发器，但这些额外触发器占用的面积可与译码电路省下来的面积相抵消。 Binary（二进制编码）、gray-code（格雷码）编码使用最少的触发器，较多的组合逻辑，而one-hot（独热码）编码反之。one-hot 编码的最大优势在于状态比较时仅仅需要比较一个bit，一定程度上从而简化了比较逻辑，减少了毛刺产生的概率。另一方面，对于小型设计使用gray-code和binary编码更有效，而大型状态机使用one-hot更高效。


## 行为建模具体实例 ##

以上面的LED流水灯为例，采用行为建模方法。

```java
module LED (
//input
input sys_clk , //系统时钟
input sys_rst_n , //系统复位，低电平有效
//output
output reg [7:0] LED );

//Parameter define
parameter WIDTH = 8 ;
parameter SIZE = 8 ;
parameter WIDTH2 = 18 ;
parameter Para = 100000;

//Reg define
reg [SIZE-1:0] counter ;
reg [WIDTH2-1:0] count ;

//Wire define
//*****************************************************
//** Main Program
//**
//*****************************************************
// count for add counter

always @(posedge sys_clk or negedge sys_rst_n) begin
	if (sys_rst_n ==1'b0)
		count <= 18'b0;
	else
		count <= count + 18'b1;
end
// counter for delay time to LED display
always @(posedge sys_clk or negedge sys_rst_n) begin
	if (sys_rst_n ==1'b0)
		counter <= 8'b0;
	else if ( count == Para)
		counter <= counter + 8'b1;
	else ;
end
// ctrlLED pipeline display when counter is equal 10 or 20 ....
always @(posedge sys_clk or negedge sys_rst_n) begin
	if (sys_rst_n ==1'b0)
		LED <= 8'b0;
	else begin
		case (counter)
			8'd10 : LED <= 8'b10000000 ;
			8'd20 : LED <= 8'b01000000 ;
			8'd30 : LED <= 8'b00100000 ;
			8'd40 : LED <= 8'b00010000 ;
			8'd50 : LED <= 8'b00001000 ;
			8'd60 : LED <= 8'b00000100 ;
			8'd70 : LED <= 8'b00000010 ;
			8'd80 : LED <= 8'b00000001 ;
			default : LED <= 8'b00000000 ;
		endcase
	end
end
```


