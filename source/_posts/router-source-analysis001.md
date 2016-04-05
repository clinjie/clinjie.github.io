title: router-source-analysis
date: 2016-04-04 20:17:22
toc: 
tags: NoC
categories: NoC
---

# constant value #

在分析第一个Verilog HDL Router中的check模块之前，首先在前面声明一下代码中会使用到的常量值：

```C
// disable error reporting
`define ERROR_CAPTURE_MODE_NONE       0

// don't hold errors
`define ERROR_CAPTURE_MODE_NO_HOLD    1

// capture first error only (subsequent errors are blocked) 
`define ERROR_CAPTURE_MODE_HOLD_FIRST 2

// capture all errors 
`define ERROR_CAPTURE_MODE_HOLD_ALL   3

`define ERROR_CAPTURE_MODE_LAST `ERROR_CAPTURE_MODE_HOLD_ALL

// asynchronous reset
`define RESET_TYPE_ASYNC 0

// synchronous reset
`define RESET_TYPE_SYNC  1

`define RESET_TYPE_LAST `RESET_TYPE_SYNC
```

# 实现reg #

在Router的check的错误警报模块中，具体实现这一功能的还是寄存器。上面的代码分别定义了一些错误警示以及错误重置的类型。<!--more-->

```C
/*
some input output var define ......
*/

case(reset_type)
	
	`RESET_TYPE_ASYNC:
	  always @(posedge clk, posedge reset)
	    if(reset)
	      q <= reset_value;
	    else if(active)
	      q <= d;
	
	`RESET_TYPE_SYNC:
	  always @(posedge clk)
	    if(reset)
	      q <= reset_value;
	    else if(active)
	      q <= d;
	
      endcase 
      
   endgenerate
```
首先有一个case选择器，选择重置信号的类型是同步还是异步重置。

- async

异步类型的重置，会接受在时钟的上升沿会接受两个信号，分别是时序电路中必须的时钟信号，以及重置信号。当是上升沿时reset=1信号触发了事件，将输出结果赋值为想要重置的值，否则保持输出结果保持为输入值不变。

- sync

同步类型的时序时间触发参数只有clk时钟参数。当此时的reset信号电平为高，则赋值reset值，否则保持不变。

同步与异步类型的区别保证了同步类型的重置信号只有在时钟上升沿时有可能会发生reset值重置，而异步类型只要reset信号为高电平即可触发。

# error模块 #

```C
generate
      
      if(capture_mode != `ERROR_CAPTURE_MODE_NONE)
	begin
	   
	   wire [0:num_errors-1] errors_s, errors_q;
	   
	   case(capture_mode)
	     
	     `ERROR_CAPTURE_MODE_NO_HOLD:
	       begin
		  assign errors_s = errors_in;
	       end
	     
	     `ERROR_CAPTURE_MODE_HOLD_FIRST:
	       begin
			//
		  assign errors_s = ~|errors_q ? errors_in : errors_q;
	       end
	     
	     `ERROR_CAPTURE_MODE_HOLD_ALL:
	       begin
		  assign errors_s = errors_q | errors_in;
	       end
	     
	   endcase
```

当有错误信息时，获取到捕捉的错误信息类型。根据先前在constant常量文件中定义的信息，error_s变量对应的是上面寄存器中的d变量，表示输入信号。

~| 表示或非位运算，做一次或者多次‘或’运算之后，再做一次非运算。有1出0，全0出1。

![](http://imgtec.eetrend.com/sites/imgtec.eetrend.com/files/201408/blog/3177-6309-6.jpg)

上面是Verilog HDL中运算符的优先级顺序。

根据捕获到的不同错误类型，将error_s的值对应赋值，分别赋值为:

- errors_s = errors_in

直接赋值为error模块的输入值

- errors_s = ~|errors_q ? errors_in : errors_q

当errors_q的值==0时，依然赋值为输入值，否则只要errors_q的值>0，有过改变就将它赋给errors_s。

- errors_s = errors_q | errors_in

赋值为当前erroes_q与errors_in的逻辑或运算结果。

其中errors_q是errors模块的实际输出结果，errors_in是模块的输入，errors_s时中间计算根据错误类型计算的输入值。

