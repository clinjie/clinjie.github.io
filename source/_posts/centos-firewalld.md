title: centos7.x shadowsocks多用户问题解决
date: 2015-11-21 12:19:39
toc: true
tags:
- linux
- 网络
categories: linux
---

# firewalld #

在centos7.x版本中，firewalld 取代 iptables成为了系统默认的防火墙，相比传统的iptables，firewalld有以下特点：

- 动态更新

修改配置文件后，不需要重启服务，可以动态支持
<!--more-->
- 加入zone概念

/etc/firewalld/zones目录下有多个配置文件：

1. trusted允许所有进来的流量
2. home拒绝所有进来的流量，除非是与出去的流量相关或者匹配ssh,mdsn,ipp-client,samba-client,dhcpv6-client
3. internal 和home是一样的
4. word 和home基本一样，但默认允许的程序只有：ssh,ipp-client,dhcpv6-client
5. public和home基本一样，但默认允许的程序只有：ssh,dhcpv6-client 是新加的网络接口的默认zone
6. external 和home类似，但默认允许的程序只有ssh.还可以作为masqueraded(SNAT)
7. dmz 和home类似，但默认允许的程序只有ssh
8. block和home类似,但没有默认允许的程序
9. drop和home类似，但不用ICMP errors包响应

分别创建或者修改 *.xml文件，添加进指定的xml文件代表端口使用规则，不同zone的优先级还没有研究

## usgae ##：

一般我们也用不到下面的几条命令，因为firewalld是动态更新的

- systemctl start  firewalld  启动

- systemctl stop  firewalld  关闭

- systemctl restart  firewalld  重启

# shadowsocks多用户配置 #

## 修改配置文件 ##

`vi /etc/shadowsocks.json`

```json
{
	"server":"::",
	"local_address":"127.0.0.1",
	"local_port":1080,
	"port_password":{
		"8989:"12345678",
		"8999":"12345678"
	},
	"timeout":300,
	"method":"aes-256-cfb",
	"fast_open": false
}
```

如果上面的配置完成后无法使用，centos7.x或者其他使用firewalld的用户继续往下看，多用户正常使用就不用看了

ss的默认中，端口号是8989（应该是吧...），可以在`/etc/firewalld/zones/public.xml`文件中查看

此时虽然我们配置了多个端口，但是由于另外的端口没有加入到防火墙中，是无法使用的，在文件中添加以下规则：

```xml
<port protocol="udp" port="8999"/>
<port protocol="tcp" port="8999"/>
```
将另外的端口加入tcp、udp白名单，firewalld即可动态更新配置
