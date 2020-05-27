var btn = document.querySelector('#btn')
var userInput = document.querySelector('#userInput')
var pwdInput = document.querySelector('#pwdInput')
 
utils.on(btn, 'click', function (e) {
    e = e || window.event
    // 取到用户名和密码发送后端
    var username = userInput.value
    var pwd = pwdInput.value
    // 发请求
    // url: api/user/register.php
    // method: post
    // query: { username, pwd }
    // response: { code: 1, msg: '注册成功' }
    utils.post('../api/user/register.php', { username, pwd }, resp => {
        console.log(resp)
        if (resp.code === 1) {
            alert(`${resp.msg}，即将跳转登录页`)
            location.replace('./login.html')
        } else {
            alert(resp.msg)
        }
    })
 
    // 阻止默认行为，让表单不提交
    if (e.preventDefault) {
        e.preventDefault()
    } else {
        return false
    }
})