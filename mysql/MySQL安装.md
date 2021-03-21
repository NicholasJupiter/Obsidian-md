# 安装(建议版本 5.7)
[MySql下载地址](https://downloads.mysql.com/archives/community/)
## window
`这里模拟mysql的安装目录是D:\mysql-5.7.30`
1. 在`mysql目录`创建`data文件夹`和`my.ini配置文件`
`my.ini`配置内容如下：
```ini
[mysqld]
# 设置服务端使用的字符集为utf-8
character-set-server=utf8
# 绑定IPv4地址
bind-address = 0.0.0.0
# 设置mysql的端口号
port = 3306
# 设置mysql的安装目录(能看到bin即可)
basedir=D:\mysql-5.7.30
# 设置mysql数据库的数据的存放目录(即data文件夹，必须是空目录)
datadir=D:\mysql-5.7.30\data
# 允许最大连接数
max_connections=2000
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 设置mysql以及数据库的默认编码
[mysql]
default-character-set=utf8
[mysql.server]
default-character-set=utf8
# 设置客户端默认字符集
[client]
default-character-set=utf8
```
2.   配置环境变量新建变量名`MYSQL_HOME`，变量值`D:\mysql-5.7.30`。找到Path，编辑>新建，添加环境变量`%MYSQL_HOME%\bin`。
3.   去到`mysql>bin目录下`以管理员身份运行`CMD`或者`PowerShell`，执行命令`mysqld --install`安装mysql服务
  1.   初始化mysql，继续在`mysql>bin`目录下执行`mysqld --initialize --user=root --console`（可以多次初始化，但是必须清空`data`文件夹）。执行完成之后可以查看到mysql的初始化随机密码!![[Pasted image 20210228150741.png]]
4.   执行`net start mysql`启动mysql服务![[Pasted image 20210228151400.png]]
5.   登录mysql `mysql -u root -p`，然后输入密码![[Pasted image 20210228151524.png]]
6.   设置初始化密码`set password = password('密码');`![[Pasted image 20210228151648.png]]。
**[[MySQL用户]]**
7.   可以给mysql添加权限用户 ，并可以远程访问
```sql
# 格式说明
# grant 权限 on 数据库.表 to 用户名@连接的ip地址 identified by'密码'
# 实例，给密码是1234的test用户所有数据库的所有表的所有权限
grant all on *.* to test@'%' identified by'1234';
```
## linux
*建议mysql安装地址`/usr/local/mysql`*
1. 下载压缩包 使用命令`wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz`。解压 `tar -zxvf mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz /usr/local/`
2. 修改目录权限`chown -R mysql:mysql /usr/local/mysql`
3. 初始化`./bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data`
4. 查看密码 `cat /usr/local/data/mysqld.log`![[Pasted image 20210228155754.png]]
5. 修改配置文件`/etc/my.cnf`
```sql
[mysqld]
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
socket=/tmp/mysql.sock
explicit_defaults_for_timestamp=true
symbolic-links=0
[mysqld_safe]
log-error=/usr/local/mysql/data/mysql.log
pid-file=/usr/local/mysql/data

```
6.  把脚本放到初始化目录`cp ./support-files/mysql.server /etc/init.d/mysql`
7.  启动服务`service mysql start`
8.  登录mysql `/usr/local/mysql/bin/mysql -u root -p` ，然后输入初始密码
9.  修改密码，并添加远程访问
```sql
set password = password('root');
grant all privileges on *.* to root@'%' identified by 'root';
flush privileges;
use mysql;
update user set host='%' where user='root';
flush privileges;
```
重启mysql生效 `service mysql restart`