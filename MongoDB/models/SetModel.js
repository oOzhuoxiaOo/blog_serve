
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let SetSchema = new mongoose.Schema({
    base: {
        webMaster: String
    },
})

// 创建文档模型对象
let SetModel = mongoose.model('set', SetSchema)


module.exports = SetModel