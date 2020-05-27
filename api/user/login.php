<?php
include('../config.php');
 
$name = $_POST['username'];
$pwd = $_POST['pwd'];
 
// 查询数据库里是否存在用户名和密码一致的用户
$sql = "select * from user where name='$name' and pwd='$pwd'";
 
$res = mysql_query($sql);
 
// 判断资源的长度大于0
if (mysql_num_rows($res) > 0) {
    // 登录成功
    echo json_encode(array(
        "code" => 1,
        "msg" => "登录成功"
    ));
} else {
    echo json_encode(array(
        "code" => 0,
        "msg" => "用户名或密码错误"
    ));
}
 
?>