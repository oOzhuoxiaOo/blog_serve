// 引入express 包
const express = require('express')
const handleAuth = require('../../routes_handle/user/handleAuth')
const mid_token =require('../../middleware/mid_token')
const multer = require('multer') // 文件处理模块包
const path = require('path')

// 创建应用对象
const route = express.Router();


console.log('我是路由Auth')
// 设置中间件



// 设置文件上传目录和文件名
const storage = multer.diskStorage({
    // 配置文件上传目录
    destination: function (req, file, cb) { //destination: 目的地
        // const uploadPath = path.join(__dirname,'../../static/images/notes')
        // 回调第一个参数为错误对象，设为null标识没有错误
      cb(null, 'static/images/notes') // 文件上传目录 (此处标识应用服务，及app服务再的位置)
    },
    //配置文件保存名称
    filename: function (req, file, cb) { 
      cb(null, Date.now() + '-' + file.originalname) // 文件名
    }
  });

  
const upload = multer({storage}) //文件处理实例








// 设置路由
// post
route.post('/publish',mid_token.verifyToken,upload.single('noteImg'),handleAuth.handlePublish)
// single('<文件字段名>')
route.post('/upload',mid_token.verifyToken,upload.single('noteImg'),handleAuth.handleUpload)
// get
route.get('/me',mid_token.verifyToken,handleAuth.handlePersonalDetail)
route.get('/notes',mid_token.verifyToken,handleAuth.handleNotes)
route.get('/tags',mid_token.verifyToken,handleAuth.handleGetTags)
route.get('/types',mid_token.verifyToken,handleAuth.handleGetTypes)
route.get('/notes/tags/:tagId',mid_token.verifyToken,handleAuth.handleNotesByTagId)
route.get('/notes/types/:typeId',mid_token.verifyToken,handleAuth.handleNotesByTypeId)

module.exports = route
