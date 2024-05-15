
// 用来创建文档模型对象

// 引入mongoose模块
const mongoose = require('mongoose')

// 创建文档模式
let SetSchema = new mongoose.Schema({
    userid:String,
    web: {
        aboutMe:String,
        announcement:String,
        originIntroduction:String,
        isTheme:Boolean,
        backgroundImage:String,
        hobby: {
            totalTitle:String,
            totalDescription:String,
            children:[
                {
                    imgUrl:String,
                    title:String,
                    description:String
                }
            ]
        }
    },
    admin: {
        webMaster:Boolean,
        isTheme:Boolean,
    }
})

// 创建文档模型对象
let SetModel = mongoose.model('set', SetSchema)


module.exports = SetModel