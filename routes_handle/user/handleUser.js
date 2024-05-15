const UserModel = require('../../MongoDB/models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRETKEY } = require('../../config/config')
const SetModel = require('../../MongoDB/models/SetModel')

const saltRounds = 10 //盐值的轮数，增加哈希值的计算时间

// 登录
const handleLogin = async (req, res) => {
    try {
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

                // 将 Token 设置到 data 中
                return res.send({
                    code: 0,
                    message: '登录成功',
                    data: {
                        token: token
                    }
                })

            } else {
                return res.send({
                    code: 401,
                    message: "登录失败，密码错误"
                })
            }
        }
        // console.log('登录失败，不存在该账户')
        res.send({
            code: 401,
            message: "不存在该用户"
        })

    } catch (err) {
        console.log('捕获到异常', err)
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
            return res.send({
                code: 401,
                message: "账号已被注册，请选择新账户"
            })
        }

        // 获取添加用户结果
        let newUser = await UserModel.create({
            username: req.body.username,
            password: hashResult
        })
        const userAbout = await UserModel.findOne({ username: req.body.username })
        console.log("userabput", userAbout)
        const userId = userAbout._id;
        let findedSetDocument = await SetModel.findOne({ userid: userId });
        // console.log("没找到:",findedSetDocument)
        if (!findedSetDocument) {
            let insertData = {
                "userid": userId,
                "web": {
                    "hobby": {
                        "totalTitle": "xx",
                        "totalDescription": "xx",
                        "children": [
                            {
                                "imgUrl": "https://pic4.zhimg.com/v2-e80b18113caca330b909bf13cf8941a7_r.jpg?source=1940ef5c",
                                "title": "动漫",
                                "description": "入坑作《Clannad》,虽然喜欢绘画，奈何长了一双毫无用处的手，无论今后遇到什么难题，我都选择吃饭、睡觉、打豆豆",

                            },
                            {
                                "imgUrl": "https://www.acgtubao.com/wp-content/uploads/2019/01/50745545_p0.jpg",
                                "title": "Music",
                                "description": "喜欢听音乐，尤其是老音乐",

                            },
                            {
                                "imgUrl": "https://th.bing.com/th/id/OIP.JhlQ9PrVatvoepmHQ7JznAHaHa?rs=1&pid=ImgDetMain",
                                "title": "Game",
                                "description": "喜欢打游戏",

                            }
                        ]
                    },
                    "aboutMe": "我是夏娜",
                    "announcement": "欢迎来到我的小站",
                    "originIntroduction": "个人兴趣以及记录",
                    "isTheme": true,
                    "backgroundImage": "https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/3b292df5e0fe9925538aff9c33a85edf8cb1717c.jpg"
                },
                "admin": {
                    "webMaster": false,
                    "isTheme": true
                },

            }

            let insertReult = await SetModel.insertMany([insertData])

        }
        console.log('新用户已添加', newUser)


        console.log(req.body)
        res.send({
            code: 0,
            message: "注册成功"
        })
    } catch (err) {
        console.log('捕获到异常', err)
        res.send({
            code: 500,
            message: "服务器异常"
        })
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
                    return res.send({
                        code: 500,
                        message: "服务器异常"
                    })
                }
                return res.cc('修改密码成功', 0)
            } else {
                return res.send({
                    code: 401,
                    message: "密码错误，请检查密码"
                })
            }


        }

        console.log('2.重置密码失败，请检查账户名和密码')
        res.send({
            code: 401,
            message: "不存在该账户"
        })

    } catch (err) {
        console.log('捕获到异常', err)
        res.send({
            code: 500,
            message: "服务器异常"
        })
    }
}


module.exports = {
    handleLogin,
    handleRegister,
    handleResetPassword
}