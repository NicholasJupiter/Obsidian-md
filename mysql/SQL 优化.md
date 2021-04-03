# 查询SQL 语句使用频率
1. `show status like 'Com_______';`： 查询当前session(会话)中使用SQL的频次 
2. `show global status like 'Com_______'`：查询全局使用SQL的频次
3. `show global status like 'Innodb_rows_%'`：查询Innodb引擎使用的SQL频次

# 定位低效率SQL语句
可以通过以下两种方式定位执行效率较低的SQL语句。
1. 慢查询日志：通过慢查询日志定位那些执行效率较低的SQL语句，用`--log-slow-queries[=file_name]`选项启动时，mysqld写一个包括所有执行超过`long_query_time`秒的SQL语句的日志文件。具体可以查看日志管理部分。
2. `show processlist`：慢查询日志在查询结束以后才记录，所有在应用反应执行效率出现问题的时候查询慢日志并不能定位问题，可以使用`show processlist` 命令查看当前MySQL的进行线程，包括线程的状态，是否锁表等，可以实时的查看SQL的执行情况，同时对一些锁表操作进行优化。

![[Pasted image 20210321134251.png]]
> Id列，用户登录时，系统分配的"connection_id"，可以使用函数connection_id()查看
> User列，显示当前用户。如果不是root，这个命令只显示用户权限范围的sql语句
> Host列，显示这个语句是从哪个ip的哪个端口上发的，可以用来跟踪出现问题语句的用户
> db列，显示当前连接的是哪个数据库
> command列，显示当前连接执行的命令，一般取值为休眠（sleep），查询（query），连接（connect）等
> time列，显示这个状态的持续时间，单位是秒。
> state列，显示当前连接sql语句的状态，很重要的列。state描述的是语句执行中的某一个状态。一个sql语句，以查询为例，可能需要经过copying to tmp table、sorting result、sending data等状态才可以完成

# explain 分析执行计划
通过以上步骤查询到效率较低的sql语句后，可以通过`explain`或者`desc`命令获取MySQL如何执行`select`语句的信息，包括在`select`语句执行过程中表如何连接和连接的顺序。
查询sql语句的执行计划：
```sql
  explain select * from table_name where ....;
```
![[Pasted image 20210321141636.png]]

字段|含义
-----|---
id|select 查询的序列号，是一组数字，表示的是查询中执行select子句或者操作表的顺序。
select_type| 表示select的类型，常见的取值有SIMPLE（简单表，即不使用表连接或者子查询）、PRIMARY（主查询，即外层的查询）、UNION（UNION中的第二个或者后面的查询语句）、SUBQUERY（子查询中的第一个select）等
table|输出的结果集的表
type|表示表的连接类型，性能由好到差为（system -> const -> eq_ref -> ref -> ref_or_null -> index_merge -> index_subquery -> range -> index -> all）
possible_keys| 表示查询时，可能使用的索引
key|表示实际使用的索引
key_len|索引字段的长度
rows|扫描行的数量
extra|执行情况和描述

# 导入大批量数据
`.log`文件
**使用 Load data**

```sql
load data local(表示本地) infile '/root/sql1.log'(地址) into `table_name` fields terminated by ',' lines terminated by '
\n' 
```
- `fields terminated by ','`：意思是字段根据`,`分割开来
- `lines terminated by '\n'`：意思是行根据`\n`分割开来


# 优化 Insert 语句
**语句合并提交**
```sql
insert into table_name values (value...), (value...) ,(value...);
```

**使用事务添加**
```sql
start transaction;
  insert into table_name values (value...), (value...) ,(value...);
commit;
```


