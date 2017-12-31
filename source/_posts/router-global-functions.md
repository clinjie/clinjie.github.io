title: Verilog的testbench笔记
date: 2016-04-14 19:17:22
toc: true
tags: Verilog
categories: Verilog
---

记录下Router这个工程的几个全局函数.

# clogb #

```C
function integer clogb(input integer argument);
   integer 		     i;
   begin
      clogb = 0;
      for(i = argument - 1; i > 0; i = i >> 1)
		clogb = clogb + 1;
   end
endfunction
```
<!--more-->

函数的逻辑相当简单，计算二进制参数能够右移的数目，换算成十进制，就是计算能够除2多少次。这个逻辑大家都不回陌生，就是对数函数。以2为底的对数函数。

例如： res=clog(8)

参数为8，结果为3.显而易见，这个函数是典型的向上取整。


# croot #

```C
function integer croot(input integer argument, input integer base);
   integer i;
   integer j;
   begin
      croot = 0;
      i = 0;
      while(i < argument)
		begin
		   croot = croot + 1;
		   i = 1;
		   for(j = 0; j < base; j = j + 1)
		     i = i * croot;
		end
   end
endfunction
```

函数有两个参数，一个是传入的需要计算的参数`argument`，另外则是`base`基数。整个函数的逻辑就是base个`croot`相乘，看是否能够大于argument。croot逐次增加，直到满足要求。同样的，函数也是向上取整

- argument:10~16 base:2

croot=4

- argument:9~27 base:3

croot=3

显然，函数的逻辑是将argument开base根.


# pop_count #

```C
function integer pop_count(input integer argument);
   integer i;
   begin
      pop_count = 0;
      for(i = argument; i > 0; i = i >> 1)
		pop_count = pop_count + (i & 1);
   end
endfunction
```

判断参数最低位是否为1，然后将参数右移，继续判断，判定正确则加1.

```
1:1
2:1
3:2
4:1
5:2
6:2
7:3
8:1
9:2
10:2
11:3
12:2
13:3
14:3
15:4
```

# suffix_length #

```C
function integer suffix_length(input integer value1, input integer value2);
   integer v1, v2;
   begin
      v1 = value1;
      v2 = value2;
      suffix_length = 0;
      while(v1 != v2)
		begin
		   suffix_length = suffix_length + 1;
		   v1 = v1 >> 1;
		   v2 = v2 >> 1;
		end
   end
endfunction
```


计算两个传入的参数从最低位开始到最高位有多少位数不相同。
