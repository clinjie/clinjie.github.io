title: Android之Context、this
date: 2016-04-07 14:17:22
tags: Android
categories: Android
---

# Context #

context不是函数而是一个类。如果不太了解面向对象，可以把“类”看做一种数据类型，就像int，不过类型为“类”的数据（称为对象）可能储存远比int多的信息，比如这里的类型为Context的对象就储存关于程序、窗口的一些资源。
 
有些函数调用时需要一个Context参数，比如Toast.makeText，因为函数需要知道是在哪个界面中显示的Toast。
<!--more-->
再比如，ButtonmyButton = new Button(this); 这里也需要Context参数（this），表示这个按钮是在“this”这个屏幕中显示的。
 
Android开发使用（纯粹的）面向对象语言，一切都是对象，就连我们写的函数都是对象的函数。


# 小例 #

```java
public class MainActivity extends Activity{
 
   @Override
 
   public void onCreate(Bundle savedInstanceState) {
 
 
 
       super.onCreate(savedInstanceState);
 
       setContentView(R.layout.activity_main);
 
       Toast.makeText(this,
 
                "OK!",
 
                Toast.LENGTH_LONG).show();
 
       Button button1 = (Button)findViewById(R.id.button1);
 
       button1.setOnClickListener(new Button.OnClickListener(){
 
           public void onClick(View v)
 
           {
 
               Toast.makeText(MainActivity.this,
 
                        "Hello, world!",
 
                       Toast.LENGTH_LONG).show();
 
           }
 
       });
 
    }
 
}
```

这里OnCreate就是MainActivity的对象的函数（MainActivity是类），所以这个函数中的this就表示当前的、包含这个函数的MainActivity对象。
 
MainActivity extends Activity，意思是MainActivity 继承 Activity，即MainActivity 是 Activity 的一种，所有的MainActivity 都是 Activity。同样，在Android文档中Activity继承ContextThemeWrapper，ContextThemeWrapper继承ContextWrapper，ContextWrapper继承Context。所以this这个MainActivity也是Context，把this传入Toast.makeText表示“OK!”是在当前的MainActivity对象（也是Context）中显示的。
 
对于显示"Hello,world!"的Toast.makeText，这个函数在onClick中，而onClick是new Button.OnClickListener(){...}这个没有名字的类的函数，this表示匿名类的对象，不表示MainActivity对象，所以这里用MainActivity.this，强制选择外面一层MainActivity的this。
在activity和 service中使用的this，的确可以代替context，因为activity和service本身就是继承于context类的，也就是说，那里面的this，就是一个context。


再来说上面这个context为什么不能用。因为toast是一个view，每一个view被添加的时候都需要一个token，activity中的context就包含了当前activity窗口的token，所以能够使用，而onReceive中的context，并不是隶属于某个应用程序进程的，而是属于系统的context，所以这里会报错。

将this替换成为context是因为此类继承自BroadcastReceiver，并非继承自Activity.

activity继承自context,activity.this可以当做一个context。而BroadcastReceiver直接继承自Object，它的this不再属于context，不能当做上下文，成为函数的参数


# Context的类型 #

应用程序创建Context实例的情况有如下几种情况：

- 创建Application 对象时， 而且整个App共一个Application对象

- 创建Service对象时

- 创建Activity对象时

因此应用程序App共有的Context数目公式为：

 
总Context实例个数 = Service个数 + Activity个数 + 1（Application对应的Context实例）


并不是所有的context实例都是等价的。根据Android应用的组件不同，你访问的context推向有些细微的差别。

- Application

是一个运行在你的应用进程中的单例。在Activity或者Service中，它可以通过getApplication()函数获得，或者人和继承于context的对象中，通过getApplicationContext()方法获得。不管你是通过何种方法在哪里获得的，在一个进程内，你总是获得到同一个实例。
- Activity/Service

继承于ContextWrapper，它实现了与context同样API，但是代理这些方法调用到内部隐藏的Context实例，即我们所知道的基础context。任何时候当系统创建一个新的Activity或者Service实例的时候，它也创建一个新的ContextImpl实例来做所有的繁重的工作。每一个Activity和Service以及其对应的基础context，对每个实例来说都是唯一的。

- BroadcastReciver

它本身不是context，也没有context在它里面，但是每当一个新的广播到达的时候，框架都传递一个context对象到onReceive()。这个context是一个ReceiverRestrictedContext实例，它有两个主要函数被禁掉：registerReceiver()和bindService()。这两个函数在BroadcastReceiver.onReceive()不允许调用。每次Receiver处理一个广播，传递进来的context都是一个新的实例。
- ContentProvider

它本身也不是一个Context，但是它可以通过getContext()函数给你一个Context对象。如果ContentProvider是在调用者的的本地（例如，在同一个应用进程），getContext()将返回的是Application单例。然而，如果调用这和ContentProvider在不同的进程的时候，它将返回一个新创建的实例代表这个Provider所运行的包。

