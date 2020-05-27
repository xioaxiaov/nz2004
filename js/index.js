var user = document.querySelector('#user')
var b = user.querySelector('b')
var exit = document.querySelector('#exit')
 
// 验证cookie是否存在
var username = utils.getCookie('username')
if (username) {
    // 已登录
    user.classList.add('islogin')
    b.innerHTML = username
}
 
// 退出登录
utils.on(exit, 'click', function () {
    if (confirm('确定要退出吗？')) {
        // 删除cookie，切换样式
        utils.setCookie('username', '', { expires: -1, path: '/' })
        user.classList.remove('islogin')
    } 
})