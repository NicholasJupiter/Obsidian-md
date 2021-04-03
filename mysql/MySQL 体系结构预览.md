# MySQL体系结构预览
![[Pasted image 20210316220911.png]]
## InnoDB
**外键**
```sql
create table table_name (
  constraint `外键约束名称` foreign key (column1, column2 ....) references 外键依赖的主表 (column1, column2 ...) on delete cascade # 级联删除
)
```

**知识**
`on (delete|update) (cascade|...)`

- `cascade`：在父表进行`update|delete`操作时，同时会会关联子表的foreign字段进行`update|delete`操作
- `set null`：在父表操作时，会将子表的匹配记录设置null，注意子表不能为 `not null`。
- `no action`：如果子表中没有匹配记录，则不允许对父表对应候选键进行`update|delete`操作
- `restrict`：同`no action`，都是立即检查外键约束
- `set default`：解析器认识`action`但Innodb不能识别，目前不知道这个是什么。

