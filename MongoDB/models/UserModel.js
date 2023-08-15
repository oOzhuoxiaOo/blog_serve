
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    nickname: {
        type: String,
        default:"" 
    },
    email: {
        type: String,
        default:"" 
    },
})

// 创建文档模型对象
let UserModel = mongoose.model('users', UserSchema)


module.exports = UserModel