# 索引
## 索引概述
MySQL对索引的定义为：索引是帮助MySQL高效获取数据的数据结构（有序）。在数据之外，数据库系统还维护者满足特定条件查找算法的数据结构，这些数据结构以某种方式引用（指向）表中的数据，这样就可以在这些数据结构上实现高级查找算法，这种数据结构就是索引。如下图所示![[Pasted image 20210228171248.png]]

## 索引劣势优势
### 优势
1. 类似书籍的目录，可以快速的定位到某个数据，提高检索效率，减低数据库的IO成本。
2. 通过索引对数据进行排序，降低数据排序成本，降低CPU消耗。
### 劣势
1. 实际上索引也是一张表，该表中保存了主键与索引字段，并指向实体类的记录，所以索引列也是要占用空间的。
2. 虽然索引大大提高了查询效率，同时却也降低更新表的速度，如对表进行`INSERT`、`UPDATE`、`DELETE`。 因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件每次更新添加了索引列的字段，都会调整因为更新所带来的键值变化后的索引信息。

## 索引结构
索引是在MySQL的存储引擎层中实现的,而不是在服务器层实现的。所以每种存储擎的索引都不一-定完全相同，也不是所有的存储引擎都支持所有的索引类型的。MySQL目前提供了以下4种索引：
- BTREE索引：最常见的索引类型，大部分索引都支持B树索引。
- HASH索引：只有Memory引擎支持，使用场景简单。
- R-tree索引（空间索引）：是MyISAM引擎的一个特殊索引类型，主要用于地理空间数据类型，通常是使用较少。
- Full-text（全文索引）：是MyISAM引擎的一种特殊索引类型， 主要用于全文索引，InnoDB从MySQL5.6版本开始支持。
![[Pasted image 20210228172121.png]]
我们平常所说的索引，如果没有特别指明，都是值B+树（多路搜索树，并不一定是二叉的），结构组织索引。其中聚集索引，复合索引，前缀索引，唯一索引默认都是使用B+树索引，统称为索引。

### BTREE结构
BTree又叫多路平衡搜索树，颗m叉的BTree特性如下：
- 树中每个节点最多包含m个孩子。
- 除根节点与叶子节点外，每个节点至少有\[ceil(m/2)\]个孩子。
- 若根节点不是叶子节点，则至少有两个孩子。
- 所有的叶子节点都在同一层。
- 每个非叶子节点由n个key与n+1个指针组成,其中\[ceil(m/2)-1\]<=n<= m-1
向上裂变式
![[Pasted image 20210309000150.png]]
【初始化介绍】   
一颗b树，浅蓝色的块我们称之为一个磁盘块，可以看到每个磁盘块包含几个数据项（深蓝色所示）和指针（黄色所示），  
如磁盘块1包含数据项17和35，包含指针P1、P2、P3，  
P1表示小于17的磁盘块，P2表示在17和35之间的磁盘块，P3表示大于35的磁盘块。  
真实的数据存在于叶子节点即3、5、9、10、13、15、28、29、36、60、75、79、90、99。  
非叶子节点只不存储真实的数据，只存储指引搜索方向的数据项，如17、35并不真实存在于数据表中。

### B+树
B+Tree为BTree的变种，B+Tree与BTree的区别是：
- n叉B+Tree最多含有n个key，而BTree最多含有n-1个key。
- B+Tree的叶子节点保存所有的key信息，依key大小顺序排序。
- 所有非叶子节点都可以看作key的索引部分
![[Pasted image 20210228174437.png]]

![[Pasted image 20210228174701.png]]

思考：为什么说B+树比B-树更适合实际应用中操作系统的文件索引和数据库索引？   
1) B+树的磁盘读写代价更低   
 B+树的内部结点并没有指向关键字具体信息的指针。因此其内部结点相对B 树更小。如果把所有同一内部结点的关键字存放在同一盘块中，那么盘块所能容纳的关键字数量也越多。一次性读入内存中的需要查找的关键字也就越多。相对来说IO读写次数也就降低了。   
2) B+树的查询效率更加稳定   
 由于非终结点并不是最终指向文件内容的结点，而只是叶子结点中关键字的索引。所以任何关键字的查找必须走一条从根结点到叶子结点的路。所有关键字查询的路径长度相同，导致每一个数据的查询效率相当。

## 索引分类
- 单值索引：即一个索引只包含单个列，一个表可以有多个单列索引
- 唯一索引：索引列的值必须唯一，但允许有空值。
- 符合索引：即一个索引可以包含多个列。

## 索引语法
创建表的时候，可以同时创建索引，也可以随时增加索引。
准备数据：
```sql
create database demo_01 default charset=utf8mb4;
use demo_01;

create table `city`(
	city_id int(11) not null auto_increment,
	city_name varchar(50) not null,
	country_id int(11) not null,
	primary key (city_id)
) engine=INNODB default charset=utf8;

create table `country`(
	country_id int(11) not null auto_increment,
	country_name varchar(50) not null,
	primary key (country_id)
) engine=INNODB default charset=utf8;

insert into city values(1,'上海',1),(2,'北京',1),(3,'深圳',1),(4,'湖南',1);
insert into country values(1,'China'),(2,'America'),(3,'Japan'),(4,'Korean');
select  * from city;
```
### 创建索引
语法：
```sql
create [unique|fulltext|spatial] index index_name [using indextype]
on table_name (table_col_name,...);
# 没指定类型 默认是BTree类型索引
```
示例：
```sql
create index idx_city_name on city(city_name);
```
### 查看索引
语法：
```sql
show index from table_name;
```
示例：
```sql
show index from city;
# 后面加上\G会对显示进行优化，方便查看，工具不生效
show index from city\G;
```
### 删除索引
语法：
```sql
drop index index_name on table_name;
```
示例：
```sql
drop index idx_city_name on city;
```
### ALTER命令
语法：
```sql
alter table table_name add (primary|unique|index|fulltext) index_name(column_list);
```
示例：
```sql
alter table city add unique idx_city_name(city_name);
```
### 复合索引
示例
```sql
create index index_name on table_name(column_list);
```
## 索引元则
所以的设计可以遵循一些已有的原则，创建索引的时候尽量考虑符合这些原则，便于提升索引的使用效率，更高效的使用索引。
- 对查询频次较高，且数据量大的表建立索引。
- 索引字段的选择，最佳候选列应当从where子句中提取，如果where子句中组合较多，那么应当挑选最常用、过滤性最好的列的组合。
- 使用唯一索引，区分度较高，使用索引的效率越高。
- 索引可以有效的提升查询效率，但索引的数量不是多多益善，索引越多，维护索引的代价自然也是水涨船高。对于插入、更新、删除等DML操作比较频繁的表来说 ，索引过多，会引入相当高的维护代价，降低DML操作效率，增加相应操作的时间消耗。另外索引过多的话，MySQL也会犯选择困难症，虽然最终仍会找到一个可用索引，但无疑提高了选择的代价。
- 使用短索引，索引创建之后也是使用硬盘储存的，因此提升索引的访问I\O效率，也可以提升总体访问效率。假如构成索引的字段总长度比较短，那么给定大小的储存块可以储存更多的索引值，相应的可以有效提升MySQL访问索引的I\O效率。
- 利用最左前缀，N个列组合而成的组合索引，那么相当于是创建了N个索引，如果查询where子句中使用了组合索引的前几个字段，那么改SQL可以利用组合索引来提升查询效率。