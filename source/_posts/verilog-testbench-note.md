title: Verilog的testbench笔记
date: 2016-04-13 19:17:22
toc: true
tags: Verilog
categories: Verilog
---

# 并行块 #

在测试中经常会用到	`fork...join`块。使用并行块能表示以同一个时间起点算起的多个时间的运行，并行的执行复杂的过程结构，如循环或任务。

## eg ##
<!--more-->
```
module inilne_tb;
reg [7:0] data_bus;
	initial fork
		data_bus=8'b00;
		#10 data_bus=8'h45;
		//以下的两个repeat开始执行时间不同，但可以并行同时执行
		#20 repeat(10) #10 data_bus=data_bus+1;
		#25 repeat(5) #20 data_bus=data_bus<<1;
		#140 data_bus=8'h0f;
	join
endmodule
```

![](http://7xowaa.com1.z0.glb.clouddn.com/fork-join.png?imageView/2/w/610/q/100)

- 0时刻对data_bus赋初始值

- 10个单位时间之后对data_bus重新赋值

- 从20单位时间开始，每10个单位时间数据自加

- 从25单位时间开始，没20个单位时间数据左移，与上一条指令并行执行

- 140单位时间再赋值

# 建立时钟 #

虽然有时候在设计中会包含时钟，但时钟通常在测试模块中。可以使用门级和行为级建立时钟模型。行为描述一般使用的人较多。

## 简单的对称方波 ##

```
reg clk;
always begin
	#peroid/2 clk=0;
	#peroid/2 clk=1;
end
```

## 简单带延迟的对称方波时钟 ##

```
reg clk;
initial begin
	clk=0;
	#(peroid)
	forever
		#(peroid/2) clk=!clk;
end
```

## 不规则形 ##

```
reg clk;
initial begin
	#(peroid+1) clk=1;
	#(peroid/2-1)
	forever begin
		#(peroid/4) clk=0;
		#(3*peroid/4) clk=1;
	end
end
```

将会产生一个带延迟的，占空比不为1，同时投脉冲不规则的时钟。

# Verilog高级结构 #

## task ##

一般用于编写测试模块或者行为描述的模块。其中可以包含时间控制（如： #delays,@,wait）；也可以包含input、output、inout端口定义和参数；同时也可以调用其他任务或函数。


----------
```
module bus_ctrl_tb;
	reg[7:0] data;
	reg data_valid,data_rd;
	cpu ul(data_valid,data,data_in);
	initial begin
		//在模块中调用task
		cpu_driver(8'b0000_0000)
		cpu_driver(8'b0000_0000)
		cpu_driver(8'b0000_0000)
	end
	//定义task
	task cpu_driver;
	input [7:0] data_in;
		begin
			#30 data_valid=1;
			wait(data_rd==1);
			#20 data=data_in;
			wait(data_rd==0);
			#20 data=8'hzz;
			#30 data_valid=0;
		end
	endtask
endmodule
```

在测试模块中使用任务可以提高程序代码的效率，可以用任务把多次重复的操作包装起来。

同时要注意的是，模块的任务中，用于定时控制的信号，例如clk绝对不能作为任务的输入。因为输入值只想任务内部传递第一次，而定时控制一般来讲绝对不止一次传递控制。

不要在程序的不同部分同时调用一个任务。这是因为任务只有一组本地变量，同一时刻调用两次相同的任务将会导致错误。这种情况同时发生在使用定时控制的任务中。


----------
```
parameter MAX_BITS=8;
reg[MAX_BITS:1] D;

task reverse_bits;
//双向总线端口被当做寄存器类型
inout [7:0] data;
integer K;
	for(K=0;K<MAX_BITS;K=K+1)
		reverse_bits[MAX_BITS-(K+1)]=data[K];
endtask
always @ (posedge clk)
	reverse_bits(D);
```

上面的代码可以看出，在task定义过程中，有直接使用`reverse_bits[MAX_BITS-(K+1)]=data[K];`，也就是说，在Verilog中与函数一样，task、function调用都是直接将参数代替函数名直接改变。上面的调用 `reverse_bits(D)`等价于:

```
inout [7:0] data;
integer K;
	for(K=0;K<MAX_BITS;K=K+1)
		D[MAX_BITS-(K+1)]=data[K];
```

任务只含有一个双向总线（inout）端口和一个内部变量，没有其他输入端口、输出端口和定时控制，没有引用模块变量。

在任务调用时候，任务的输入变量（端口）在任务内部被当做寄存器类型变量处理（D）。


----------
```
module mult(clk,a,b,out,en_mult);
	input clk,en_mult;
	input [3:0]a,b;
	output [7:0] out;
	reg[15:0] out;
		always @ (posedge clk)
			//任务调用
			multme(a,b,out);
	task multme;
		input [3:0] xme,tome;
		output [7:0] result;
		wait(en_mult)
			result=xme*tome;
	endtask
endmodule
```

模块中定义的任务含有输入，输出，时间控制和一个内部变量，并且引用了一个本模块的变量。任务调用时候参数的顺序应该与任务定义声明的变量顺序相同。

## function ##

函数不能包含定时控制，但是可以在包含定时控制的过程块中调用函数。

在模块中，使用名为func的函数时，是将它作为名为func的寄存器类型变量来处理。


----------
```
module orand(a,b,c,d,e,out);
	input [&;0] a,b,c,d,e;
	output[7:0] out;
	reg[7:0] out;
	always @(a,b,c,d,e);
		out=func(a,b,c,d,e);
	function [7:0] func;
		input [7:0] a,b,c,d,e;
		if(e==1)
			func=(a|b)&(c|d);
		else
			func=0;
	endfunction
endmodule 
```
- 不包含任何定时控制语句

- 至少一个输入，不能含有任何输出和总线口

- 只返回一个值，值的变量名与函数名同名，数据类型默认为reg

- 传递给函数的参数顺序与函数输入口声明的顺序相同

- 函数定义必须在模块定义内

- 函数不能调用任务（因为任务可能包含时间控制），反之可以

- 虽然函数只能返回一个值，但是他的返回值可以直接赋给一个由多个子信号拼购成的信号变量。`{o1,o2,o3,o4}=func(a,b,c,d,e)`

在函数定义时，如果在函数名之前定义了位宽，则函数就可以返回多bit构成的矢量。如果定义函数的语句比较多时，可以使用`begin...end`块。

函数名前面的位宽代表了返回值（一般就是以函数名为名的reg）的位宽。

若把函数定义为整型、实型或时间类型，就可以返回相应类型的数据。可以在任何类型的表达式中调用函数。

----------
```
module checksub(neg,in_a,in_b);
output neg;
input a,b;
reg neg;
	function integer subtr;
		input [7:0] in_a,in_b;
		subtr=in_a-in_b;
	endfunction
always @(a or b)
	begin if(subtr(a,b)<0)
			neg=1;
	else
		neg=0;
	else
endmodule
```