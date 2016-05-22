title: Android全局变量
date: 2016-05-21 16:59:35
tags: android
categories: adnroid
---

帮别人做一个小玩意儿时候遇到的问题，需要常常在不同activity、service之间传递一个数据变量。最前考虑的是入门时使用的`Bundle`对象。

>Bundle类用作携带数据，它类似于Map，用于存放key-value名值对形式的值。相对于Map，它提供了各种常用类型的putXxx()/getXxx()方法，如:
`putString()/getString()和putInt()/getInt()`，putXxx()用于往Bundle对象放入数据，getXxx()方法用于从Bundle对象里获取数据。Bundle的内部实际上是使用了HashMap类型的变量来存放putXxx()方法放入的值.

使用方法:

```java
Bundle bundle = new Bundle();
app.setB(name);
bundle.putString("username", name);
it.putExtra("bundle", bundle);
```
<!--more-->
在Activity跳转之前，将已经存储数据的Bundle对象绑定到Intent对象上，然后在跳转之后的Activity界面内：


```java
Intent intent = getIntent();
Bundle bundle = intent.getBundleExtra("bundle");
String name = bundle.getString("username");
```

获取存储的数据。


后来想到了应该会与全局的变量可以使用吧，毕竟Application域是在整个app运行间都在的。

- Step1

```java
public class applicationData extends Application {
    private String username;

    public String getB(){
        return this.username;
    }
    public void setB(String c){
        this.username= c;
    }
    @Override
    public void onCreate(){
        username = "undefined";
        super.onCreate();
    }
}
```

新建继承自Application类，然后根据自己需要存储获取的数据自行修改setter/getter方法。

- Step2

在程序清单`manifests`文件内，将`android:name`的值修改或增添为前面新建的继承Application的类名称：

```
<application
        android:name="applicationData"
```


- Step3


```java
applicationData app;
//直接从程序运行中获取Application实例，此时app会自动调用applicationData的onCreate函数
app=(applicationData)getApplication();
app.setB("input you will set");
String value=app.getB();
```