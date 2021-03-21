# 用户操作
## 创建用户
### 命令
```sql
create user 'username'@'host' identified by 'password';
```
### 说明
- `username` 用户名
- `host` 指定该账号哪个主机可以登录,如果是本地用户可用`localhost`。如果想让其他用户远程登录可以使用通配符 `%`
- `password` 密码 可为空
### 例子
```sql
create user 'dog'@'localhost' identified by '123456';
create user 'dog'@'%' identified by '';
create user 'dog'@'192.168.1.123' identified by '123456';
```
## 用户授权
### 命令
```sql
grant privileges on databasename.tablename to 'username'@'host';
```
### 说明
- `privileges` 操作权限,如`select`、`update`、`insert`等,如果要授权所有规则使用 `ALL`
- `databasename` 数据库名称，授权所有数据库可用`*`
- `tablename` 表名，授权所有表可用`*`
### 例子
```sql
grant select,insert on test.user to 'dog'@'%';
grant all on *.*  to 'dog'@'%';
```
### 注意
使用以上命令授权的用户不能给其他用户授权，如果想让该用户给其他用户授权，用以下命令
```sql
grant privileges on databasename.tablename to 'username'@'host' with grant opion;
```
## 设置与更改用户密码
### 命令
```sql
set password for 'username'@'host' = password('newpassword');
# 如果是当前登录用户 使用以下命令
set password = password('newpassword');
```
## 撤销用户权限
### 命令
```sql
revoke privileges on databasename.tablename from 'username'@'host';
```
## 删除用户
### 命令
```sql
drop user 'username'@'host';
```
*使用完以上命令 最好刷新一下，使用该命令： `flush privileges;`*
