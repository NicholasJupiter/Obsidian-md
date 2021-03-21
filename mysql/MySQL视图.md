# MySQL视图
## 视图概述
视图（View）是一种虚拟存在的表。视图并不再数据库中实际存在，行和列都是自定义视图中查询中使用的表，并且再使用视图时动态生成的。通俗的讲，视图就是select语句执行后的结果集。所以我们在创建视图的时候，主要工作就是创建select这条sql上面。
视图相对于普通的表优势包括以下几点：
- 简单：使用视图的用户不需要关心后面对表的结构、关联条件、和筛选条件，对于用户来说已经是过滤好的符合条件结果集。
- 安全：使用视图的用户只能访问他们被允许查询的结果集，对表的权限管理并不能限制到某个行列，但是能通过视图就可以简单实现。
- 数据独立：一旦视图被创建，可以屏蔽表结构的变化对用户的影响，源表增加列对视图没有影响。源表修改列明，则可以通过修改视图来解决，并不会对访问者的影响。
## 创建或修改视图
如果使用`update`语句操作表中数据影响到原表的数据。
### 创建
*语法：*
```sql
create [or replace] [ALGORITHM = {UNDEFINED | MERGE | TEMPLATE}]
VIEW view_name [(column_list)]
as select_statement 
[WITH [CASCADED | LOCAL] CHECK OPTION]
```
*示例*
```sql
create view view_city_country
as select c.*,t.country_name from city c, country t where c.country_id = t.country_id;
select * from view_city_country;
```
### 修改视图
*语法*
```sql
alter [or replace] [ALGORITHM = {UNDEFINED | MERGE | TEMPLATE}]
VIEW view_name [(column_list)]
as select_statement 
[WITH [CASCADED | LOCAL] CHECK OPTION]
```
>选项：
>WITH [CASCADED | LOCAL] CHECK OPTION 决定了是否允许更新数据使记录不再满足视图条件
>LOCAL：只要满足本视图条件就可以更新
>CASCADED：必须满足所有针对于该视图的所有条件才可以更新，默认值。
### 查看视图
*查看视图*
1. 使用 `show tables;`：弊端就是这能查询到所有的视图和表。
2. 使用开发工具例如 `sqlyog`，`Navicat Premium`。

*查看视图select语句*
```sql
show create view view_name;
```
### 删除视图
```sql
drop view if exists view_name;
```