# MySQL存储过程和函数
## 存储过程和函数概述
$~~~~$存储过程和函数是 事先经过编译并存储在数据库中的一段sql语句的集合。调用存储过程和函数可以简化应用和开发人员很多工作，减少数据在数据库和应用服务器之间的传输和通讯次数，对于提高数据处理的效率是好处。

$~~~~$存储过程和函数的区别在于函数必须有返回值，而存储过程没有。
- 函数：是一个有返回值的过程。
- 过程：是一个没有返回值的过程。

## 创建存储过程
$~~~$ 语法
```sql
create procedure producure_name ([proc_parameter[,....]])
bengin
-- sql 语句
end;
```
$~~~$ 示例
```sql
delimiter $
create prodecure pro_test1()
begin
 select 'hello mysql';
end$
delimiter ;
```
>`delimiter`是把`;`分号分隔符声明成别的符号
>`delimiter $`就是把分隔符变为`$`

## 调用存储过程
$~~~$ 语法
```sql
call prodecure_name([params]);
```
$~~$ 示例
```sql
call pro_test1();
```

## 查询存储过程
```sql
# 查询mysql.proc表中的存储过程 ，筛选条件是数据库名称
# select name from mysql.proc where db = database_name;
select name from mysql.proc where db = 'demo_01';

# 查询存储过程的状态信息 可以使用where条件筛选
show procedure status;

# 查看存储过程创建时的代码信息
# show create procedure procedure_name;
show create procedure pro_test1;
```
## 删除存储过程
```sql
# drop  procedure procedure_name;
drop  procedure pro_test1;
```

## 语法
*代码只限于在begin..end之间*
### 变量
#### 声明变量
通过 declare 定义一个局部变量
```sql
# declare var_name[,...] type [default value];
declare num int default 10;
```
#### 赋值
通过`set`赋值
```sql
# set var_name = expr[,var_name = expr]...;
set num = num+10;
```
通过`select into`语法进行赋值
```sql
# select column_name into var_name from table_name;
select count(*) into num from city;
```
### IF条件判断
语法结构
```sql
if search_condition then statement_list
    [elseif search_condition then statement_list] ...
    [else statement_list]
end if;
```
> 条件
> 180 及以上 身材高挑
> 170 及以上 标准身材
> 其他 一般身材

```sql
delimiter $
create procedure pro_test4()
begin
  declare height int default 170;
  declare result varchar(50) default '一般身材';
  if height >= 180 then
    set result = '身材高挑';
  elseif height>=170 then
    set result = '标准身材';
	end if;
  select concat('身高',height,'身材比例：',result);
end$
delimiter ;
call pro_test4();
```

### 传递参数
```sql
create procedure procedure_name([in/on/inout] 参数名 参数类型)
....
```
`IN`：该参数作为输入参数，默认
`OUT`：该参数作为输出参数，也就是返回值
`INOUT`：该参数既是输入也是输出参数
#### IN - 输入
*根据传递的身高变量，进行判断*
```sql
delimiter $ 
create procedure pro_test4(in height int)
begin
  declare result varchar(50) default '一般身材';
  if height >= 180 then
    set result = '身材高挑';
  elseif height>=170 then
    set result = '标准身材';
	end if;
  select concat('身高',height,'身材比例：',result);
end$
delimiter ;
call pro_test4(180);
```
#### OUT - 输出
*根据传入的身高变量，输出得到身材结果*
```sql
drop procedure if exists pro_test4;
delimiter $
create procedure pro_test4(in height int, out description varchar(50))
begin
  if height >= 180 then
    set description = '身材高挑';
  elseif height>=170 then
    set description = '标准身材';
	else
		set description = '一般身材';
	end if;
end$
delimiter ;
# @符号开头代表的是会话变量
call pro_test4(150,@description);

select @description;
```
**知识点**
`@description`：@符号开头代表的是会话变量
`@@global.sort_buffer_size`：这种双@@符号开头是系统变量
### case 结构
**语法结构**
```sql
# 方式一
case case_value 
  when when_value then statement_list
  [when when_value then statement_list] ...
  [else statement_list]
end case;

# 方式二
case  
  when search_condition then statement_list
  [when search_condition then statement_list] ...
  [else statement_list]
end case;
```
**需求**
`给定一个月份，计算出所在的季度`
```sql
drop procedure if exists pro_test4;
delimiter $
create procedure pro_test4(mon int)
begin
  declare result varchar(50);
  case
   when mon >= 1 and mon <= 3 then
    set result = '第一季度';
   when mon >= 4 and mon <= 6 then
    set result = '第二季度';
   when mon >= 7 and mon <= 9 then
    set result = '第三季度';
   else
    set result = '第四季度';
	end case;
   select concat('传递的月份为：',mon,'计算出的结果为：',result) as context;
end $
delimiter ;
call pro_test4(4);
```
### while 循环
**语法结构**
```sql
while search_condition do 
  statement_list;
end while;
```
**需求**
`计算从1加到n的值 累加`
```sql
drop procedure if exists pro_test4;
delimiter $
create procedure pro_test4(n int)
begin
  declare start int default 1;
  declare count int default 0;
  while start <= n do
    set count = count + start;
    set start = start + 1;
  end while;
  select concat('n是：',n,'结果为：',count) as count;
end $
delimiter ;
call pro_test4(4);
```
### repeat循环
**语法结构**
```sql
# 类似于do while循环，先执行，然后判断条件
repeat
  
  statement_list
  
  until search_condition # 结束条件
end repeat;
```
**需求**
`计算从1加到n的值 累加 使用repeat`
```sql
drop procedure if exists pro_test4;
delimiter $
create procedure pro_test4(n int)
begin
  declare count int default 0;
  repeat
    set count = count + n;
    set n = n - 1;
    until n = 0
  end repeat;
  select count;
end $
delimiter ;
call pro_test4(4);
```

### loop 循环
loop 没有条件判断退出需要借助`leave`来实现退出循环，否则是死循环
**语法结构**
```sql
[loop_name :] loop

  statement_list
  
end loop [loop_name];
```
**需求**
`计算从1加到n的值 累加 使用loop+leave`
```sql
drop procedure if exists pro_test4;
delimiter $
create procedure pro_test4(n int)
begin
  declare count int default 0;
  c : loop
    set count = count + n;
    set n = n - 1;
    
    if n <= 0 then
      leave c; # 跳出loop循环
    end if
  end loop c;
  select count;
end $
delimiter ;
call pro_test4(4);
```

### 游标/光标
游标是用来存储查询结果集的数据结构，在存储过程和函数中可以使用光标对结果集进行循环处理。光标的使用包括光标的声明、OPEN、FETCH和CLOSE，其语法如下
```sql
# 声明光标
declare cursor_name cursor for select_statement;
# open 光标
open cursor_name;
# fetch 光标
fetch cursor_name into var_name [,var_name]...;
# close 光标
close cursor_name;
```
**示例表**
```sql
create table if not exists emp (
	id int(11) not null auto_increment,
	name varchar(50) not null comment '名称',
	age int(11) comment '年龄',
	salary int(11) comment '薪水',
	primary key (id)
 )engine=innodb default charset=utf8;
 
 insert into emp values(default,'熊4',112,15100) ,(default,'熊5',15,1033300) ,(default,'熊6',55,20000);
 
 select * from emp;


```
**代码示例**
```sql
delimiter $
create procedure pro_test5()
begin
	declare e_id int(11);
	declare	e_name varchar(50);
	declare	e_age int(11);
	declare	e_salary int(11);
	declare emp_result cursor for select * from emp;
	declare	total int(11);
	# 获取到总行数
	select count(1) into total from emp;
	# 开启游标
	open emp_result;
	# 抓取游标数据 ,每次一行 这里调用两次 ,所以只打印两次内容,也就是emp表中的前两行数据
	# 熊1 熊2
	# 如果fetch超出了表中的内容行数 会报错
	fetch emp_result into e_id,e_name,e_age,e_salary;
	select concat('id=',e_id,'name=',e_name,'age=',e_age,'薪资为:',e_salary);
	
	fetch emp_result into e_id,e_name,e_age,e_salary;
	select concat('id=',e_id,'name=',e_name,'age=',e_age,'薪资为:',e_salary);
	
	# 关闭游标
	close emp_result;
end $

delimiter ;
call pro_test5();
```
**使用循环解决超出行数问题**
1. 使用循环
```sql
drop procedure if exists pro_test6;

delimiter $
create procedure pro_test6()
begin
	declare e_id int(11);
	declare	e_name varchar(50);
	declare	e_age int(11);
	declare	e_salary int(11);
	declare	total int(11);
	declare emp_result cursor for select * from emp;
	# 获取到数量
	select count(1) into total from emp;
	
	open emp_result;
	# 使用循环
	c:loop
		set total = total - 1;
		fetch emp_result into e_id,e_name,e_age,e_salary;
		select concat('id=',e_id,'name=',e_name,'age=',e_age,'薪资为:',e_salary);
		if total <= 0 then
			leave c;
		end if;
	end loop c;
	
	# 关闭游标
	close emp_result;
end $

delimiter ;

call pro_test6();
```

2. 使用`exit` 退出语句
```sql
drop procedure if exists pro_test7;

delimiter $
create procedure pro_test7()
begin
	declare e_id int(11);
	declare	e_name varchar(50);
	declare	e_age int(11);
	declare	e_salary int(11);
	declare	total int(11);
	# 1代表有数据 0 代表没有
	declare has_data int default 1;
	
	declare emp_result cursor for select * from emp;
	# 如果找不在值 就吧has_data 变量设置为0
	declare exit handler for not found set has_data = 0;
	
	open emp_result;
	# 使用循环
	repeat
		fetch emp_result into e_id,e_name,e_age,e_salary;
		select concat('id=',e_id,'name=',e_name,'age=',e_age,'薪资为:',e_salary);
		until has_data = 0
	end repeat;
	
	# 关闭游标
	close emp_result;
end $

delimiter ;

call pro_test7();
```
## 存储函数
### 创建
```sql
delimiter $
create function function_name([param type ...])
returns type
begin
... 具体代码 跟存储过程一样只是可以使用return进行返回
return ...;
end$
delimiter ;
```
**例子**
```sql
# 根据countryId 查询总记录数
drop function fun1;
delimiter $
create function fun1(countryId int)
returns int
begin
	declare cnum int;
	select count(1) into cnum from country where country_id = countryId;
	return cnum;
end$
delimiter ;

select fun1(1);
```
### 调用
```sql
select function_name([param type ...]);
```
### 删除
```sql
drop function function_name;
```
