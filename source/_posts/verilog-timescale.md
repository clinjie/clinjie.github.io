title: Verilog中的timescale
date: 2016-04-10 14:17:22
tags: Verilog
categories: Verilog
---

在Verilog HDL 模型中，所有时延都用单位时间表述。使用`timescale
编译器指令将时间单位与实际时间相关联。该指令用于定义时延的单位和时延精度。


`timescale编译器指令格式为：

`timescale time_unit / time_precision`
<!--more-->
- time_unit 单位时间

- time_precision  时间精度

time_unit 和time_precision 由值1、10、和100以及单位s、ms、us、ns、ps和fs组成。

```
`timescale 1ns/ 100ps 
module AndFunc (Z, A, B); 
output Z; 
input A, B;  
and # (5.22, 6.17 ) Al (Z, A, B); 
//规定了上升及下降时延值。 
endmodule
```

编译器指令定义时延以ns为单位，并且时延精度为 0.1 ns（100 ps）。因此，时延值(#5.22)即代表5.22ns，5.22对应5.2 ns, 时延6.17对应6.2 ns。如果用如下的`timescale程序指令代替上例中的编译器指令,

```
`timescale 10ns/1ns
```

则基础的时间单位为10ns，精度1ns。5.22代表52.2ns，固定到精度上就是52ns。同理，6.17转换为62ns。


在编译过程中，timescale指令影响这一编译器指令后面所有模块中的时延值，直至遇到另一timescale指令或resetall指令。当一个设计中的多个模块带有自身的`timescale编译指令时将发生什么？在这种情况下，模拟器总是定位在所有模块的最小时延精度上，并且所有时延都相应地换算为最小时延精度。

在verilog中是没有默认timescale的。一个没有指定timescale的verilog模块就有可能错误的继承了前面编译模块的无效timescale参数。所以在verilog的LRM中推荐在每个module的前面指定`timescale,并且相
应的在最后加一个`resetall来确保timescale的局部有效。

