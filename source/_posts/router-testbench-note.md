title: router-testbench注解
date: 2015-04-15 22:17:22
toc: false
tags: Verilog
categories: Verilog
---

<-- 纯源码注解，于他人无意义 -->

基础知识：

- [credit流控机制相关](http://peihao.space/2016/03/28/router_know/)

- [wormhole router相关](http://peihao.space/2016/03/30/router-wormhole/)

- [flit-buffer&routing algorithm](http://peihao.space/2016/03/31/NoC-FIFO/) 

<!--more-->

```
`default_nettype none

module testbench
  ();
   
`include "c_functions.v"
`include "c_constants.v"
`include "rtr_constants.v"
`include "vcr_constants.v"
`include "parameters.v"
   
   parameter Tclk = 2; //时钟周期
   parameter initial_seed = 0; //初始种子
   
   // maximum number of packets to generate (-1 = no limit)
   parameter max_packet_count = -1;  //生成的包最大数目，-1为不限制
   
   // packet injection rate (percentage of cycles)
   parameter packet_rate = 25;   //包的注入速率  每个/每周期
   
   // flit consumption rate (percentage of cycles)
   parameter consume_rate = 50;   //微片使用速率/每周期
   
   // width of packet count register
   parameter packet_count_reg_width = 32;  //记录包数目寄存器的宽度
   
   // channel latency in cycles
   parameter channel_latency = 1;  //每周期的信道延迟
   
   // only inject traffic at the node ports
   parameter inject_node_ports_only = 1;  //是否只在在节点端口注入
   
   // warmup time in cycles
   parameter warmup_time = 100;  //周期间的预热时间
   
   // measurement interval in cycles
   parameter measure_time = 10000;  //周期间的测量间隔
   
   // select packet length mode (0: uniform random, 1: bimodal)
   parameter packet_length_mode = 0;  //选择包长度模式   0：均匀随机 1： 双峰
   
   
   // width required to select individual resource class
   localparam resource_class_idx_width = clogb(num_resource_classes);  //选择一个资源种类需要的寄存器宽度
   
   // total number of packet classes  
   localparam num_packet_classes = num_message_classes * num_resource_classes; //包的种类数目
   
   // number of VCs
   localparam num_vcs = num_packet_classes * num_vcs_per_class;  //虚拟信道数目
   
   // width required to select individual VC
   localparam vc_idx_width = clogb(num_vcs);   //选择一个虚拟信道需要的寄存器宽度
   
   // total number of routers  
   localparam num_routers //num_nodes已经是总共的数目了，但是如果除每个路由器分配的不能整除的话，就需要+1
     = (num_nodes + num_nodes_per_router - 1) / num_nodes_per_router;  //总的路由器数目
   
   // number of routers in each dimension
   localparam num_routers_per_dim = croot(num_routers, num_dimensions);   //单位面积路由器的数目
   
   // width required to select individual router in a dimension
   localparam dim_addr_width = clogb(num_routers_per_dim);    //在单位面积选择一个路由器需要的寄存器宽度
   
   // width required to select individual router in entire network
   localparam router_addr_width = num_dimensions * dim_addr_width;   //在整个网络中选择一个路由器需要的寄存器宽度
   
   // connectivity within each dimension
   localparam connectivity     //单位面积上互联的类别  根据拓扑结构分为线性、环形、全互联
     = (topology == `TOPOLOGY_MESH) ?
       `CONNECTIVITY_LINE :
       (topology == `TOPOLOGY_TORUS) ?
       `CONNECTIVITY_RING :
       (topology == `TOPOLOGY_FBFLY) ?
       `CONNECTIVITY_FULL :
       -1;
   
   // number of adjacent routers in each dimension
   localparam num_neighbors_per_dim   //单位面积上路由器相邻的路由器节点  根据互联类别分为2和total_num-1
     = ((connectivity == `CONNECTIVITY_LINE) ||
	(connectivity == `CONNECTIVITY_RING)) ?
       2 :
       (connectivity == `CONNECTIVITY_FULL) ?
       (num_routers_per_dim - 1) :
       -1;
   
   // number of input and output ports on router   //路由器的输入输出端口数目  input=output=num_ports
   localparam num_ports
     = num_dimensions * num_neighbors_per_dim + num_nodes_per_router;
   
   // width required to select individual port   //选择一个单独的端口需要的寄存器宽度
   localparam port_idx_width = clogb(num_ports);
   
   // width required to select individual node at current router   //当前的路由器上选择一个节点需要的寄存器宽度.每个路由器对应着多个node节点
   localparam node_addr_width = clogb(num_nodes_per_router);
   
   // width required for lookahead routing information
   localparam lar_info_width = port_idx_width + resource_class_idx_width; //预测的先行路由信息的寄存器宽度
   
   // total number of bits required for storing routing information   
   localparam dest_info_width  //存储路由信息所需的总共的比特数  目的节点
     = (routing_type == `ROUTING_TYPE_PHASED_DOR) ? 
       (num_resource_classes * router_addr_width + node_addr_width) : 
       -1;
   
   // total number of bits required for routing-related information
   localparam route_info_width = lar_info_width + dest_info_width;  //存储相关的路由信息所需的比特数   预测先行的+目的节点的
   
   // width of flow control signals
   localparam flow_ctrl_width    //流量控制信号宽度
     = (flow_ctrl_type == `FLOW_CTRL_TYPE_CREDIT) ? (1 + vc_idx_width) :
       -1;
   
   // width of link management signals   //链路管理信号宽度
   localparam link_ctrl_width = enable_link_pm ? 1 : 0;
   
   // width of flit control signals   //微片控制信号宽度
   localparam flit_ctrl_width
     = (packet_format == `PACKET_FORMAT_HEAD_TAIL) ? 
       (1 + vc_idx_width + 1 + 1) : 
       (packet_format == `PACKET_FORMAT_TAIL_ONLY) ? 
       (1 + vc_idx_width + 1) : 
       (packet_format == `PACKET_FORMAT_EXPLICIT_LENGTH) ? 
       (1 + vc_idx_width + 1) : 
       -1;
   
   // channel width   //信道宽度=链路控制宽度+微片控制宽度+微片数据宽度
   localparam channel_width
     = link_ctrl_width + flit_ctrl_width + flit_data_width;
   
   // use atomic VC allocation   //是否使用原子虚拟信道分配
   localparam atomic_vc_allocation = (elig_mask == `ELIG_MASK_USED);
   
   // number of pipeline stages in the channels  //信道的流水线级数
   localparam num_channel_stages = channel_latency - 1;
   
   reg clk;
   reg reset;
   
   wire [0:num_ports*channel_width-1] channel_in_ip;  //接收端的接受信道
   wire [0:num_ports*flow_ctrl_width-1] flow_ctrl_out_ip;  //接收端的输出流量控制
   wire [0:num_ports-1] 		flit_valid_in_ip;  //接收端接受微片验证
   wire [0:num_ports-1] 		cred_valid_out_ip;  //接收端发送信用验证
   
   wire [0:num_ports*channel_width-1] 	channel_out_op;  //发送端信道
   wire [0:num_ports*flow_ctrl_width-1] flow_ctrl_in_op; //发送端接受的流量控制
   wire [0:num_ports-1] 		flit_valid_out_op;  //发送端发送的微片验证
   wire [0:num_ports-1] 		cred_valid_in_op;  //发送端接受信用验证
   
   wire [0:num_ports-1] 		ps_error_ip;  //packet_source 错误
   
   reg [0:router_addr_width-1] 		router_address;  //路由器地址
   
   reg 					run;
   

/*

*/

   genvar 				ip;
      
   generate
      
      for(ip = 0; ip < num_ports; ip = ip + 1) //接收端端口从0开始
	     begin:ips
	   
    	   wire [0:flow_ctrl_width-1] flow_ctrl_out;  //当前接受端口的输出流量控制
    	   assign flow_ctrl_out = flow_ctrl_out_ip[ip*flow_ctrl_width:
    						   (ip+1)*flow_ctrl_width-1];  //flow_ctrl_out_ip里面存放的是所有端口的输出流量控制
    	   
    	   assign cred_valid_out_ip[ip] = flow_ctrl_out[0];  //当前接受端口的输出流量控制第一位存放的就是信用验证
	   
    	   if(inject_node_ports_only && (ip < (num_ports-num_nodes_per_router)))//当前接收端口号<（总接收端口数-每个路由器管理的节点数目）剩余可分配给其他的数目
    	     begin
    		
          		assign channel_in_ip[ip*channel_width:(ip+1)*channel_width-1]  //接收端输入信道值=000000
          		  = {channel_width{1'b0}};
          		assign flit_valid_in_ip[ip] = 1'b0;  //  接收端接收微片验证值=0
          		
          		assign ps_error_ip[ip] = 1'b0;  //接收端包报错=0
    		
    	     end
    	   else
    	     begin
		
          		wire [0:flow_ctrl_width-1] flow_ctrl_dly;  //如果当前接收端口号码>每个路由器管理的节点数目  也就是前面接收端口占完了
          		c_shift_reg        //延迟-流量控制 dly-delay
          		  #(.width(flow_ctrl_width),
          		    .depth(num_channel_stages),
          		    .reset_type(reset_type))
          		flow_ctrl_dly_sr
          		  (.clk(clk),
          		   .reset(reset),
          		   .active(1'b1),
          		   .data_in(flow_ctrl_out),
          		   .data_out(flow_ctrl_dly));
          		
          		wire [0:channel_width-1]   channel;
          		wire 			   flit_valid;
          		
          		wire 			   ps_error;
          		
          		packet_source
          		  #(.initial_seed(initial_seed+ip),  //初始种子
          		    .max_packet_count(max_packet_count),  //生成的最大的包数目，-1为无限制
          		    .packet_rate(packet_rate),  //每周期 包的注入速率
          		    .packet_count_reg_width(packet_count_reg_width),  //记录包数目的寄存器宽度
          		    .packet_length_mode(packet_length_mode),  //选择包长度的模式 均匀随机还是双峰分布
          		    .topology(topology),  //片上网络拓扑结构
          		    .buffer_size(buffer_size),  //缓存容量
          		    .num_message_classes(num_message_classes), //消息种类的类别  比如 请求、回复
          		    .num_resource_classes(num_resource_classes),  //选择资源的种类 比如 最小的、自适应的
          		    .num_vcs_per_class(num_vcs_per_class),  //每一类的虚拟信道数目
          		    .num_nodes(num_nodes),  //节点数目
          		    .num_dimensions(num_dimensions),  //面积
          		    .num_nodes_per_router(num_nodes_per_router),  //每个路由器分管的节点数
          		    .packet_format(packet_format), //数据包格式
          		    .flow_ctrl_type(flow_ctrl_type),  //流量控制类别
          		    .flow_ctrl_bypass(flow_ctrl_bypass),  //使输入流控信号绕过（忽略）输出虚拟信道状态跟踪逻辑
          		    .max_payload_length(max_payload_length),  //最大负载长度
          		    .min_payload_length(min_payload_length),  //最小负载长度
          		    .enable_link_pm(enable_link_pm),  //是否启用链路功率管理
          		    .flit_data_width(flit_data_width),
          		    .routing_type(routing_type),
          		    .dim_order(dim_order),
          		    .fb_mgmt_type(fb_mgmt_type), //微片缓存管理模式
          		    .disable_static_reservations(disable_static_reservations),  //动态缓存管理相关
          		    .elig_mask(elig_mask),  //选择是否从虚拟信道分配中排除满或非空虚拟信道
          		    .port_id(ip),  //which router port is this packet source attached to  哪个路由器端口数这个数据包连接
          		    .reset_type(reset_type))
          		ps
          		  (.clk(clk),
          		   .reset(reset),
          		   .router_address(router_address),  //目前路由器的地址
          		   .channel(channel),  //输出
          		   .flit_valid(flit_valid),  //输出
          		   .flow_ctrl(flow_ctrl_dly),
          		   .run(run),   //伪随机数据包
          		   .error(ps_error));  //输出
          		
          		assign ps_error_ip[ip] = ps_error;
          		
          		wire [0:channel_width-1]    channel_dly;   //延迟信道
          		c_shift_reg
          		  #(.width(channel_width),
          		    .depth(num_channel_stages),
          		    .reset_type(reset_type))
          		channel_dly_sr
          		  (.clk(clk),
          		   .reset(reset),
          		   .active(1'b1),
          		   .data_in(channel),
          		   .data_out(channel_dly));
          		
          		assign channel_in_ip[ip*channel_width:(ip+1)*channel_width-1]
          		  = channel_dly;
          		
          		wire 			    flit_valid_dly;    //延迟微片验证
          		c_shift_reg
          		  #(.width(1),
          		    .depth(num_channel_stages),
          		    .reset_type(reset_type))
          		flit_valid_dly_sr
          		  (.clk(clk),
          		   .reset(reset),
          		   .active(1'b1),
          		   .data_in(flit_valid),
          		   .data_out(flit_valid_dly));
          		
          		assign flit_valid_in_ip[ip] = flit_valid_dly;
          		
          	end   //出现接收数据包数目比静态可分配端口数目多的
	     end
      
   endgenerate


   /*接收端包括缓冲、接收工作完成*/


   /*单路由器路由工作开始*/
   
   
   wire 				    rtr_error;
   
   router_wrap
     #(.topology(topology),    //拓扑结构
       .buffer_size(buffer_size),  //缓存数量
       .num_message_classes(num_message_classes),  //消息种类数目
       .num_resource_classes(num_resource_classes),  //资源种类数目
       .num_vcs_per_class(num_vcs_per_class),  //每类的虚拟信道
       .num_nodes(num_nodes),  //总的节点数目
       .num_dimensions(num_dimensions),  //面积
       .num_nodes_per_router(num_nodes_per_router),  //每个路由器分管的节点数目
       .packet_format(packet_format),  //包的格式
       .flow_ctrl_type(flow_ctrl_type), //流量控制类别
       .flow_ctrl_bypass(flow_ctrl_bypass),  
       .max_payload_length(max_payload_length),  //最大负载长度
       .min_payload_length(min_payload_length),   //最低负载长度
       .router_type(router_type),  //路由器类别
       .enable_link_pm(enable_link_pm),  //是否启用链路功率管理
       .flit_data_width(flit_data_width),  //微片数据宽度
       .error_capture_mode(error_capture_mode),  //抓取的错误模式
       .restrict_turns(restrict_turns),  //转向限制
       .predecode_lar_info(predecode_lar_info),  //前缀解析信息
       .routing_type(routing_type),  //路由种类
       .dim_order(dim_order),  //选择面积遍历顺序
       .input_stage_can_hold(input_stage_can_hold),   //将输入寄存器作为部分的微片缓存use input register as part of the flit buffer
       .fb_regfile_type(fb_regfile_type),  //选择微片缓存寄存器文件类别的实现变种
       .fb_mgmt_type(fb_mgmt_type),  //微片缓存管理模式
       .explicit_pipeline_register(explicit_pipeline_register),   //是否使用明确的管道寄存器在缓存和交叉开关
       .dual_path_alloc(dual_path_alloc),  //是否双重路径分配
       .dual_path_allow_conflicts(dual_path_allow_conflicts),  //解决因为双重路径分配后的输出冲突
       .dual_path_mask_on_ready(dual_path_mask_on_ready),  //如果有任何的slow路径请求已就绪就遮盖fast路径请求
       .precomp_ivc_sel(precomp_ivc_sel),  //预先一个时钟周期计算输入端仲裁结果
       .precomp_ip_sel(precomp_ip_sel),  //预先一个时钟周期计算输出端仲裁结果
       .elig_mask(elig_mask),    //选择是否从虚拟信道分配中排除满或非空虚拟信道
       .vc_alloc_type(vc_alloc_type), //虚拟信道分配类型
       .vc_alloc_arbiter_type(vc_alloc_arbiter_type),  //虚拟信道分配仲裁类型
       .vc_alloc_prefer_empty(vc_alloc_prefer_empty),  //在虚拟信道分配中是否更偏向于空的虚拟信道相比非空虚拟信道
       .sw_alloc_type(sw_alloc_type),  //开关分配类型
       .sw_alloc_arbiter_type(sw_alloc_arbiter_type),  //开关分配仲裁类别
       .sw_alloc_spec_type(sw_alloc_spec_type),  //选择开关分配的预测类型
       .crossbar_type(crossbar_type),  //交叉开关分配
       .reset_type(reset_type))   //重置类型  同步：异步
   rtr
     (.clk(clk),
      .reset(reset),
      .router_address(router_address),
      .channel_in_ip(channel_in_ip),
      .flow_ctrl_out_ip(flow_ctrl_out_ip),  //输出
      .channel_out_op(channel_out_op),  //输出
      .flow_ctrl_in_op(flow_ctrl_in_op),
      .error(rtr_error)); //输出
   
   
      /*单路由器内部工作完成*/




      /*simple reference model for a single router一个路由器的简单参考模型*/


   wire 				      rchk_error;
   
   router_checker   
     #(.buffer_size(buffer_size), //缓冲大小
       .num_message_classes(num_message_classes),   //消息类别数目  request、reply
       .num_resource_classes(num_resource_classes),  //资源类别数目  简单的、自适应的
       .num_vcs_per_class(num_vcs_per_class),  //每个类别虚拟信道数量
       .num_routers_per_dim(num_routers_per_dim),  //单位面积路由器数目
       .num_dimensions(num_dimensions),   //面积
       .num_nodes_per_router(num_nodes_per_router),  //路由器分管节点
       .connectivity(connectivity),  //互联种类
       .packet_format(packet_format),  //数据包格式  均匀随机、双峰随机
       .max_payload_length(max_payload_length),   //最大负载长度
       .min_payload_length(min_payload_length),//最小负载长度
       .enable_link_pm(enable_link_pm),  //是否启用链路功率管理
       .flit_data_width(flit_data_width),  //微片数据宽度
       .error_capture_mode(error_capture_mode),  //error检测的逻辑配置
       .routing_type(routing_type),  //路由算法类型
       .dim_order(dim_order),  //维序遍历顺序
       .reset_type(reset_type))  //reset类别
   rchk
     (.clk(clk),  //input
      .reset(reset),  //input
      .router_address(router_address), //input  当前路由器地址
      .channel_in_ip(channel_in_ip),  //input 输入信道
      .channel_out_op(channel_out_op),  //input  输出信道
      .error(rchk_error));  //output 错误
   
   
   wire [0:num_ports-1] 		      fs_error_op;
   
   genvar 				      op;
   
   generate
      
      for(op = 0; op < num_ports; op = op + 1)
	begin:ops
	   
	   wire [0:channel_width-1] channel_out;
	   assign channel_out = channel_out_op[op*channel_width:
					       (op+1)*channel_width-1];
	   
	   wire [0:flit_ctrl_width-1] flit_ctrl_out;
	   assign flit_ctrl_out
	     = channel_out[link_ctrl_width:link_ctrl_width+flit_ctrl_width-1];
	   
	   assign flit_valid_out_op[op] = flit_ctrl_out[0];
	   
	   wire [0:channel_width-1] channel_dly;   //信道延迟
	   c_shift_reg
	     #(.width(channel_width),
	       .depth(num_channel_stages),
	       .reset_type(reset_type))
	   channel_dly_sr
	     (.clk(clk),
	      .reset(reset),
	      .active(1'b1),
	      .data_in(channel_out),
	      .data_out(channel_dly));


	   
	   wire [0:flow_ctrl_width-1] flow_ctrl;
	   
	   wire 		      fs_error;
	   
	   flit_sink     //汇聚节点微片控制
	     #(.initial_seed(initial_seed + num_ports + op),
	       .consume_rate(consume_rate),  //微片消耗速率
	       .buffer_size(buffer_size),  
	       .num_vcs(num_vcs),
	       .packet_format(packet_format),
	       .flow_ctrl_type(flow_ctrl_type),
	       .max_payload_length(max_payload_length),
	       .min_payload_length(min_payload_length),
	       .route_info_width(route_info_width),  //存储相关的路由信息所需的比特数
	       .enable_link_pm(enable_link_pm),  //是否启用链路功率管理
	       .flit_data_width(flit_data_width),
	       .fb_regfile_type(fb_regfile_type), //选择微片缓存寄存器文件类别的实现变种
	       .fb_mgmt_type(fb_mgmt_type),  //微片缓存管理模式
	       .atomic_vc_allocation(atomic_vc_allocation),  //是否使用原子虚拟信道分配
	       .reset_type(reset_type))
	   fs
	     (.clk(clk),
	      .reset(reset),
	      .channel(channel_dly),
	      .flow_ctrl(flow_ctrl),  //output
	      .error(fs_error));  //output
	   
	   assign fs_error_op[op] = fs_error;
	   
	   wire [0:flow_ctrl_width-1] flow_ctrl_dly;   //延迟流量控制
	   c_shift_reg
	     #(.width(flow_ctrl_width),
	       .depth(num_channel_stages),
	       .reset_type(reset_type))
	   flow_ctrl_in_sr
	     (.clk(clk),
	      .reset(reset),
	      .active(1'b1),
	      .data_in(flow_ctrl),
	      .data_out(flow_ctrl_dly));
	   
	   assign flow_ctrl_in_op[op*flow_ctrl_width:(op+1)*flow_ctrl_width-1]
		    = flow_ctrl_dly;
	   
	   assign cred_valid_in_op[op] = flow_ctrl_dly[0];
	   
	end
      
   endgenerate
   
   wire [0:2] tb_errors;  //3bit  分别是  数据包error、微片汇聚error、路由错误
   assign tb_errors = {|ps_error_ip, |fs_error_op, rchk_error};
   
   wire       tb_error;
   assign tb_error = |tb_errors;
   
   wire [0:31] in_flits_s, in_flits_q;
   assign in_flits_s = in_flits_q + pop_count(flit_valid_in_ip);
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   in_flitsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(in_flits_s),
      .q(in_flits_q));
   
   wire [0:31] in_flits;
   assign in_flits = in_flits_s;
   
   wire [0:31] in_creds_s, in_creds_q;
   assign in_creds_s = in_creds_q + pop_count(cred_valid_out_ip);
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   in_credsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(in_creds_s),
      .q(in_creds_q));
   
   wire [0:31] in_creds;
   assign in_creds = in_creds_q;
   
   wire [0:31] out_flits_s, out_flits_q;
   assign out_flits_s = out_flits_q + pop_count(flit_valid_out_op);
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   out_flitsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(out_flits_s),
      .q(out_flits_q));
   
   wire [0:31] out_flits;
   assign out_flits = out_flits_s;
   
   wire [0:31] out_creds_s, out_creds_q;
   assign out_creds_s = out_creds_q + pop_count(cred_valid_in_op);
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   out_credsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(out_creds_s),
      .q(out_creds_q));
   
   wire [0:31] out_creds;
   assign out_creds = out_creds_q;
   
   reg 	       count_en;
   
   wire [0:31] count_in_flits_s, count_in_flits_q;
   assign count_in_flits_s
     = count_en ?
       count_in_flits_q + pop_count(flit_valid_in_ip) :
       count_in_flits_q;
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   count_in_flitsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(count_in_flits_s),
      .q(count_in_flits_q));
   
   wire [0:31] count_in_flits;
   assign count_in_flits = count_in_flits_s;
   
   wire [0:31] count_out_flits_s, count_out_flits_q;
   assign count_out_flits_s
     = count_en ?
       count_out_flits_q + pop_count(flit_valid_out_op) :
       count_out_flits_q;
   c_dff
     #(.width(32),
       .reset_type(reset_type))
   count_out_flitsq
     (.clk(clk),
      .reset(reset),
      .active(1'b1),
      .d(count_out_flits_s),
      .q(count_out_flits_q));
   
   wire [0:31] count_out_flits;
   assign count_out_flits = count_out_flits_s;
   
   reg 	       clk_en;
   
   always
   begin
      clk <= clk_en;
      #(Tclk/2);
      clk <= 1'b0;
      #(Tclk/2);
   end
   
   always @(posedge clk)
     begin
	if(rtr_error)
	  begin
	     $display("internal error detected, cyc=%d", $time);
	     $stop;
	  end
	if(tb_error)
	  begin
	     $display("external error detected, cyc=%d", $time);
	     $stop;
	  end
     end
   
   integer cycles;
   integer d;
   
   initial
   begin
      
      for(d = 0; d < num_dimensions; d = d + 1)
      	begin
      	   router_address[d*dim_addr_width +: dim_addr_width]
      	     = num_routers_per_dim / 2;
      	end
      
      reset = 1'b0;
      clk_en = 1'b0;
      run = 1'b0;
      count_en = 1'b0;
      cycles = 0;
      
      #(Tclk);
      
      #(Tclk/2);
      
      reset = 1'b1;
      
      #(Tclk);
      
      reset = 1'b0;
      
      #(Tclk);
      
      clk_en = 1'b1;
      
      #(Tclk/2);
      
      $display("warming up...");
      
      run = 1'b1;

      while(cycles < warmup_time)
	begin
	   cycles = cycles + 1;
	   #(Tclk);
	end
      
      $display("measuring...");
      
      count_en = 1'b1;
      
      while(cycles < warmup_time + measure_time)
	begin
	   cycles = cycles + 1;
	   #(Tclk);
	end
      
      count_en = 1'b0;
      
      $display("measured %d cycles", measure_time);
      
      $display("%d flits in, %d flits out", count_in_flits, count_out_flits);
      
      $display("cooling down...");
      
      run = 1'b0;
      
      while((in_flits > out_flits) || (in_flits > in_creds))
	begin
	   cycles = cycles + 1;
	   #(Tclk);
	end
      
      #(Tclk*10);
      
      $display("simulation ended after %d cycles", cycles);
      
      $display("%d flits received, %d flits sent", in_flits, out_flits);
      
      $finish;
      
   end
   
endmodule
```