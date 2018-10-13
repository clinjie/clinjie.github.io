title: Java设计模式-创建型
date: 2016-10-04 21:12:37
tags: java
categories: java
---

# 建造者模式 #

工厂类模式提供的是创建单个类的模式，而建造者模式则是将各种产品集中起来进行管理，用来创建复合对象，所谓复合对象就是指某个类具有不同的属性，其实建造者模式就是前面抽象工厂模式和最后的Test结合起来得到的。我们看一下代码：
还和前面一样，一个Sender接口，两个实现类MailSender和SmsSender。最后，建造者类如下：
<!--more-->

```java
public interface Sender{
	......
}

public class MailSender implements Sender{
	......
}

public class SmsSender implements Sender{
	......
}

public class Builder {  
      
    private List<Sender> list = new ArrayList<Sender>();  
      
    public void produceMailSender(int count){  
        for(int i=0; i<count; i++){  
            list.add(new MailSender());  
        }  
    }  
      
    public void produceSmsSender(int count){  
        for(int i=0; i<count; i++){  
            list.add(new SmsSender());  
        }  
    }  
}  


//测试


public class Test {  
  
    public static void main(String[] args) {  
        Builder builder = new Builder();  
        builder.produceMailSender(10);  
    }  
}
```

建造者模式将很多功能集成到一个类里，这个类可以创造出比较复杂的东西。所以与工程模式的区别就是：工厂模式关注的是创建单个产品，而建造者模式则关注创建符合对象，多个部分。因此，是选择工厂模式还是建造者模式，依实际情况而定。



# 原型模式 #

Prototype

该模式的思想就是将一个对象作为原型，对其进行复制、克隆，产生一个和原对象类似的新对象。在Java中，复制对象是通过clone()实现的，先创建一个原型类：


```java
public class Prototype implements Cloneable {  
  
    public Object clonex() throws CloneNotSupportedException {  
        Prototype proto = (Prototype) super.clone();  
        return proto;  
    }  
}
```

一个原型类，只需要实现Cloneable接口，编写调用了super.clone的方法，此处clonex方法可以改成任意的名称，因为Cloneable接口是个空接口，你可以任意定义实现类的方法名，如cloneA或者cloneB，因为此处的重点是super.clone()这句话，super.clone()调用的是Object的clone()方法，而在Object类中，clone()是native的，浅复制。

## 深浅复制 ##

- 浅复制：将一个对象复制后，基本数据类型的变量都会重新创建，而引用类型，指向的还是原对象所指向的。

- 深复制：将一个对象复制后，不论是基本数据类型还有引用类型，都是重新创建的。简单来说，就是深复制进行了完全彻底的复制，而浅复制不彻底。

**要实现深复制，需要采用流的形式读入当前对象的二进制输入，再写出二进制数据对应的对象。**

下面是实现的深复制方法：

```java
/* 深复制 */  
public Object deepClone() throws IOException, ClassNotFoundException {  

    /* 写入当前对象的二进制流 */  
    ByteArrayOutputStream bos = new ByteArrayOutputStream();  
    ObjectOutputStream oos = new ObjectOutputStream(bos);  
    oos.writeObject(this);  

    /* 读出二进制流产生的新对象 */  
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());  
    ObjectInputStream ois = new ObjectInputStream(bis);  
    return ois.readObject();  
}
```
