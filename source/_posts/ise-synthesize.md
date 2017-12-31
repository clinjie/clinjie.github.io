title: 基于Xilinx的Synthesize
date: 2016-04-18 14:17:22
toc: true
tags: Verilog
categories: Verilog
---

所谓综合，就是讲HDL语言、原理图等设计输入翻译成由与、或、非们和RAM、触发器登记本逻辑单元的逻辑连接（即网表）。并根据目标和要求（约束条件）优化生成的逻辑连接。

# ISE-XST #

XST是Xilinx公司自己的综合（Synthsize）工具。当我们完成输入、仿真以及管脚分配之后就可以进行综合和实现。

双击Synthesize-XST，就可以完成综合。一般而言，会有三种结果：

- 仿真完成

- Warn警告

- ERROR错误

Warn会在Synthesize-XST出现黄色警示，而Error有红色标识。

综合完成之后可以通过使用XST的`View RTLSchematics`工具查看RTL级结构图。

![](http://7xowaa.com1.z0.glb.clouddn.com/adder-RTL.png)
<!--more-->

# Synthesize Proprtties #

- [Optimization Goal]：优化的目标。该参数决定了综合工具对设计进行优化时，是以面积还是以速度作为优先原则。面积优先原则可以节省器件内部的逻辑资源，即尽可能地采用串行逻辑结构，但这是以牺牲速度为代价的。而速度优先原则保证了器件的整体工作速度，即尽可能地采用并行逻辑结构，但这样将会浪费器件内部大量的逻辑资源，因此，它是以牺牲逻辑资源为代价的。 

- [Optimization Effort]：优化器努力程度。这里有[normal]和[high]两种选择方式。对于[normal]，优化器对逻辑设计仅仅进行普通的优化处理，其结果可能并不是最好的，但是综合和优化流程执行地较快。如果选择[high]，优化器对逻辑设计进行反复的优化处理和分析，并能生成最理想的综合和优化结果，在对高性能和最终的设计通常采用这种模式；当然在综合和优化时，需要的时间较长。 

- [Use Synthesis Constraints File]：使用综合约束文件。如果选择了该选项，那么综合约束文件XCF有效。 

- [Synthesis Constraints File]：综合约束文件。该选项用于指定XST综合约束文件XCF的路径。 

- [Global Optimization Goal]：全局优化目标。可以选择的属性包括有[AllClockNets]、[Inpad To Outpad]、[Offest In Before]、[Offest Out After]、[Maximm Delay]。该参数仅对FPGA器件有效，可用于选择所设定的寄存器之间、输入引脚到寄存器之间、寄存器到输出引脚之间，或者是输入引脚到输出引脚之间逻辑的优化策略。 

- [Generate RTL Schematic]：生成寄存器传输级视图文件。该参数用于将综合结果生成RTL视图。 

- [Write Timing Constraints]：写时序约束。该参数仅对FPGA有效，用来设置是否将HDL源代码中用于控制综合的时序约束传给NGC网表文件，该文件用于布局和布线。

#  HDL语言选项 #

- [FSM Encoding Algorithm]：有限状态机编码算法。该参数用于指定有限状态机的编码方式。选项有[Auto]、[One-Hot]、[Compact]、[Sequential]、[Gray]、[Johnson]、[User]、[Speed1]、[None]编码方式，默认为[Auto]编码方式。 

- [Safe Implementation]：将添加安全模式约束来实现有限状态机，将添加额外的逻辑将状态机从无效状态调转到有效状态，否则只能复位来实现，有[Yes]、[No]两种选择，默认为[No]。

- [Case Implementation Sytle]：条件语句实现类型。该参数用于控制XST综合工具解释和推论Verilog的条件语句。其中选项有[None]、[Full]、[Parallel]、[Full-Parallel]，默认为[None]。 对于这四种选项，区别如下：（1）[None]，XST将保留程序中条件语句的原型，不进行任何处理；（2）[Full]，XST认为条件语句是完整的，避免锁存器的产生；（3）[Parallel]，XST认为在条件语句中不能产生分支，并且不使用优先级编码器；（4）[Full-Parallel]，XST认为条件语句是完整的，并且在内部没有分支，不使用锁存器和优先级编码器。 

- [RAM Extraction]：存储器扩展。该参数仅对FPGA有效，用于使能和禁止RAM宏接口。默认为允许使用RAM宏接口。 

- [RAM Style]：RAM实现类型。该参数仅对FPGA有效，用于选择是采用块RAM还是分布式RAM来作为RAM的实现类型。默认为 [Auto]。 

- [ROM Extraction]：只读存储器扩展。该参数仅对FPGA有效，用于使能和禁止只读存储器ROM宏接口。默认为允许使用ROM宏接口。 

- [ROM Style]：ROM实现类型。该参数仅对FPGA有效，用于选择是采用块RAM还是分布式RAM来作为ROM的实现和推论类型。默认为[Auto]。 

- [Mux Extraction]：多路复用器扩展。该参数用于使能和禁止多路复用器的宏接口。根据某些内定的算法，对于每个已识别的多路复用/选择器，XST能够创建一个宏，并进行逻辑的优化。可以选择[Yes]、[No]和[Force]中的任何一种，默认为[Yes]。 

- [Mux Style]：多路复用实现类型。该参数用于胃宏生成器选择实现和推论多路复用/选择器的宏类型。可以选择[Auto]、[MUXF]和[MUXCY]中的任何一种，默认为[Auto]。 

- [Decoder Extraction]：译码器扩展。该参数用于使能和禁止译码器宏接口，默认为允许使用该接口。 

- [Priority Encoder Extraction]：优先级译码器扩展。该参数用于指定是否使用带有优先级的编码器宏单元。 

- [Shift Register Extraction]：移位寄存器扩展。该参数仅对FPGA有效，用于指定是否使用移位寄存器宏单元。默认为使能。 

- [Logical Shifter Extraction]：逻辑移位寄存器扩展。该参数仅对FPGA有效，用于指定是否使用逻辑移位寄存器宏单元。默认为使能。 

- [XOR Collapsing]：异或逻辑合并方式。该参数仅对FPGA有效，用于指定是否将级联的异或逻辑单元合并成一个大的异或宏逻辑结构。默认为使能。 

- [Resource Sharing]：资源共享。该参数用于指定在XST综合时，是否允许复用一些运算处理模块，如加法器、减法器、加/减法器和乘法器。默认为使能。如果综合工具的选择是以速度为优先原则的，那么就不考虑资源共享。 

- [Multiplier Style]：乘法器实现类型。该参数仅对FPGA有效，用于指定宏生成器使用乘法器宏单元的方式。选项有[Auto]、Block]、[LUT]和[Pipe_LUT]。默认为[Auto]。选择的乘法器实现类型和所选择的器件有关。

# 特殊选项 #

Xilinx特殊选项用于将用户逻辑适配到Xilinx芯片的特殊结构中，不仅能节省资源，还能提高设计的工作频率

- [Add I/O Buffers]：插入I/O缓冲器。该参数用于控制对所综合的模块是否自动插入I/O缓冲器。默认为自动插入。 

- [Max Fanout]：最大扇出数。该参数用于指定信号和网线的最大扇出数。这里扇出数的选择与设计的性能有直接的关系，需要用户合理选择。 

- [Register Duplication]：寄存器复制。该参数用于控制是否允许寄存器的复制。对于高扇出和时序不能满足要求的寄存器进行复制，可以减少缓冲器输出的数目以及逻辑级数，改变时序的某些特性，提高设计的工作频率。默认为允许寄存器复制。 

- [Equivalent Register Removal]：等效寄存器删除。该参数用于指定是否把寄存器传输级功能等效的寄存器删除，这样可以减少寄存器资源的使用。如果某个寄存器是用Xilinx的硬件原语指定的，那么就不会被删除。默认为使能。 

- [Register Balancing]：寄存器配平。该参数仅对FPGA有效，用于指定是否允许平衡寄存器。可选项有[No]、[Yes]、    [Forward]和[Backward]。采用寄存器配平技术，可以改善某些设计的时序条件。其中，[Forward]为前移寄存器配平，[Backward]为后移寄存器配平。采用寄存器配平后，所用到的寄存器数就会相应地增减。默认为寄存器不配平。 

- [Move First Flip-Flop Stage]：移动前级寄存器。该参数仅对FPGA有效，用于控制在进行寄存器配平时，是否允许移动前级寄存器。如果[Register Balancing]的设置为[No]，那么该参数的设置无效。 

- [Move Last Flip-Flop Stage]：移动后级寄存器。该参数仅对FPGA有效，用于控制在进行寄存器配平时，是否允许移动后级寄存器。如果[Register Balancing]的设置为[No]，那么该参数的设置无效。 

- [Pack I/O Registers into IOBs]：I/O寄存器置于输入输出块。该参数仅对FPGA有效，用于控制是否将逻辑设计中的寄存器用IOB内部寄存器实现。在Xilinx系列FPGA的IOB中分别有输入和输出寄存器。如果将设计中的第一级寄存器或最后一级寄存器用IOB内部寄存器实现，那么就可以缩短IO引脚到寄存器之间的路径，这通常可以缩短大约1~2ns的传输时延。默认为[Auto]。 

- [Slice Packing]：优化Slice结构。该参数仅对FPGA有效，用于控制是否将关键路径的查找表逻辑尽量配置在同一个Slice或者CLB模块中，由此来缩短LUT之间的布线。这一功能对于提高设计的工作频率、改善时序特性是非常有用的。 默认为允许优化Slice结构。 

- [Optimize Instantiated Primitives]：优化已例化的原语。该参数控制是否需要优化在HDL代码中已例化的原语。默认为不优化。




**以上三个部分分别用于设置综合的全局目标和整体策略、HDL硬件语法规则以及Xilinx特有的结构属性。**