<?php
 
mysql_connect('localhost', 'root', '');
// 选择数据库
mysql_select_db('nz2004');
// 这两句用来设置编码，复制过来用就行
mysql_query("set charset 'utf8'");
mysql_query("set character set 'utf8'");
 
 
?>