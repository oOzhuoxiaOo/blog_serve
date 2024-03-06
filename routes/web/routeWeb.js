// 引入express 包
const express = require('express')
const handleWeb = require('../../routes_handle/web/handleWeb')

const mid_webMaster =require('../../middleware/mid_webMaster')


// 创建应用对象
const route = express.Router();


console.log('我是路由Web')




// 设置路由
// get
route.get('/me',mid_webMaster.getWebMasterId,handleWeb.handlePersonalDetail)
route.get('/auth/login',mid_webMaster.getWebMasterId,handleWeb.handleIsLogin)
route.get('/notes',mid_webMaster.getWebMasterId,handleWeb.handleNotes)
route.get('/tags',mid_webMaster.getWebMasterId,handleWeb.handleGetTags)
route.get('/types',mid_webMaster.getWebMasterId,handleWeb.handleGetTypes)
route.get('/notes/tags/:tagId',mid_webMaster.getWebMasterId,handleWeb.handleNotesByTagId)
route.get('/chart',mid_webMaster.getWebMasterId,handleWeb.handleChart)
route.get('/set',mid_webMaster.getWebMasterId,handleWeb.handleGetSet)
route.get('/notes/types/:typeId',mid_webMaster.getWebMasterId,handleWeb.handleNotesByTypeId)
route.get('/notes/types',mid_webMaster.getWebMasterId,handleWeb.handleConTypes)
route.get('/notes/tags',mid_webMaster.getWebMasterId,handleWeb.handleConTags)
route.get('/self',mid_webMaster.getWebMasterId,handleWeb.handleGetSelfByToken)
route.get('/',mid_webMaster.getWebMasterId,handleWeb.handleGetUsers)
route.get('/friends',mid_webMaster.getWebMasterId,handleWeb.handleGetFriendLink)

// post
route.post('/comment',mid_webMaster.getWebMasterId,handleWeb.handlePostComment)



module.exports = route
