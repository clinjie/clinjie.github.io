title: Android中SQLite基础操作
date: 2016-05-20 16:59:35
tags: android
categories: adnroid
---

记录基本的android使用SQLite方法：


目前比较主流的方法是，使用继承自`SQLiteOpenHelper`类的对象创建数据库并管理数据库版本。

当创建实例之后，除了自动运行构造函数，这个继承自`SQLiteOpenHelper`的类还会自动调用onCreate方法。

```java
public void onCreate(SQLiteDatabase db) {
        db.execSQL("create table if not exists tb_user" +
                "(_id integer primary key autoincrement," +
                "username varchar(20)," +
                "password varchar(20))");
        db.execSQL("create table if not exists tb_userInfo" +
                "(_id integer primary key autoincrement," +
                "username varchar(20)," +
                "suggestions text)");
        db.execSQL("insert into tb_user(username, password) values('chuangwailinjie', '123456')");
        db.execSQL("insert into tb_user(username, password) values('peihao', '1234567')");
    }
```

<!--more-->

通过SQLiteDatabase对象可以直接执行相应的SQL语句。上面的例子就是创建了两个表，同时在表tb_user中插入了两条信息。


- 对SQLite数据库的读操作：

```java
dbhelper= new DbHelper(serInfo.this, "userInfo",null,1);
SQLiteDatabase db=dbhelper.getReadableDatabase();
Cursor cursor = db.rawQuery("select suggestions from tb_userInfo WHERE username=?",new String[]{username});
if (cursor.moveToFirst() == false){
    //为空的Cursor  也就是没有返回结果，找不到
    tv_suggestions.setText("undefined");
}
else{
    cursor.moveToFirst();
    tv_suggestions.setText(cursor.getString(0));
    cursor.close();
}
db.close();
```


- 对SQLite数据库的写操作：

```java
SQLiteDatabase Db=dbhelper.getWritableDatabase();
Db.execSQL("insert into tb_user(username, password) values(?,?)", new Object[]{name,password });
Db.close();
```