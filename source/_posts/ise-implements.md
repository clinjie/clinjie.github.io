title: 基于ISE的实现
date: 2015-04-12 14:17:22
tags: Verilog
categories: Verilog
---

所谓实现（Implement）是将综合输出的逻辑网表翻译成所选器件的底层模块与硬件原语，将设计映射到器件结构上，进行布局布线，达到在选定器件上实现设计的目的。实现主要分为3个步骤：翻译（Translate）逻辑网表，映射（Map）到器件单元与布局布线（Place & Route）。翻译的主要作用是将综合输出的逻辑网表翻译为Xilinx特定器件的底层结构和硬件原语（具体的原语详见第3章中的原语介绍）。映射的主要作用是将设计映射到具体型号的器件上（LUT、FF、Carry等）。布局布线步骤调用Xilinx布局布线器，根据用户约束和物理约束，对设计模块进行实际的布局，并根据设计连接，对布局后的模块进行布线，产生FPGA/CPLD配置文件。 


# 翻译过程 #

在翻译过程中，设计文件和约束文件将被合并生成NGD（原始类型数据库）输出文件和BLD文件，其中NGD文件包含了当前设计的全部逻辑描述，BLD文件是转换的运行和结果报告。实现工具可以导入EDN、EDF、EDIF、SEDIF格式的设计文件，以及UCF（用户约束文件）、NCF（网表约束文件）、NMC（物理宏库文件）、NGC（含有约束信息的网表）格式的约束文件。翻译项目包括3个命令：

- [Translation Report]用以显示翻译步骤的报告；
<!--more-->
- [Floorplan Design]用以启动Xilinx布局规划器（Floorplanner）进行手动布局，提高布局器效率；

- [Generate Post-Translate Simulation Model]用以产生翻译步骤后仿真模型，由于该仿真模型不包含实际布线时延，所以有时省略此仿真步骤。

# 映射过程 #

在映射过程中，由转换流程生成的NGD文件将被映射为目标器件的特定物理逻辑单元，并保存在NCD（展开的物理设计数据库）文件中。映射的输入文件包括NGD、NMC、NCD和MFP（映射布局规划器）文件，输出文件包括NCD、PCF（物理约束文件）、NGM和MRP（映射报告）文件。其中MRP文件是通过Floorplanner生成的布局约束文件，NCD文件包含当前设计的物理映射信息，PCF文件包含当前设计的物理约束信息，NGM文件与当前设计的静态时序分析有关，MRP文件是映射的运行报告，主要包括映射的命令行参数、目标设计占用的逻辑资源、映射过程中出现的错误和告警、优化过程中删除的逻辑等内容。映射项目包括如下命令：

- [Map Report]用以显示映射步骤的报告；

- [Generate Post-Map Static Timing]产生映射静态时序分析报告，启动时序分析器（Timing Analyzer）分析映射后静态时序；

- [Manually Place & Route （FPGA Editor）]用以启动FPGA底层编辑器进行手动布局布线，指导Xilinx自动布局布线器，解决布局布线异常，提高布局布线效率；

- [Generate Post-Map Simulation Model]用以产生映射步 骤后仿真模型，由于该仿真模型不包含实际布线时延，所以有时也省略此仿真步骤。 
 
# 布局和布线过程 #

布局和布线（Place & Route）：通过读取当前设计的NCD文件，布局布线将映射后生成的物理逻辑单元在目标系统中放置和连线，并提取相应的时间参数。布局布线的输入文件包括NCD和PCF模板文件，输出文件包括NCD、DLY（延时文件）、PAD和PAR文件。在布局布线的输出文件中，NCD包含当前设计的全部物理实现信息，DLY文件包含当前设计的网络延时信息，PAD文件包含当前设计的输入输出（I/O）管脚配置信息，PAR文件主要包括布局布线的命令行参数、布局布线中出现的错误和告警、目标占用的资源、未布线网络、网络时序信息等内容。布局布线步骤的命令与工具非常多：

- [Place & Route Report]用以显示布局布线报告；

- [Asynchronous Delay Report]用以显示异步实现报告；

- [Pad Report]用以显示管脚锁定报告；

- [Guide Results Report]用以显示布局布线指导报告，该报告仅在使用布局布线指导文件NCD文件后才产生；

- [Generate Post-Place & Route Static Timing]包含了进行布局布线后静态时序分析的一系列命令，可以启动Timing Analyzer分析布局布线后的静态时序；

- [View/Edit Place Design（Floorplanner）]和[View/Edit Place Design（FPGA Editor）]用以启动Floorplanner和FPGA Editor完成FPGA布局布线的结果分析、编辑，手动更改布局布线结果，产生布局布线指导与约束文件，辅助Xilinx自动布局布线器，提高布局布线效率并解决布局布线中的问题；

- [Analyze Power（XPower）]用以启动功耗仿真器分析设计功耗；

- [Generate Post-Place & Route Simulation Model]用以产生布局布线后仿真模型，该仿真模型包含的时延信息最全，不仅包含门延时，还包含了实际布线延时。该仿真步骤必须进行，以确保设计功能与FPGA实际运行结果一致；

- [Generate IBIS Model]用以产生IBIS仿真模型，辅助PCB布板的仿真与设计；

- [Multi Pass Place & Route]用以进行多周期反复布线；

- [Back-annotate Pin Locations]用以反标管脚锁定信息

经过综合后，在过程管理区双击“Implement Design”选项，就可以完成实现.经过实现后能够得到精确的资源占用情况。 
