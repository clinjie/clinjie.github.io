title: sql复习
date: 2018-04-01 18:18:15
tags: SQL
categories: 面试
---

# SQL


数据查询语言：select、where、order by、group by、having

数据操作语言：insert、update、delete

事务语言：begin transaction、commit、rollback

数据定义语言：create table、drop table；为表加入索引


数据类型：字符型、文本型、数值型、逻辑型、日期型

字符型：varchar占用少内存、硬盘；不会多出来多余的后面的空格；存储小于255字符

文本型：可存放超过20亿字符的串；尽量避免使用；即时是空值，也会分配2K空间

数值型：int、numeric（范围最大）、money钱数

<!--more-->

逻辑型：bit

日期型：datetime范围大，且精确到毫秒；smalldatatime范围小，精确到秒



## 语法

SELECT - 从数据库中提取数据
UPDATE - 更新数据库中的数据
DELETE - 从数据库中删除数据
INSERT INTO - 向数据库中插入新数据
CREATE DATABASE - 创建新数据库
ALTER DATABASE - 修改数据库
CREATE TABLE - 创建新表
ALTER TABLE - 变更（改变）数据库表
DROP TABLE - 删除表
CREATE INDEX - 创建索引（搜索键）
DROP INDEX - 删除索引

```sql
#结合where条件差查询
SELECT [*] FROM [TableName] WHERE [condition1]
#子条件查询
SELECT [*] FROM [TableName] WHERE [condition1] [AND [OR]] [condition2]...
#排序后查询
SELECT column_name() FROM table_name ORDER BY column_name() ASC or DESC
#对某表插入数据
INSERT INTO table_name (column, column1, column2, column3, ...) VALUES (value, value1, value2, value3 ...)
#更新数据
UPDATE table_name SET column=value, column1=value1,... WHERE someColumn=someValue
#删除数据
DELETE FROM tableName WHERE someColumn = someValue
```


选择属性不同的值：select distinct

`select distinct column1,column2,... from table;`

SQL在文本周围使用单引号；大部分也接受双引号；
数值字段不使用引号


### where运算符

```
=	等于
<>	不等于。 注意：在某些版本的SQL中，这个操作符可能写成！=
>	大于
<	小于
>=	大于等于
<=	小于等于
BETWEEN	在某个范围内
LIKE	搜索某种模式
IN	为列指定多个可能的值
```

###条件过滤

and、or、not

```
SELECT * FROM Customers WHERE NOT Country='Germany' AND NOT Country='USA';
SELECT * FROM Customers WHERE Country='Germany' AND (City='Berlin' OR City='München');
```

### 排序

order by| asc/desc

```
SELECT * FROM Customers ORDER BY Country DESC;
```

多列：


```
SELECT * FROM Customers ORDER BY Country, CustomerName;
SELECT * FROM Customers ORDER BY Country ASC, CustomerName DESC;

```

### 插入

自动递增字段不需要插入，会自动生成

如果要为表中的所有列添加值，则不需要在SQL查询中指定列名称。但是，请确保值的顺序与表中的列顺序相同


```sql
INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3,
...);

INSERT INTO table_name VALUES (value1, value2, value3, ...);
```



### NULL

NULL 用于表示缺失的值。数据表中的 NULL 值表示该值所处的字段为空。

如果表中的字段是可选的，则可以插入新记录或更新记录而不向该字段添加值。然后，该字段将被保存为NULL值。

```
SELECT column_names FROM table_name WHERE column_name IS NULL;
SELECT column_names FROM table_name WHERE column_name IS NOT NULL;
```

### UPDATE

```sql
UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE condition;
```

省略where会更新表中所有行的*数据


## DELETE

```sql
DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';
```

删除所有数据：

```sql
delete from table;
delete * from table;
```

### TOP

```sql
#mysql
SELECT * FROM Persons LIMIT 5;
#sql
SELECT TOP 2 * FROM Customers;
```

选择前5个返回

### Like

在WHERE子句中使用LIKE运算符来搜索列中的指定模式。

％ - 百分号表示零个，一个或多个字符
_ - 下划线表示单个字符

![](http://opu8lkq3n.bkt.clouddn.com/18-4-20/28491796.jpg)

```sql
#选择客户名称在第二位具有“r”的所有客户：
SELECT * FROM Customers WHERE CustomerName LIKE '_r%';
```

- [charlist] 通配符

```sql
#所有客户City以"b"、"s"或"p"开头：
SELECT * FROM Customers  WHERE City LIKE '[bsp]%';
#以a/b/c开头
SELECT * FROM Customers  WHERE City LIKE '[a-c]%';
#所有客户City不以"b"、"s"或"p"开头：
SELECT * FROM Customers  WHERE City LIKE '[!bsp]%';
SELECT * FROM Customers WHERE City NOT LIKE '[bsp]%';
```

### in

```sql
SELECT * FROM Customers WHERE Country IN ('Germany', 'France', 'UK');
SELECT * FROM Customers WHERE Country NOT IN ('Germany', 'France', 'UK');
SELECT * FROM Customers WHERE Country IN (SELECT Country FROM Suppliers);
```

### Between

BETWEEN 操作符用于选取介于两个值之间的数据范围内的值。

```sql
SELECT * FROM Products WHERE Price BETWEEN 10 AND 20;
SELECT * FROM Products WHERE Price NOT BETWEEN 10 AND 20;

SELECT * FROM Products WHERE (Price BETWEEN 10 AND 20) AND NOT CategoryID IN (1,2,3);

SELECT * FROM Products WHERE ProductName BETWEEN 'Carnarvon Tigers' AND 'Mozzarella di Giovanni' ORDER BY ProductName;
```


### 一些操作

alter

```
ALTER TABLE table_name  ADD column_name datatype

ALTER TABLE table_name  DROP COLUMN column_name
```

as别名

```
SELECT column_name AS column_alias FROM table_name

SELECT column_name FROM table_name AS table_alias
```

create

```sql
CREATE DATABASE database_name;

CREATE TABLE table_name
(column_name1 data_type,
column_name2 data_type,
column_name2 data_type,
...)


CREATE INDEX index_name
ON table_name (column_name)

CREATE UNIQUE INDEX index_name
ON table_name (column_name)
```


view

```
CREATE VIEW view_name AS SELECT column_name(s) FROM table_name WHERE condition
```

drop

```
DROP DATABASE database_name
DROP INDEX index_name
DROP TABLE table_name
```

group by

```
SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name

#统计男女的数量
SELECT sex, count(sex) FROM table_name WHERE sex in ('man','woman') GROUP BY sex


SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
ORDER BY COUNT(CustomerID) DESC;
```

`aggregate_function`是sum、min之类的


having

```sql
SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name HAVING aggregate_function(column_name) operator value
```

join


INNER JOIN：如果表中有至少一个匹配，则返回行。从多个表中返回满足 JOIN 条件的所有行。如果表中有一个匹配项，INNER JOIN 关键字将返回一行。如果on的条件不匹配不返回

```
select orders.orderid,customers.customerName,orders.orderDate from orders inner join customers on customers.customerid=orders.customerid

#三张表inner join
select orders.orderid,customers.customerName,shippers.shippername from (orders inner join customers on orders.customerid=customers,customerid) inner join shippers on orders.shipperid=shippers.shipperid
```

LEFT JOIN：即使右表中没有匹配，也从左表返回所有的行。如果不匹配，对应的结果是NULL

结果集尺寸在左表尺寸

```sql
SELECT column_name(s) FROM table_name1 LEFT JOIN table_name2  ON table_name1.column_name=table_name2.column_name
```

RIGHT JOIN：即使左表中没有匹配，也从右表返回所有的行。结果集尺寸在右表尺寸

FULL JOIN：只要其中一个表中存在匹配，则返回左右所有的记录，是非常大的结果集。没有匹配一行的话，结果集不返回；只有出现一行匹配，就返回会所有。假设匹配了k行，结果集尺寸为左表尺寸+右表尺寸-k

![](http://opu8lkq3n.bkt.clouddn.com/18-4-20/31840677.jpg)


```sql
SELECT column_name(s) FROM table_name1 RIGHT JOIN table_name2  ON table_name1.column_name=table_name2.column_name

SELECT column_name(s) FROM table_name1 FULL JOIN table_name2  ON table_name1.column_name=table_name2.column_name
```

select into

```sql
#根据查询创建新表
SELECT * INTO new_table_name [IN externaldatabase] FROM old_table_name

SELECT column_name(s) INTO new_table_name [IN externaldatabase] FROM old_table_name
```

union


UNION中的每个SELECT语句必须具有相同的列数
这些列也必须具有相似的数据类型
每个SELECT语句中的列也必须以相同的顺序排列


union选择的是不同的值；union all选择的可以是重复值；

```sql
SELECT column_name(s) FROM table_name1 UNION SELECT column_name(s) FROM table_name2

SELECT column_name(s) FROM table_name1 UNION ALL SELECT column_name(s) FROM table_name2
```

 自连接



匹配来自同一城市的客户
```sql
SELECT A.CustomerName AS CustomerName1, B.CustomerName AS CustomerName2, A.City
FROM Customers A, Customers B
WHERE A.CustomerID <> B.CustomerID
AND A.City = B.City
ORDER BY A.City;
```


insert into

```
INSERT INTO Customers (CustomerName, Country)
SELECT SupplierName, Country FROM Suppliers;
```


## 约束

约束是作用于数据表中列上的规则，用于限制表中数据的类型。约束的存在保证了数据库中数据的精确性和可靠性。

约束有列级和表级之分，列级约束作用于单一的列，而表级约束作用于整张数据表。

NOT NULL 约束：保证列中数据不能有 NULL 值
DEFAULT 约束：提供该列数据未指定时所采用的默认值
UNIQUE 约束：保证列中的所有数据各不相同
主键约束：唯一标识数据表中的行/记录
外键约束：唯一标识其他表中的一条行/记录
CHECK 约束：此约束保证列中的所有值满足某一条件
索引：用于在数据库中快速创建或检索数据

约束可以在创建表时规定（通过 CREATE TABLE 语句），或者在表创建之后规定（通过 ALTER TABLE 语句）。

```python
CREATE TABLE Persons

(

P_Id int NOT NULL,

LastName varchar(255) NOT NULL,

FirstName varchar(255),

Address varchar(255),

City varchar(255)

)
```

UNIQUE 和 PRIMARY KEY 约束均为列或列集合提供了唯一性的保证。

PRIMARY KEY 约束拥有自动定义的 UNIQUE 约束。

请注意，每个表可以有多个 UNIQUE 约束，但是每个表只能有一个 PRIMARY KEY 约束。

```

CREATE TABLE Persons

(

P_Id int NOT NULL,

LastName varchar(255) NOT NULL,


UNIQUE (P_Id)

)

ALTER TABLE Persons ADD UNIQUE (P_Id)

ALTER TABLE Persons DROP INDEX uc_PersonID
```

主键：

```
PRIMARY KEY (P_Id)

CONSTRAINT pk_PersonID PRIMARY KEY (P_Id,LastName)

ALTER TABLE Persons ADD CONSTRAINT pk_PersonID PRIMARY KEY (P_Id,LastName)

ALTER TABLE Persons ADD PRIMARY KEY (P_Id)
```


一个表中的 FOREIGN KEY 指向另一个表中的 PRIMARY KEY。


`FOREIGN KEY (P_Id) REFERENCES Persons(P_Id)`

`CONSTRAINT fk_PerOrders FOREIGN KEY (P_Id) REFERENCES Persons(P_Id)`


`CONSTRAINT chk_Person CHECK (P_Id>0 AND City='Sandnes')`

## 克隆表

1. `SHOW CREATE TABLE tb_name`
2. 返回的结果，表名修改为新表，执行
3. `INSERT INTO new_tb... SELECT`

## 索引

索引能够提高 SELECT 查询和 WHERE 子句的速度，但是却降低了包含 UPDATE 语句或 INSERT 语句的数据输入过程的速度。索引的创建与删除不会对表中的数据产生影响。


`CREATE INDEX index_name ON table_name;`

单列：

`CREATE INDEX index_name ON table_name (column_name);`

唯一索引：

唯一索引不止用于提升查询性能，还用于保证数据完整性。唯一索引不允许向表中插入任何重复值。其基本语法如下所示：

`CREATE UNIQUE INDEX index_name on table_name (column_name);`


聚簇索引：

聚簇索引在表中两个或更多的列的基础上建立。其基本语法如下所示：

`CREATE INDEX index_name on table_name (column1, column2);`

创建单列索引还是聚簇索引，要看每次查询中，哪些列在作为过滤条件的 WHERE 子句中最常出现。

如果只需要一列，那么就应当创建单列索引。如果作为过滤条件的 WHERE 子句用到了两个或者更多的列，那么聚簇索引就是最好的选择。

**隐式索引由数据库服务器在创建某些对象的时候自动生成。例如，对于主键约束和唯一约束，数据库服务器就会自动创建索引。**


小的数据表不应当使用索引；
需要频繁进行大批量的更新或者插入操作的表；
如果列中包含大数或者 NULL 值，不宜创建索引；
频繁操作的列不宜创建索引。

## 子查询

```sql

SELECT *
     FROM CUSTOMERS
     WHERE ID IN (SELECT ID
                  FROM CUSTOMERS
                  WHERE SALARY > 4500) ;

INSERT INTO CUSTOMERS_BKP
     SELECT * FROM CUSTOMERS
     WHERE ID IN (SELECT ID
                  FROM CUSTOMERS) ;

UPDATE CUSTOMERS
     SET SALARY = SALARY * 0.25
     WHERE AGE IN (SELECT AGE FROM CUSTOMERS_BKP
                   WHERE AGE >= 27 );

DELETE FROM CUSTOMERS
     WHERE AGE IN (SELECT AGE FROM CUSTOMERS_BKP
                   WHERE AGE > 27 );
```

## ALTER

 ALTER TABLE 命令用于添加、删除或者更改现有数据表中的列。

你还可以用 ALTER TABLE 命令来添加或者删除现有数据表上的约束。

```
ALTER TABLE CUSTOMERS ADD SEX char(1);

ALTER TABLE CUSTOMERS DROP SEX;
```

## TRUNCATE

可以使用 DROP TABLE 命令来删除整个数据表，不过 DROP TABLE 命令不但会删除表中所有数据，还会将整个表结构从数据库中移除。如果想要重新向表中存储数据的话，必须重建该数据表。

TRUNCATE TABLE 命令用于删除现有数据表中的所有数据。

`TRUNCATE TABLE  table_name;`


## View

```
CREATE VIEW view_name AS
SELECT column1, column2.....
FROM table_name
WHERE [condition];


CREATE VIEW CUSTOMERS_VIEW AS
SELECT name, age
FROM  CUSTOMERS;
```



WITH CHECK OPTION 是 CREATE VIEW 语句的一个可选项。WITH CHECK OPTION 用于保证所有的 UPDATE 和 INSERT 语句都满足视图定义中的条件。

如果不能满足这些条件，UPDATE 或 INSERT 就会返回错误。

```sql
CREATE VIEW CUSTOMERS_VIEW AS
SELECT name, age
FROM  CUSTOMERS
WHERE age IS NOT NULL
WITH CHECK OPTION;
```

这里 WITH CHECK OPTION 使得视图拒绝任何 AGE 字段为 NULL 的条目，因为视图的定义中，AGE 字段不能为空。

视图更新：

select字句不包含distinct、汇总函数、集合函数、集合运算、order by、子查询、group by、having；所有列都是not null

```
UPDATE CUSTOMERS_VIEW
      SET AGE = 35
      WHERE name='Ramesh';
```

## having字句


HAVING 子句使你能够指定过滤条件，从而**控制查询结果中哪些组**可以出现在最终结果里面。

WHERE 子句对被选择的列施加条件，而 HAVING 子句则对 **GROUP BY** 子句所产生的组施加条件。

```
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
```

选择某个年龄段，这个年龄的人数》=2

```
SELECT ID, NAME, AGE, ADDRESS, SALARY
FROM CUSTOMERS
GROUP BY age
HAVING COUNT(age) >= 2;
```

## 事务

事务具有以下四个标准属性，通常用缩略词 ACID 来表示：

原子性：保证任务中的所有操作都执行完毕；否则，事务会在出现错误时终止，并回滚之前所有操作到原始状态。
一致性：如果事务成功执行，则数据库的状态得到了进行了正确的转变。
隔离性：保证不同的事务相互独立、透明地执行。
持久性：即使出现系统故障，之前成功执行的事务的结果也会持久存在。

```
COMMIT：提交更改；
ROLLBACK：回滚更改；
SAVEPOINT：在事务内部创建一系列可以 ROLLBACK 的还原点；
SET TRANSACTION：命名事务；
```

```
SAVEPOINT SP1;
...
...
ROLLBACK TO SP1;
RELEASE SAVEPOINT SP1
```

SET TRANSACTION 命令：

```
SET TRANSACTION [ READ WRITE | READ ONLY ];
```

**临时表有时候对于保存临时数据非常有用。有关临时表你需要知道的最重要的一点是，它们会在当前的终端会话结束后被删除。**

## Mysql数据类型

TEXT	存放最大长度为 65,535 个字符的字符串。2^16
BLOB	用于 BLOBs（Binary Large OBjects）。存放最多 65,535 字节的数据。二进制

MEDIUMTEXT 2^24
MEDIUMBLOB

LONGTEXT 2^32
LONGBLOB

## 函数

MAX() 函数返回所选列的最大值。

```
SELECT MAX(column_name)
FROM table_name
WHERE condition;
```

MIN()函数


COUNT() 函数返回符合指定条件的行数。


AVG() 函数返回**数字列**的平均值。

SUM() 函数返回数字列的总和。

FIRST() - 函数返回指定的列中最后一个记录的值。
LAST() - 函数返回指定的列中第一个记录的值。

FIELD()函数：

类似find函数，返回index

```
SELECT FIELD('ej', 'Hej', 'ej', 'Heja', 'hej', 'foo');
```

在`['Hej', 'ej', 'Heja', 'hej', 'foo']`中查找`ej`，得到结果2（初始index=1），没有找到就返回0


字符串函数：

LOWER(s)或者LCASE(s)函数可以将字符串s中的字母字符全部转换成小写字母。
UPPER(s)或UCASE(s)函数可以将字符串s中的字母字符全部转换成大写字母。


MID函数

```
SELECT MID(City,1,4) AS ShortCity
FROM Customers;
```

返回的city，只取前4个字符

ROUND函数

函数用于把数值字段舍入为指定的小数位数。

```
SELECT ROUND(column_name,decimals) FROM table_name;
decimals	必需。规定要返回的小数位数。可以为0
```

FORMAT函数

```
SELECT ProductName, Price, FORMAT(Now(),'YYYY-MM-DD') AS PerDate
FROM Products;
```

sqrt平方根
rand()返回0-1随机数
concat字符串连接

Replace字符串替换

```
update `article` set title=replace(title,'w3cschool','hello');
```



## Mysql面试题

### 索引

组合索引：为了更多的提高mysql效率可建立组合索引，遵循”最左前缀“原则。创建复合索引时应该将最常用（频率）作限制条件的列放在最左边，依次递减。

唯一索引允许空值


全文索引：仅可用于 MyISAM 表，针对较大的数据，生成全文索引很耗时好空间。


为了更多的提高mysql效率可建立组合索引，遵循”最左前缀“原则。创建**复合索引**时应该将最常用（频率）作限制条件的列放在最左边，依次递减。


hsah索引把数据的索引以hash形式组织起来，因此当查找某一条记录的时候,速度非常快。当时因为是hash结构，每个键只对应一个值，而且是散列的方式分布。所以他并不支持范围查找和排序等功能。


B+tree是mysql使用最频繁的一个索引数据结构，是Inodb和Myisam存储引擎模式的索引类型。相对Hash索引，B+树在查找单条记录的速度比不上Hash索引，但是因为更适合排序等操作，所以他更受用户的欢迎。毕竟不可能只对数据库进行单条记录的操作。

### InnoDB/MYISAM


1>.InnoDB支持事物，而MyISAM不支持事物

2>.InnoDB支持行级锁，而MyISAM支持表级锁

3>.InnoDB支持MVCC, 而MyISAM不支持

4>.InnoDB支持外键，而MyISAM不支持

5>.InnoDB不支持全文索引，而MyISAM支持。

 InnoDB支持事务，MyISAM不支持，对于InnoDB每一条SQL语言都默认封装成事务，自动提交，这样会影响速度，所以最好把多条SQL语言放在begin和commit之间，组成一个事务；

InnoDB支持外键，对一个包含外键的InnoDB表转为MYISAM会失败

Innodb不支持全文索引，而MyISAM支持全文索引，查询效率上MyISAM要高；

InnoDB是聚集索引，数据文件是和索引绑在一起的，必须要有主键，通过主键索引效率很高。但是辅助索引需要两次查询，先查询到主键，然后再通过主键查询到数据。因此，主键不应该过大，因为主键太大，其他索引也都会很大。而MyISAM是非聚集索引，数据文件是分离的，索引保存的是数据文件的指针。主键索引和辅助索引是独立的。


myisam引擎,记录数count是结构的一部分,已经cache在内存中了,很快就可以得到结构,而innodb仍然需要计算,id如果是主键索引的话,无疑会加快速度;

是否要支持事务，如果要请选择innodb，如果不需要可以考虑MyISAM；
如果表中绝大多数都只是读查询，可以考虑MyISAM，如果既有读写也挺频繁，请使用InnoDB。

### 其他

drop、delete、truncate区别

 TRUNCATE 和DELETE只删除数据，而DROP则删除整个表（结构和数据）。

 delete语句为DML（data maintain Language),这个操作会被放到 rollback segment中,事务提交后才生效。如果有相应的 tigger,执行的时候将被触发。

 truncate、drop是DLL（data define language),操作立即生效，原数据不放到 rollback segment中，不能回滚


视图不能被索引，也不能有关联的触发器或默认值


1）应尽量避免在 where 子句中使用!=或<>操作符，否则将引擎放弃使用索引而进行全表扫描。
2）应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：
select id from t where num is null
可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：
select id from t where num=0
3）很多时候用 exists 代替 in 是一个好的选择
4）用Where子句替换HAVING 子句 因为HAVING 只会在检索出所有记录之后才对结果集进行过滤



会员备注信息 ， 如果需要建索引的话，可以选择 FULLTEXT，全文搜索。

不过 FULLTEXT 用于搜索很长一篇文章的时候，效果最好。
用在比较短的文本，如果就一两行字的，普通的 INDEX 也可以。

全文检索的索引被称为倒排索引，之所以成为倒排索引，是因为将每一个单词作为索引项，根据该索引项查找包含该单词的文本。因此，索引都是单词和唯一记录文本的标示是一对多的关系。将索引单词排序，根据排序后的单词定位包含该单词的文本。


### explain

在查询语句前加expalin；

```
explain SELECT MID(City,1,4) AS ShortCity
FROM Customers where length(City)>3 UNION SELECT MID(City,0,4) AS ShortCity
FROM Customers where length(City)<4;
```

![](http://opu8lkq3n.bkt.clouddn.com/18-4-20/32620040.jpg)


d是一组数字，表示查询中执行select子句或操作表的顺序。

selecttype有simple，primary，subquery，derived(衍生)，union，unionresult。

type叫访问类型，表示在表中找到所需行的方式，常见类型有all，index，range，ref，eq_ref，const，system，NULL 性能从做至右由差至好。

possiblekey表示能使用哪个索引在表中找到行，查询涉及到的字段上若存在索引，则该索引被列出，但不一定被查询使用。

key表示查询时使用的索引。若查询中使用了覆盖索引，则该索引仅出现在key

keylen表示索引所使用的字节数，可以通过该列结算查询中使用的索引长度


### 其他

MySQL数据库cpu飙升到500%的话他怎么处理

列出所有进程  show processlist  观察所有进程  多秒没有状态变化的(干掉)
查看超时日志或者错误日志 (做了几年开发,一般会是查询以及大批量的插入会导致cpu与i/o上涨,,,,当然不排除网络状态突然断了,,导致一个请求服务器只接受到一半，比如where子句或分页子句没有发送,,当然的一次被坑经历)

备份恢复时间：

20G的2分钟（mysqldump）
80G的30分钟(mysqldump)
111G的30分钟（mysqldump)
288G的3小时（xtra)
3T的4小时（xtra)

主从一致性校验有多种工具 例如checksum、mysqldiff、pt-table-checksum等
