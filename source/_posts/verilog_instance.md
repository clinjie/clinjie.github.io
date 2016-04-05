title: verilog实例
date: 2016-03-23 15:23:35
toc: true
tags: 
- Verilog HDL
categories: Verilog
---

模块（module）是Verilog 的基本描述单位，用于描述某个设计的功能或结构及与其他模块通信的外部端口。


模块在概念上可等同一个器件就如我们调用通用器件（与门、三态门等）或通用宏单元（计数器、ALU、CPU）等，因此，一个模块可在另一个模块中调用。


一个电路设计可由多个模块组合而成，因此一个模块的设计只是一个系统设计中的某个层次设计，模块设计可采用多种建模方式。

<!--more-->

# 小程序 #

## 加法器 ##

```
module addr(a,b,cin,count,sum);
	input [2,0]a;
	input [2,0]b;
	input cin;
	output count;
	output [2,0]sum;
	assign {count,sum}=a+b+cin
endmodule
```

上面的程序描述的是一个3位加法器，可以看出来，程序从module开始，以endmodule结束。

- `input [2,0]a`

表示声明一个3bit的输入变量，命名为a

- `assign {count，sum}=a+b+cin`

表明为线网类型赋值，`{}`是连接符号，count是1bit，sum是3bit，所以连接之后是4bit，最高位是count。等式右边是2个3bit相加，再加上一个1bit的，实现的全加器。

## 比较器 ##

```
module compare （equal，a，b）；
input [1:0] a,b; // declare the input signal ;
output equare ; // declare the output signal;
assign equare = (a == b) ? 1:0 ;
/ * if a = b , output 1, otherwise 0；*/
endmodule
```

逻辑部分是一个三目运算符号，有C语言基础的都可以看懂。


# 三态驱动器 #

```
module mytri (din, d_en, d_out);
	input din;
	input d_en;
	output d_out;
	// -- Enter your statements here -- //
	assign d_out = d_en ? din :'bz;
endmodule

module trist (din, d_en, d_out);
	input din;
	input d_en;
	output d_out;
	// --statements here -- //
	mytri u_mytri(din,d_en,d_out);
endmodule
```

该例描述了一个三态驱动器。其中三态驱动门在模块 mytri 中描述，而在模块trist 中调用了模 mytri 。模块mytri 对trist 而言相当于一个已存在的器件，在trist 模块中对该器件进行实例化，实例化名 u_mytri 。

# 模块结构 #

- 模块内容是嵌在module 和endmodule两个语句之间。每个模块实现特定的功能，模块可进行层次的 套，因此可以将大型的数字电路设计分割成大小不一的小模块来实现特定的功能，最后通过由顶层模块调用子模块来实现整体功能，这就是Top-Down的设计思想.

- 模块包括接口描述部分和逻辑功能描述部分。这可以把模块与器件相类比。

模块的端口定义部分：

如上例： module addr (a, b, cin, count, sum); 其中module 是模块的保留字，addr 是模块的名字，相当于器件名。（）内是该模块的端口声明，定义了该模块的管脚名，是该模块与其他模块
通讯的`外部接口`，相当于器件的pin 。
模块的内容，包括I/O说明，内部信号、调用模块等的声明语句和功能定义语句。
I/O说明语句如： input [2:0] a; input [2:0] b; input cin; output count; 其中input 、
output、inout 是保留字，定义了管脚信号的流向，[n:0]表示该信号的`位宽`（总线或单根信号线）。

逻辑功能描述部分如： assign d_out = d_en ? din :'bz;
mytri u_mytri(din,d_en,d_out);

功能描述用来产生各种逻辑（主要是组合逻辑和时序逻辑，可用多种方法进行描述），还可用来实例化一个器件，该器件可以是厂家的器件库也可以是我们自己用HDL设计的模块（相当于在原理图输入时调用一个库元件）。在逻辑功能描述中，主要用到assign 和always 两个语句。

- 对每个模块都要进行端口定义，并说明输入、输出口，然后对模块的功能进行逻辑描述，当然，对测试模块，可以没有输入输出口。

- Verilog HDL 的书写格式自由，一行可以写几个语句，也可以一个语句分几行写。具体由代码书写规范约束。

- 除endmodule 语句外，每个语句后面需有分号表示该语句结束。

# 全加器 #

## 一位全加器 ##

![](http://7xowaa.com1.z0.glb.clouddn.com/verilog_hdl.png)

如上图是一位全加器

这里先说明下什么是全加器，并说下全加器半加器的区别：


- 半加器不考虑低位过来的进位，只计算2个一位二进制数相加。产生一个本位和，还有一个向高位的进位信号。

- 全加器考虑低位过来的进位，计算2个一位二进制数相加。产生一个本位和，还有一个向高位的进位信号。

- 即半加器有二个输入，二个输出。全加器有三个输入，2个输出。


```
module FA_struct (A, B, Cin, Sum, Count);
	input A;
	input B;
	input Cin;
	output Sum;
	output Count;
	wire S1, T1, T2, T3;
	// -- statements -- //
	xor x1 (S1, A, B);
	xor x2 (Sum, S1, Cin);
	and A1 (T3, A, B );
	and A2 (T2, B, Cin);
	and A3 (T1, A, Cin);
	or O1 (Cout, T1, T2, T3 );
endmodule
```

该实例显示了一个全加器由两个异或门、三个与门、一个或门构成。S1、T1、T2、T3则是门与门之间的连线。代码显示了用纯结构的建模方式，其中xor 、and、or 是Verilog HDL 内置的器件。以 xor x1 (S1, A, B) 该例化语句为例：
xor 表明调用一个内置的异或门，器件名称xor ，代码实例化名x1（类似原理图输入方式）。括号内的S1，A，B 表明该器件管脚的实际连接线（信号）的名称，其中 A、B是输入，S1是输出。其他同。

## 两位全加器 ##

两位的全加器可通过调用两个一位的全加器来实现。该设计的设计层次示意图和结构图如下：

![](http://7xowaa.com1.z0.glb.clouddn.com/2bitFA.png)

```
module Four_bit_FA (FA, FB, FCin, FSum, FCout ) ;
	parameter SIZE = 2;
	input [SIZE:1] FA;
	input [SIZE:1] FB;
	input FCin;
	output [SIZE:1] FSum;
	output FCout;
	wire FTemp;
	FA_struct FA1(
		.A (FA[1]),
		.B (FB[1]),
		.Cin (FCin) ,
		.Sum (FSum[1]),
		.Cout (Ftemp)
	);
	FA_struct FA2(
		.A (FA[2]),
		.B (FB[2]),
		.Cin (FTemp) ,
		.Sum (FSum[2]),
		.Cout (FCount )
	);
endmodule
```

除了低位的进位Fcin，输入FA与FB都是两位，将输入的两位分别放到两个一位全加器上面，就好像我们在做两位数加法时，也是将个位、十位分别相加，再加上进位。

该实例用结构化建模方式进行一个两位的全加器的设计，顶层模块Four_bit_FA 调用了两个一位的全加器 FA_struct 。在这里，以前的设计模块FA_struct 对顶层而言是一个现成的器件，顶层模块只要进行例化就可以了。注意这里的例化中，端口映射（管脚的连线）采用名字关联，如 .A （FA[2]） ，其中.A 表示 调用器件的管脚A，括号中的信号表示接到该管脚A的电路中的具体信号。wire 保留字表明信号Ftemp 是属线网类型（下面有具体描述）。

# Verilog建模 #

Verilog有三种建模方式，分别是

- 结构化描述方式

- 数据流描述方式

- 行为描述方式

其中数据流描述方式经常使用连续赋值语句，某个值被赋给某个网线变量。

`assign [delay] net_name = expression;`

注意在各assign 语句之间，是并行执行的，即各语句的执行与语句之间的顺序无关。

行为描述方式经常使用always、initial语句赋值。使用reg进行寄存器的声明。always是指一直在重复运行，由always后面括号的变量变化时触发。在always以及end之间是串行顺序执行的。

数据流型描述是一种描述组合逻辑功能的方法，用assign连续赋值语句来实现。