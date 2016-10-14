title: Java设计模式
date: 2016-10-03 19:12:37
toc: true
tags: java
categories: java
---

**设计模式（Design Patterns）<——> 可复用面向对象软件的基础**

>设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。 毫无疑问，设计模式于己于他人于系统都是多赢的，设计模式使代码编制真正工程化，设计模式是软件工程的基石，如同大厦的一块块砖石一样。项目中合理的运用设计模式可以完美的解决很多问题，每种模式在现在中都有相应的原理来与之对应，每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的核心解决方案，这也是它能被广泛应用的原因。


# 设计模式分类 #

按照设计模式的用法用途，我们一般讲java的设计模式分为以下几种：

- 创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。

- 结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。

<!--more-->

- 行为型模式，共十一种：策略模式、模板方法模式、观察者模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。

- 并发型模式

- 线程池模式


![用一张图来串联起这些模式的关系](http://dl.iteye.com/upload/attachment/0083/1179/57a92d42-4d84-3aa9-a8b9-63a0b02c2c36.jpg)


## 设计模式特性 ##

- 开闭原则（Open Close Principle）

开闭原则就是说对扩展开放，对修改关闭。在程序需要进行拓展的时候，不能去修改原有的代码，实现一个热插拔的效果。所以一句话概括就是：为了使程序的扩展性好，易于维护和升级。想要达到这样的效果，我们需要使用接口和抽象类，后面的具体设计中我们会提到这点。

- 里氏代换原则（Liskov Substitution Principle）

里氏代换原则(Liskov Substitution Principle LSP)面向对象设计的基本原则之一。 里氏代换原则中说，任何基类可以出现的地方，子类一定可以出现。 LSP是继承复用的基石，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。里氏代换原则是对“开-闭”原则的补充。实现“开-闭”原则的关键步骤就是抽象化。而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。

- 依赖倒转原则（Dependence Inversion Principle）

这个是开闭原则的基础，具体内容：真对接口编程，依赖于抽象而不依赖于具体。
- 接口隔离原则（Interface Segregation Principle）
这个原则的意思是：使用多个隔离的接口，比使用单个接口要好。还是一个降低类之间的耦合度的意思，从这儿我们看出，其实设计模式就是一个软件的设计思想，从大型软件架构出发，为了升级和维护方便。所以上文中多次出现：降低依赖，降低耦合。

- 迪米特法则（最少知道原则）（Demeter Principle）

为什么叫最少知道原则，就是说：一个实体应当尽量少的与其他实体之间发生相互作用，使得系统功能模块相对独立。

- 合成复用原则（Composite Reuse Principle）

原则是尽量使用合成/聚合的方式，而不是使用继承。


# 模式解析 #

## 工厂模式 ##

首先介绍普通的工厂模式，建立一个工厂类，对实现了同一接口的一些类进行实例的创建。

1. 创建这些类共同的接口

```java
public interface Sender{
	public void Send();
}
```

2. 根据要处理的事件创造不同的实现类

```java
public class SmsSender implements Sender{
	public void Send(){
	//分别实现方法
	System.out.println("sms sender");
	}
}

public class MailSender implements Sender{
	public void Send(){
		System.out.println("mail sender");
	}
}
```

3. 创建接口的工厂类

工厂类负责对实现了接口的实现类进行实例化

```java
public class SendFactory{
	public Sender produce(String type){
		if("sms".equals(type)){
			//进行sms对象的实例化
			return new SmsSender();
		}
		else if("mail".equals(type)){
			//进行sms对象的实例化
			return new MailSender();
		}
		else System.out.println("plz input correct type string");
	}
}
```

4. 进行工厂模式的测试

```java
public class FactoryTest{
	public static void main(String[] args){
		SendFactory factory=new SendFactory();
		Sender sender=factory.produce("sms");
		sender.Send();
	}
}
```

-多个工厂方法模式

上面的工厂模式中，工厂类只有一个方法，是根据传递的str参数进行匹配，如果没有传递对正确的str参数，无法执行。多个工厂方法模式改进这一地方，在工厂类中直接根据不同的接口实现类实现不同的方法，在工厂对象中，进行调用不同的方法。


- 静态工厂方法模式

将工厂类中的接口类对象实例化方法静态化，之后就无需先实例化工厂类，再调用他的接口类实例化方法。可以直接调用静态方法。


>工厂模式适合：凡是出现了大量的产品需要创建，并且具有共同的接口时，可以通过工厂方法模式进行创建。在以上的三种模式中，第一种如果传入的字符串有误，不能正确创建对象，第三种相对于第二种，不需要实例化工厂类，所以，大多数情况下，我们会选用第三种——静态工厂方法模式。


**Abstract Factory抽象工厂**

想要拓展程序，必须对工厂类进行修改，这违背了闭包原则，所以，从设计角度考虑，我们使用抽象工厂模式，创建多个工厂类，这样一旦需要增加新的功能，直接增加新的工厂类就可以了，不需要修改之前的代码。

其中第一项以及第二项的接口类和接口实现类没有变化。

3. 创建多个工厂类

```java
public class SendMailFactory implements Provider {  
      
    @Override  
    public Sender produce(){  
        return new MailSender();  
    }  
}  

public class SendSmsFactory implements Provider{
	public Sender produce(){
		return new SnsSender();
	}
}
```

4. 创建多个工厂类的接口

这一步骤实际上应该是在第3步之前完成，所有的工程类都要实现这个接口。这样增加新的功能可以直接添加新的工厂类。

```java
public interface Provider {  
    public Sender produce();  
}  
```

5. 测试

```java
public class Test {  
    public static void main(String[] args) {  
        Provider provider = new SendMailFactory();  
        Sender sender = provider.produce();  
        sender.Send();  
    }  
}  
```

上面做的好处就是，当我们想要新加一种功能，例如发送图片SendPic，使用抽象工厂就无需对之前的代码进行改编，只需要

1. 创建实现Sender接口的类

2. 创建实现Provider接口的工厂类


```java
public class PicSender implements Sender{
	public void Send(){
		System.out.println("I send a pic");
	}
} 

public class SendPicFactory implements Provider{
	public void produce(){
		return new PicSender();
	}
}
```

