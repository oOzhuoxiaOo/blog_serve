
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
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, //数据类型为objctid
            ref: 'friends' //与NoteTagModel模型关联,注意此处为集合名称，不是模型名称
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    },
})

// 创建文档模型对象
let UserModel = mongoose.model('users', UserSchema)


module.exports = UserModel