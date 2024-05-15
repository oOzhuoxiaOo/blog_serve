// 引入express 包
const express = require('express')
const handleWeb = require('../../routes_handle/web/handleWeb')
const mid_webMaster =require('../../middleware/mid_webMaster')
const NoteController = require("../../controllers/web/NoteController");
const FriendController = require("../../controllers/web/FriendController");
const TagController = require("../../controllers/web/TagController");
const TypeController = require("../../controllers/web/TypeController");
const MeController = require("../../controllers/web/MeController");
const SearchController = require("../../controllers/web/SearchController");
const CommentController = require("../../controllers/web/CommentController");
const SettingController = require("../../controllers/web/SettingController");

// 创建应用对象
const route = express.Router();


console.log('我是路由Web')




// 设置路由
// get
route.get('/test',mid_webMaster.getWebMasterId,(req,res)=>{
    res.json({data:req.useragent})
})
route.get('/me',mid_webMaster.getWebMasterId,MeController.apiGetMe)
route.get('/notes',mid_webMaster.getWebMasterId,NoteController.apiGetPage)
route.get('/notes/:noteId',mid_webMaster.getWebMasterId,NoteController.apiGetNote)
route.get('/friends',mid_webMaster.getWebMasterId,FriendController.apiGetPage)
route.get('/tags/:tagId',mid_webMaster.getWebMasterId,TagController.apiGetNotesByTagId)
route.get('/types/:typeId',mid_webMaster.getWebMasterId,TypeController.apiGetNotesByTypeId)
route.get('/types',mid_webMaster.getWebMasterId,TypeController.apiGetTypes)
route.get('/tags',mid_webMaster.getWebMasterId,TagController.apiGetTags)
route.get('/setting',mid_webMaster.getWebMasterId,SettingController.apiGetSetting)
route.get('/setting/webMaster',mid_webMaster.getWebMasterId,SettingController.apiGetSettingWebMaster)
route.get('/search/notes',mid_webMaster.getWebMasterId,SearchController.apiGetNotesByKeyWord)
// post
route.post('/comment',mid_webMaster.getWebMasterId,CommentController.apiCreateComment)



module.exports = route
