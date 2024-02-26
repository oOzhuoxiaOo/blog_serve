
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let FriendSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    imgUrl:{
        type:String
    },
    description:{
        type: String,
    },
    link: {
        type: String,
    }
    
})

// 创建文档模型对象
let FriendModel = mongoose.model('friends', FriendSchema)


module.exports = FriendModel