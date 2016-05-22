title: VS连接Sql Server
date: 2016-05-18 16:59:35
tags: C#
categories: C#
---

最近在帮同学搞一个小项目时遇到的关于VS2013连接微软公司的DBS SqlServer遇到的问题，这里mark以下，防止以后遗忘。


当我尝试调试这个半成品的时候，出现了下面的问题。


上面提示VS在于SQL Server建立连接时出现了问题，无法正确找到服务器，所以与数据服务器建立连接也就无从谈起了。

在services.msc程序中确保SQL Server的支撑服务已经正常启动，再次尝试，依旧如此。
<!--more-->
![](\img\article\vs-ss.png)

在asp.net项目中的`Web.config`文件中：

```
<configuration>
  <appSettings>
    <add key="ConnectionString" value="workstation id=.;integrated security=SSPI;data source=MSSQLSERVER;initial catalog=BookShop"/>
  </appSettings>
  <connectionStrings>
    <add name="db_NetShopConnectionString1" connectionString="workstation id=.;integrated security=SSPI;data source=MSSQLSERVER;initial catalog=BookShop"
     providerName="System.Data.SqlClient" />
  </connectionStrings>
  <system.web>
    <compilation debug="true"/>
    <authentication mode="Forms"/>
  </system.web>
</configuration>
```

`integrated security`标准的值有3种：

- True的时候，连接语句前面的 UserID, PW 是不起作用的，即采用windows身份验证模式。

- False或省略该项的时候，按照 UserID, PW 来连接。

- sspi ，差不多相当于 True，建议用这个代替 True。


initial catalog与database在这个Web.config中的连接字符串中的作用是一致的。


一个一个排查下去，既然已经设置为windows身份验证模式不需要设置用户、密码，可以看到只剩下`data source`这个属性还没有排查。data source设置的值为SQL Server的实例名称，根据在论坛上搜索的信息，不同版本的SQL Server实例名有差别。

在SQL Server中新建查询
```
select @@SERVERNAME;
```

返回的结果一般是数据库实例名称，也是计算机名。但是更改代码之后，错误依旧。

之后依次根据服务中的SQL Server括号中实例名等等都无效。

最后在国外的论坛中找到结果：尝试使用(local)、127.0.0.1就可以正常使用。

```
string myStr = ConfigurationManager.AppSettings["ConnectionString"].ToString();
SqlConnection myConn = new SqlConnection(myStr);
```
