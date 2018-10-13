title: Router源代码架构--Filt_sink
date: 2016-04-15 22:17:22
tags: Verilog
categories: Verilog
---

# Filt_sink源码结构 #

![](http://7xowaa.com1.z0.glb.clouddn.com/flit-sink01.png)

先来讲flit_sink，也就是汇聚节点（网关）的微片控制模块。整个大模块下分4个相对小的模块结构。

- chi-rtr_channel_input

接收端信道接口   input channel interface

- gnt_ivc_arb

通用仲裁，指出哪一个虚拟信道 generic arbiter

- fb

微片缓冲 flit buffer 
<!--more-->
- fco

发送端的流量控制接口 output port flow control


# chi 接收端信道接口 #

![](http://7xowaa.com1.z0.glb.clouddn.com/flit-sink02.png)

信道接口分管的模块比较多:

- link_activityq

活动链表队列寄存器

- flit_dataq

微片数据队列寄存器

-  flit_validq

微片验证寄存器

-  flit_ctrlq

微片控制信号队列寄存器

-  flit_sel_out_ivc_dec

indicate which VC the current flit (if any) belongs to，指明目前的微片属于哪个虚拟信道。从one-hot编码转换成二进制

-  flit_headq

头微片队列寄存器

-  flit_head_out_sel

指明头微片

-  flit_ctrq

微片数目队列计算器 flit_counter

-  flit_tail_out_sel

指明尾微片

# gnt_ivc_arb仲裁 #

最后获取的是仲裁的虚拟信道结果

![](http://7xowaa.com1.z0.glb.clouddn.com/flit-sink03.png)

- gnt_lod

leading one detector前导1检测方法

- rr_arb

轮询调度仲裁

- prefix_arb

基于轮询调度的前缀树

- matrix_arb-c_matrix_arbiter

矩阵仲裁

# flit buffer微片缓冲 #

![](http://7xowaa.com1.z0.glb.clouddn.com/flit-sink04.png)

微片缓冲是NoC Router接收端非常重要的一部分:

- has_tail_ivcq

指出哪个虚拟信道有尾微片

- push_mask_dec

掩码压栈解码

- tailq

尾微片队列寄存器

- pop_mask_dec

掩码出栈解码

- pop_tail_sel

尾微片选择

- samqc

controller for statically allocated multi-queue. 已分配的多静态队列的控制器

- push_addr_sel

压栈地址选择

- damqc

已分配的动态队列控制器

- pop_addr_sel

出栈地址选择

- empty_sel

空的虚拟信道选择

- pop_dataq

数据寄存器出栈

- read_addrq

读地址

- bf

buffer file  缓存的寄存器文件

- pop_next_addr_sel

下个出栈的地址选择

# fco输出端流控 #

![](http://7xowaa.com1.z0.glb.clouddn.com/flit-sink05.png)

发送端流量控制模块的下属模块很简洁，主要包括：

- cred_validq

信用验证

- cred_vc_enc

虚拟信道信用编码

- cred_vcq

虚拟信道信用