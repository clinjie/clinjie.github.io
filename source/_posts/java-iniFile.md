title: Java操作Ini文件
date: 2016-4-25 15:28:30
toc: true
tags:
- java
categories: java
---

![](http://7xowaa.com1.z0.glb.clouddn.com/ini-file.jpg)

这个问题最开始是一个朋友面试时面试官让他解决的问题，他拿来请教我，我正好借此机会了解了下这种数据、配置存储文件。

>ini 文件是Initialization File的缩写，即初始化文件，是windows的系统配置文件所采用的存储格式，统管windows的各项配置，一般用户就用windows提供的各项图形化管理界面就可实现相同的配置了。但在某些情况，还是要直接编辑ini才方便，一般只有很熟悉windows才能去直接编辑。开始时用于WIN3X下面，WIN95用注册表代替，以及后面的内容表示一个节，相当于注册表中的键。

<!--more-->

# 具体Format #

INI文件由节（Section）、参数Item：键（key）、值（value）组成。

- data

```
[section name]

参数（键=值）
name=value
```

- 注解

注解使用分号表示（;）。在分号后面的文字，直到该行结尾都全部为注解。
```
; comment textINI文件的数据格式的例子（配置文件的内容）　[Section1 Name]
KeyName1=value1
KeyName2=value2
```

因为INI文件可能是项目中共用的，所以使用[Section Name]段名来区分不同用途的参数区。

# Java操作 #

在常规的WIn平台下，ini文件的默认编码格式是ANSI。

>不同的国家和地区制定了不同的标准，由此产生了 GB2312、GBK、GB18030、Big5、Shift_JIS 等各自的编码标准。这些使用多个字节来代表一个字符的各种汉字延伸编码方式，称为 ANSI 编码。在简体中文Windows操作系统中，ANSI 编码代表 GBK 编码；在繁体中文Windows操作系统中，ANSI编码代表Big5；在日文Windows操作系统中，ANSI 编码代表 Shift_JIS 编码。
不同 ANSI 编码之间互不兼容，当信息在国际间交流时，无法将属于两种语言的文字，存储在同一段 ANSI 编码的文本中。

ANSI在我们国内的具体编码实现实际上是GB2312（或GBK），所以我们对这种格式的文本数据进行操作即可。

Java INI Package (JavaINI) 是一个 Java 语言用来读写 INI 文件的工具包.[Project Location](http://javaini.sourceforge.net/)，以下称为Ini开源包.

Ini开源包默认的编码格式是ASCII，也就是默认只操作范围内的128个字符，这会大大限制Ini开源包的功能。通过修改org.dtools.ini包的IniFileWriter类改属性值ENCODING，修改成适合我们的编码。GB2312、GBK在国内使用，因为win平台建立的ini文件默认就是ANSI编码，所以推荐修改为这两种编码格式。如果想要国际化，则可将ENCODING修改为UTF-8即可。


- 读操作

```java
IniFile ini = new BasicIniFile(false);//不使用大小写敏感
public void readContent(){
		IniFileReader reader = new IniFileReader(ini, file);
		try {
			reader.read();
		} catch (IOException e) {
			e.printStackTrace();
		}
		//获取ini文件的所有Section
		for(int i=0;i<ini.getNumberOfSections();i++){
			IniSection sec = ini.getSection(i);
			//获取每个Section的Item
			System.out.println("---- " + sec.getName() + " ----");
			for(IniItem item : sec.getItems()){
				System.out.println(item.getName() + " = " + item.getValue());
			}
		}
	}
```

- 写操作

```java
public void writeContent(){
		//创建一个数据Section，在本例中Section名为 config
		IniSection dataSection = new BasicIniSection( "config" );
		ini.addSection( dataSection );
		
		//在上面的Section中添加Item，包括name、sex、age
		IniItem nameItem = new IniItem( "name" );
		nameItem.setValue("clinjie");
		dataSection.addItem( nameItem );

		IniItem ageItem = new IniItem( "age" );
		ageItem.setValue("999999");
		dataSection.addItem( ageItem );
		
		IniItem sexItem = new IniItem( "sex" );
		sexItem.setValue("男");
		dataSection.addItem( sexItem );
		
		
		//将数据写入到磁盘
		IniFileWriter writer=new IniFileWriter(ini, file);
		try {
			writer.write();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
```