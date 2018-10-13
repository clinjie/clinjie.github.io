title: Java单例模式
date: 2016-10-04 19:12:37
tags: java
categories: java
---

# 单例模式 #

单例对象（Singleton）是一种常用的设计模式。在Java应用中，单例对象能保证在一个JVM中，该对象只有一个实例存在。这样的模式有几个好处：

1. 某些类创建比较频繁，对于一些大型的对象，这是一笔很大的系统开销。

2. 省去了new操作符，降低了系统内存的使用频率，减轻GC压力。

3. 有些类如交易所的核心交易引擎，控制着交易流程，如果该类可以创建多个的话，系统完全乱了。（比如一个军队出现了多个司令员同时指挥，肯定会乱成一团），所以只有使用单例模式，才能保证核心交易服务器独立控制整个流程。


## 单例模式的特点 ##

----------
- 单例类只能有一个实例。

- 单例类必须自己创建自己的唯一实例。
<!--more-->
- 单例类必须给所有其他对象提供这一实例。

单例模式确保某个类只有一个实例，而且自行实例化并向整个系统提供这个实例。在计算机系统中，线程池、缓存、日志对象、对话框、打印机、显卡的驱动程序对象常被设计成单例。这些应用都或多或少具有资源管理器的功能。每台计算机可以有若干个打印机，但只能有一个Printer Spooler，以避免两个打印作业同时输出到打印机中。每台计算机可以有若干通信端口，系统应当集中管理这些通信端口，以避免一个通信端口同时被两个请求同时调用。总之，选择单例模式就是为了避免不一致状态，避免政出多头。


## 懒汉式单线程模式 ##

```java
//懒汉式单例类.在第一次调用的时候实例化自己   
public class Singleton {  
    private Singleton() {}  
    private static Singleton single=null;  
    //静态工厂方法   
    public static Singleton getInstance() {  
         if (single == null) {    
             single = new Singleton();  
         }    
        return single;  
    }  
} 
```

懒汉式单例模式在第一次调用定义的方法时返回实例化的对象，之后调用将会返回此前创造的实例。


Singleton通过将构造方法限定为private避免了类在外部被实例化，在同一个虚拟机范围内，Singleton的唯一实例只能通过getInstance()方法访问。

上面说过，懒汉式单例模式是线程不安全的，下面有3种方法适用于改造：

- 同步

```java
public static synchronized Singleton getInstance() {  
         if (single == null) {    
             single = new Singleton();  
         }    
        return single;  
} 
```

使用synchronized关键字之后，多个线程调用getInstance方法会多一层保障，确保程序最多有一个实例存在。


- 双重检查锁定

```java
public static Singleton getInstance() {  
        if (singleton == null) {    
            synchronized (Singleton.class) {    
               if (singleton == null) {    
                  singleton = new Singleton();   
               }    
            }    
        }    
        return singleton;   
    }  
```
这里进行了double的检测，一次是在同步块外，一次是在同步块内。为什么在同步块内还要再检验一次？因为可能会有多个线程一起进入同步块外的 if，如果在同步块内不进行二次检验的话就会生成多个实例了。

我们把注意力转到singleton = new Singleton()这句，这并非是一个原子操作，事实上在 JVM 中这句话大概做了下面 3 件事情。

1. 给 singleton 分配内存
2. 调用 Singleton 的构造函数来初始化成员变量
3. 将singleton对象指向分配的内存空间（执行完这步 singleton 就为非 null 了）

但是在 JVM 的即时编译器中存在指令重排序的优化。也就是说上面的第二步和第三步的顺序是不能保证的，最终的执行顺序可能是 1-2-3 也可能是 1-3-2。如果是后者，则在 3 执行完毕、2 未执行之前，被线程二抢占了，这时 instance 已经是非 null 了（但却没有初始化），所以线程二会直接返回 singleton，然后使用，然后顺理成章地报错。

此时我们只需要将 singleton 变量声明成 volatile 就可以了。

`private volatile static Singleton singleton;`

使用 volatile 的主要原因是其一个特性：禁止指令重排序优化。也就是说，在 volatile 变量的赋值操作后面会有一个内存屏障（生成的汇编代码上），读操作不会被重排序到内存屏障之前


- 静态内部类

```java
public class Singleton {    
    private static class LazyHolder {    
       private static final Singleton INSTANCE = new Singleton();    
    }    
    private Singleton (){}    
    public static final Singleton getInstance() {    
       return LazyHolder.INSTANCE;    
    }    
}
```

静态内部类的方法同时解决了线程安全以及synchronzied同步引出的性能影响。这种写法仍然使用JVM本身机制保证了线程安全问题；由于 SingletonHolder 是私有的，除了 getInstance() 之外没有办法访问它，因此它是懒汉式的；同时读取实例的时候不会进行同步，没有性能缺陷；也不依赖 JDK 版本。

## 饿汉式单例 ##

```java
//饿汉式单例类.在类初始化时，已经自行实例化   
public class Singleton1 {  
    private Singleton1() {}  
    private static final Singleton1 single = new Singleton1();  
    //静态工厂方法   
    public static Singleton1 getInstance() {  
        return single;  
    }  
} 
```

饿汉式单例直接在创建的时候就已经实例化了对象，同时将构造函数private，保证了线程安全以及实例的唯一性。


## 两类单例模式对比 ##

- 饿汉式

饿汉式单例在类加载过程中就已经创造好了对象的唯一实例，天生线程安全，但是无法类延迟加载。

- 懒汉式

懒汉式单例只有在第一次使用类的静态函数getInstance（或者其他定义的返回方法）才会创造唯一的实例。，原始的懒汉式单例是非线程安全的。

- 内部class

这种写法仍然使用JVM本身机制保证了线程安全问题；由于 SingletonHolder 是私有的，除了 getInstance() 之外没有办法访问它，因此它是懒汉式的；同时读取实例的时候不会进行同步，没有性能缺陷；也不依赖 JDK 版本。


## 线程安全 ##

如果你的代码所在的进程中有多个线程在同时运行，而这些线程可能会同时运行这段代码。如果每次运行结果和单线程运行的结果是一样的，而且其他的变量的值也和预期的是一样的，就是线程安全的。

或者说：一个类或者程序所提供的接口对于线程来说是原子操作，或者多个线程之间的切换不会导致该接口的执行结果存在二义性,也就是说我们不用考虑同步的问题，那就是线程安全的。