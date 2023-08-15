
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let NoteTypeSchema = new mongoose.Schema({
    typename: {
        type: String,
        unique: true //设置唯一
    },
})


// 创建文档模型对象
let NoteTypeModel = mongoose.model('types', NoteTypeSchema)


module.exports = NoteTypeModel