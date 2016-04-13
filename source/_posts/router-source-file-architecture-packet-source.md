title: Router源代码架构--packet_source
date: 2015-04-14 14:17:22
toc: true
tags: Verilog
categories: Verilog
---

# packet-source源码结构 #

packet_source模块主要负责与数据包打交道，在这里数据包由伪随机数据包模拟,下属的分模块比较多。

- waiting_packet_countq
- ready_packet_countq
- cho  channel ouput输出信道
- fci  flow control input  输入端流量控制
- flit_validq  微片验证
- flit_headq 头微片寄存器
- flit_tailq 尾微片寄存器
- flit_sel_ovcq 虚拟信道微片选择
- fcs  VC flow control state虚拟信道流量控制状态
- allocatedq<!--more-->已分配寄存器
- full_sel 选择满的虚拟信道
- elig_sel 选择合适的虚拟信道
- flit_pendingq  微片填充
- sel_mc_orc_mmult
- sel_mc_mmult
- sel_orc_mc_init
- sel_orc_mmult
- rtl
- route_port_enc
- route_rcsel_enc
- rc_dest_sel
- headq
- sel_ovc_dec

![](http://7xowaa.com1.z0.glb.clouddn.com/packet_source01.png)

