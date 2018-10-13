title: verilog过程块与赋值
date: 2016-04-18 14:17:22
tags: Verilog
categories: Verilog
---

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

当敏感信号表达式的值改变时候，就执行一遍块内语句。同时always过程块是不能够嵌套使用的。<!--more-->

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

# 连续赋值 #

用连续赋值语句表达的是： `assign val=newval;`

任何一个输入的改变都将立即导致输出更新；

```
module orand(out,a,b,c,d,e);
	input a,b,c,d,e;
	output out;
	assign out=3&(a|b)&(c|d);
endmodule
```

# 过程赋值语句 #

过程赋值语句常用于对reg变量进行赋值。一般分为两种，*阻塞赋值*与*非阻塞赋值*

## 阻塞与非阻塞赋值 ##

赋值的类型选择取决于建模的逻辑类型。

- 在时序块的RTL代码中使用*非阻塞赋值*`<=`。非阻塞赋值在块结束后才完成赋值操作。此赋值方式可以避免在仿真出现魔仙和竞争现象。

- 在组合的RTL代码中使用*阻塞赋值*`=`。使用阻塞赋值方式对一个变量进行赋值时，此变量的值在赋值语句执行完后才能之后就立即改变。

## compare ##

使用非阻塞赋值方式进行赋值时，各个赋值语句同步执行；因此通常在一个时钟沿对临时变量进行赋值，而在另一个时钟沿对其进行采样。因为在相同的时钟沿采样赋值，采样的还是原来的值，赋值操作是在块结束时进行。

- 阻塞赋值

下面模块会综合成为触发器

```
module block(clk,a,b);
input clk,a;
output b;
reg b;
always @(posedge clk)
	begin
		y=a;
		b=y;
	end
endmodule
```


- 非阻塞赋值

下面的模块会综合成两个触发器

```
module block(clk,a,b);
input clk,a;
output b;
reg b;
always @(posedge clk)
	begin
		y<=a;
		b<=y;
	end
endmodule
```


![](\img\article\ise\block-unblock-setvalue.png)

上图左侧是阻塞赋值的综合结果，右侧则为非阻塞赋值。相比左侧，右侧的例子会造成一个时钟周期的延迟。