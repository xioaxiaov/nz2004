var btn = document.querySelector('#btn')
var userInput = document.querySelector('#userInput')
var pwdInput = document.querySelector('#pwdInput')
 
utils.on(btn, 'click', function (e) {
    e = e || window.event
 
    var username = userInput.value
    var pwd = pwdInput.value
    // 发送登录请求
    utils.post('../api/user/login.php', { username, pwd }, resp => {
        console.log(resp)
        if (resp.code === 1) {
            // 存cookie，这里作为演示咱们直接存用户名
            // 真实开发当中得结合后端，这里存令牌
            utils.setCookie('username', username, { path: '/'})
            alert(`${resp.msg}，即将返回首页`)
            location.href = '../index.html'
        } else {
            alert(resp.msg)
        }
    })
 
    if (e.preventDefault) {
        e.preventDefault()
    } else {
        return false
    }
})