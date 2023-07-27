// 引入express 包
const express = require('express')
const handleAuth = require('../../routes_handle/user/handleAuth')
const mid_token =require('../../middleware/mid_token')

// 创建应用对象
const route = express.Router();


console.log('我是路由Auth')
// 设置中间件

// 设置路由
route.get('/personal-detail',mid_token.verifyToken,handleAuth.handlePersonalDetail)



module.exports = route
