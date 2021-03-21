# MySQL 触发器介绍
## 介绍
 触发器是与表有关的数据库对象，指再`insert`、`update`、`delete`之前或之后，触发并执行触发器中定义的sql语句集合。触发器的这种特性可以协助应用再数据库端确保数据的完整性，日志记录，数据校验等操作。
 使用别名`OLD`和`NEW`来引用触发器中发生变化的记录内容，这与其他数据库是相似的。现在触发器还只支持行级触发器，不支持语句触发。
 
触发器类型 | NEW和OLD的使用 
-------------------| -----------
 insert 型触发器 | NEW 表示将要或已新增的数据 
 update 型触发器 | OLD 表示修改之前的数据，NEW 表示将要修改或已修改后的数据 
  delete 型触发器 | OLD 表示已经删除的数据
  
  ## 创建触发器
  ### 语法
  ```sql
  delimiter $
  create trigger trigger_name 
  before/after insert/update/delete
  on table_name
  [for each row ]
  begin
    trigger_stmt;
  end $
  delimiter ;
  ```

**表**
```sql
create table emp_logs (
	id int(11) auto_increment,
	operation enum('insert', 'update', 'delete') not null comment '操作类型 insert/update/delete',
	operation_time datetime not null comment'操作时间',
	operation_id int(11) not null comment'操作表的ID',
	operation_params varchar(500) comment'操作参数',
	primary key(id)
)engine=innodb default charset = utf8;
```

 ### 示例

 **添加emp表insert操作之后，保存记录**
 ```sql
 delimiter $
create trigger emp_insert_tri 
after insert 
on emp
begin
	insert into emp_logs values(default, 'insert', now(), new.id, concat('id: ',new.id));
end$

delimiter ;
# emp表添加数据
insert into emp values(default,'xiong',18,10000);
# 查询logs 表
select * from emp_logs;
 ```
 
 ### 查看
 ```sql
 show triggers;
 ```
 
 ### 删除操作
 ```sql
 drop trigger trigger_name;
 ```