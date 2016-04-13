title: testbench实例
date: 2016-04-12 14:17:22
toc: true
tags: Verilog
categories: Verilog
---

本文介绍在ISE开发环境下，由两个16bit加法器构成的、可以完成4个16bit输入的18bit输出加法器。

# IP核 #

IP Core就是预先设计好、经过严格测试和优化过的电路功能模块，如乘法器、FIR滤波器、PCI接口等，并且一般采用参数可配置的结构，方便用户根据实际情况来调用这些模块。随着FPGA规模的增加，使用IP core完成设计成为发展趋势。

IP Core生成器（Core Generator）是Xilinx FPGA设计中的一个重要设计工具，提供了大量成熟的、高效的IP Core为用户所用，涵盖了汽车工业、基本单元、通信和网络、数字信号处理、FPGA特点和设计、数学函数、记忆和存储单元、标准总线接口等8大类。<!--more-->

# IP核生成器的使用 #

在这里，我们使用ISE提供的IP Core生成器创建3个加法器IP Core。包含2个16bit 2输入加法器与1个17bit 2输入加法器。

![](\img\article\ise\ise-newsource-wizard.png)

点击工程器件，右键新建源文件。选择IP Core，填写基本信息后，在IP Core目录中选择`Math Function`->`Adders Subtracter`

![](http://7xowaa.com1.z0.glb.clouddn.com/IP-Core-proper.png)

填写基本的IP Core属性。16bit输入的加法器，输出时17bit；同理17bit输入、输出时18bit。

IP Core在综合时被认为是黑盒子，综合器不对IP Core做任何编译。IP Core的仿真主要是运用Core Generator的仿真模型来完成的，会自动生成扩展名为.v的源代码文件。设计人员只需要从该源文件中查看其端口声明，将其作为一个普通的子程序进行调用即可。

# 逻辑生成 #

```
`timescale 1ns / 1ps
module add(
    input clk,
    input [15:0] a1,
    input [15:0] a2,
    input [15:0] b1,
    input [15:0] b2,
    output [17:0] c
    );
wire [16:0] ab1,ab2;

adder adder16_1(
	.a(a1),
	.b(a2),
	.s(ab1),
	.clk(clk));
	
adder adder16_2(
	.a(b1),
	.b(b2),
	.s(ab2),
	.clk(clk));

adder17 adder7(
	.a(ab1),
	.b(ab2),
	.s(c),
	.clk(clk));
endmodule
```

这里定义了两个wire类型变量存储16bit输入的加法器输出结果，同时作为17bit加法器的输入。

![](http://7xowaa.com1.z0.glb.clouddn.com/adder-RTL.png)

上图是RTL级结构。

# TestBench文件编写 #

```
`timescale 1ns / 1ps
module ttt;

	// Inputs
	reg clk;
	reg [15:0] a1;
	reg [15:0] a2;
	reg [15:0] b1;
	reg [15:0] b2;

	// Outputs
	wire [17:0] c;

	// Instantiate the Unit Under Test (UUT)
	add uut (
		.clk(clk), 
		.a1(a1), 
		.a2(a2), 
		.b1(b1), 
		.b2(b2), 
		.c(c)
	);

	initial begin
		// Initialize Inputs
		clk = 0;
		a1 = 0;
		a2 = 0;
		b1 = 0;
		b2 = 0;

		// Wait 100 ns for global reset to finish
		#100;
        
		// Add stimulus here
		forever begin
			#5;
			clk=~clk;
			if(clk==1)begin
				a1=a1+1;
				a2=a2+1;
				b1=b1+1;
				b2=b2+1;
			end
		end
	end
endmodule
```

上面设置的激励规定了输入初始值全为0，同时每隔10ns，4个模块15bit变量输入值加1。在仿真中可以看到仿真结果，由于每一级都会产生一个时钟周期的延迟，最终会有2个时钟周期的延迟。


# Tips #

要注意的是，在IP Core创建的时候，一定要确保所有输入端口都有用到。我刚开始生成的时候，多选择了`C_in`输入，导致在综合是由Warn提醒，同时在测试时，输出仿真失败，显示红色警告。18bit的输出结果最低2bit一直是xx.这里一定要注意。对于FPGA仿真而言，每一个值都应该有初始值设置。