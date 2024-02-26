
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let NoteSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        // required: true 
    },
    description: {
        type: String
    },
    createTime: {
        type: Date,
        default: () => new Date() //只在新建文档不传值起作用
    },
    updateTime: {
        type: Date,
        default: ()=> new Date() //要想修改更新时间，需要手动设置文档更新upteTime
    },
    mdHtml: {
        type: String
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId, //数据类型为objctid
            ref: 'tags' //与NoteTagModel模型关联,注意此处为集合名称，不是模型名称
        }
    ],
    type:{
        type: mongoose.Schema.Types.ObjectId, //数据类型为objctid
        ref: 'types' //与NoteTagModel模型关联,注意此处为集合名称，不是模型名称
    },
    img: {
        type: Object,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },


})

// 创建文档模型对象
let NoteModel = mongoose.model('notes', NoteSchema)


module.exports = NoteModel