# 概述
MySQL事物主要用于处理操作量大，复杂度高的数据。比如说，在人员管理系统中，你要删除一个人员，你既需要删除人员的基本资料，也要删除该人员你的相关信息，如信箱，文章等等，这样，这些数据库操作语句就构成了一个事务。
- 在MySQL中只有使用了Innodb数据库引擎的数据库或表才支持事务
- 事务处理可以用来维护数据库的完整性，保证成批的sql语句要么全部执行，要么全部不执行。
- 事务用来管理`insert`，`update`，`delete`语句

一般来说，事务必须满足以下4个条件：`原子性(或不可分割性)`，`一致性`，`隔离性(又称独立性)`，`持久性`
-  原子性：一个事务中所有的操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚到事务开始的状态，就像这个事务从来没发生过
-  一致性：在事务开始之前和事务结束之后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精准度、串联性以及后续数据库可自发性的完成预设工作。
-  隔离性：数据库允许多个并发事务同时对其数据进行修改和读写的能力，隔离性可以防止多个事务并发执行时由于交叉而导致的数据不一致。事务隔离分为不同级别，包括读未提交、读提交、可重复读和串行化。
-  持久性：事务结束后，对数据修改就是永久的，即便故障也不会丢失。

> 在MySQL命令行默认设置下，事务都是自动提交的，即SQL语句后就会立马执行COMMIT操作。因此要显示的开启一个事务必须使用命令BEGIＮ和START TRANSACTION，或者执行命令SET AUTOCOMMIT=0，用来禁止使用当前会话的自动提交。

# 语法
```sql
# 显示的开启一个事务
BEGIN ;
START TANSACTION ;

# 提交事务
COMMIT ; # 确认提交事务
COMMIT WORK; # 确认提交事务

# 回滚事务
ROLLBACK ;
ROLLBAKC WORK ;

# 事务保存点，一个事务可有多个保存点
SAVEPOINT [identifier] ;
# 删除事务保存点 当你没有指定保存点，会抛出异常
RELEASE SAVEPOINT [identifier]; 
# 把事务回滚到某个保存点
ROLLBACK TO [identifier];

# 设置事务的隔离级别 
# READ UNCOMMITTED
# READ COMMITTED
# REPEATABLE READ
# SERIALIZABLE
SET TRANSACTION [level]
```
## 示例
```sql
begin; # 开启事务
insert into emp values(default, '熊', 1000);
commit; 提交事务
# 查询发现已添加进数据库

begin; # 开始事务
insert into emp values(default ,'xiong call', 20000);
rollback; # 回滚
# 查询发现并未添加数据库
```
