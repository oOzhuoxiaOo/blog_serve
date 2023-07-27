











// 浏览器不支持module?
import Check from "../common/check.js";
import config from "/config/config.js";



let form = document.querySelector('form')
let e_username = document.querySelector('#username');
let e_password = document.querySelector('#password');
let e_hint = document.querySelector('.hint')
let e_submitBtn = document.querySelector('.submit')


// console.log(Check);
// console.log(form)
// console.log(e_username)
// console.log(e_password)
// console.log(e_submitBtn)



e_submitBtn.addEventListener('click', function () {
    let check = new Check()
    console.log(check)
    // user输入的账号密码
    let username = e_username.value
    let password = e_password.value
    let result = check.checkLogin(username, password)
    console.log(result)

    // 如果账号密码正常，则发送请求
    if (result.bool) {
        let baseUrl = config.baseUrl
        axios.post(baseUrl + '/api/user/login', {
            username,
            password
        }, {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        }).then((res) => {
            check.hintAnimate(e_hint, res.data.msg)
           
        }).catch(() => {
            check.hintAnimate(e_hint, "服务器异常")
        })
    } else {
        check.hintAnimate(e_hint, result.msg);
    }
})