title: Verilog的testbench入门
date: 2016-04-11 14:17:22
tags: Verilog
categories: Verilog
---

# 基础知识 #

Test bench即Verilog需要编写的测试文件。在module设计完成、综合之后我们需要通过测试文件完成对设计module的测试。

Test bench大致分为下面三个部分:

- 时钟控制 clock control

一般采用always实现

- 实例化instantiate要测试的module

- 对实例的输入赋值
<!--more-->
 与待测模块的接口:

- 与输出端口相连接的变量定义为reg

- 与输出端口相连的定义为wire

## 初始化变量 ##

Verilog中使用`initial`block初始化变量。

## 时钟的产生 ##

`always # 10 clk=~clk;` 产生时钟

`initial repeat(13) #5 clk=~clk`

控制只产生13个时钟

## 同步数据 ##

`initial forever @ (posedge clk) #3 x=$random;`

为了降低多个输入同时翻转的概率，对时序电路的输入一般采用素数作为时间间隔

## 随机数据 ##

`initial repeat(5) #7 x=$random;`

`a=$random%60;` //产生-59到59之间的随机数


`a={$random}%60;` //产生0到59之间的随机数

## 产生随机事件间隔 ##

```
always begin
	t=$random
	#(t) x=$random;
	end 
```

## 数据缓存 ##

```
initial buffer = 16'b1110_0001_1011_0101;//将测试数据进行初始化
always@(posedge clk)
	#1 {x,buffer}={buffer,x}//可以在控制的数据下输入信号x
```
 ## 读取数据文件 ##

```
reg [7:0] mem1[0:1024];//定义一个1KB的存储
initial begin
	$readmemh(data1.dat,mem1)
```

# 简单的实例 #

```
`timescale 1ns / 10ps
`include "adder.v"
module test;

	// Inputs
	reg a,b;
	wire sum,count;

	// 实例化待测试模块
	add uut (
		.sum(sum),
		.c(count), 
		.b(b), 
		.a(a)
	);

	initial begin
		// Initialize Inputs
		a=0;
		//没经过20个单位时间，a取反
		forever #20 a=~a;
	end

	initial begin
		// Initialize Inputs
		b=0;
		//没经过10个单位时间，b取反
		forever #10 b=~b;
	end

	initial begin
		//监控输出
		$monitor()$time,,,"%d+%d={%d,%d}",a,b,count,sum;
		#40 $stop;
	end
endmodule
```

## Tip ##

- `$monitor`  出输出打印显示

- `$stop`  停止当前仿真

- `￥finish`  结束仿真

## 时钟产生 ##

- 使用initial语句

```
reg clock;
initial begin
	clock=0;
	forever #10 clock=~clock;
end
```

- 使用always语句

```
reg clock;
initial
	clock=0;
always
	#10 clock=~clock;
```
