// 引入express 包
const express = require('express')
const handleUser = require('../../routes_handle/user/handleUser')

// 创建应用对象
const route = express.Router();


console.log('我是路由user')
// 设置中间件

// 设置路由
route.post('/login',handleUser.handleLogin)
route.post('/register',handleUser.handleRegister)
route.post('/resetpassword',handleUser.handleResetPassword)



module.exports = route
