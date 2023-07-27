
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    author: {
        type: String,
        default: '无名' 
    },
    style: {
        type: String,
        enum: ['玄幻', '奇幻', '仙侠', '都市', '历史', '轻小说'] 
    },
    price: Number
})

// 创建文档模型对象
let BookModel = mongoose.model('books', BookSchema)


module.exports = BookModel