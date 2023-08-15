const UserModel = require('../../MongoDB/models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRETKEY } = require('../../config/config')

const saltRounds = 10 //盐值的轮数，增加哈希值的计算时间

// 登录
const handleLogin = async (req, res) => {
    try {
        console.log('1.收到登录请求')
        console.log('body', req.body)

        // 获取查询结果
        let user = await UserModel.findOne({ username: req.body.username })

        if (user) {
            console.log('2.数据库账户存在', user)
            // 进行密码匹配比较
            let compareResult = await bcrypt.compare(req.body.password, user.password)
            console.log(compareResult)
            if (compareResult) {
                // 用户认证成功，生成 Token
                const token = jwt.sign({ userId: user._id, username: user.username }, SECRETKEY, {
                    expiresIn: '12h' // Token 过期时间，可以根据需求设置其他时间
                })

                 // 将 Token 设置到 Cookie 中
                res.cookie('token', token, { httpOnly: true, maxAge: 12*60*60*1000 }); // 设置 HttpOnly 属性，增加安全性
        
                return res.cc('登录成功',0)
  
            } else {
                return res.cc('密码错误，登录失败', 1)
            }
        }

        console.log('登录失败，不存在该账户')
        res.cc("登录失败，不存在该账户")

    } catch (err) {
        console.log('捕获到异常', err)
        res.send('出错啦')
    }
}




// 注册

const handleRegister = async (req, res) => {
    try {
        console.log('收到注册请求')
        // 进行密码加密
        let hashResult = await bcrypt.hash(req.body.password, saltRounds)

        // 获取查询结果
        let data = await UserModel.findOne({ username: req.body.username })

        if (data) {
            console.log('账户已存在')
            return res.cc('账户已被注册，请选择新账户')
        }

        // 获取添加用户结果
        let newUser = await UserModel.create({
            username: req.body.username,
            password: hashResult
        })
        console.log('新用户已添加', newUser)


        console.log(req.body)
        res.cc('注册成功', 0)
    } catch (err) {
        console.log('捕获到异常', err)
        res.send('出错啦')
    }
}



// 重置密码
const handleResetPassword = async (req, res) => {
    try {
        console.log('1.收到重置密码请求')
        console.log('body', req.body)
        // 获取查询结果
        let user = await UserModel.findOne({ username: req.body.username })

        // 如果找到该用户
        if (user) {
            console.log('2.数据库账户存在，可重置密码')



            // 进行密码匹配比较
            let compareResult = await bcrypt.compare(req.body.password, user.password)
            console.log(compareResult)
            // 如果匹配成功，则将进行修改密码
            if (compareResult) {
                // 将明文密码加密
                let hashResult = await bcrypt.hash(req.body.newPassword, saltRounds)
                // 操作数据库修改密码
                let updateResult = await UserModel.updateOne(user, { password: hashResult })
                if (!updateResult) {
                    console.log('内部错误,修改密码失败')
                    return res.cc('内部错误，修改密码失败')
                }
                return res.cc('修改密码成功', 0)
            } else {
                return res.cc('密码错误，请检查密码', 1)
            }


        }

        console.log('2.重置密码失败，请检查账户名和密码')
        res.cc('不存在该账户')

    } catch (err) {
        console.log('捕获到异常', err)
        res.send('出错啦')
    }
}


module.exports = {
    handleLogin,
    handleRegister,
    handleResetPassword
}