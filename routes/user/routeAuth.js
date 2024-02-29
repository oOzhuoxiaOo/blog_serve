// 引入express 包
const express = require('express')
const handleAuth = require('../../routes_handle/user/handleAuth')
const mid_token =require('../../middleware/mid_token')
const multer = require('multer') // 文件处理模块包
const m_upload = require("../../middleware/mid_upload")
const path = require('path')


// 创建应用对象
const route = express.Router();


console.log('我是路由Auth')
// 设置中间件










// 设置路由
// post
route.post('/publish',mid_token.verifyToken,m_upload.upload.single('noteImg'),handleAuth.handlePublish)
route.post('/avatar/upload',mid_token.verifyToken,m_upload.avatarUpload.single('avatarImg'),handleAuth.handleUserAvatarUpload)
route.post('/friends/write',mid_token.verifyToken,handleAuth.handleAddFriendLink)
route.post('/set',mid_token.verifyToken,handleAuth.handleSet)
// single('<文件字段名>')
route.post('/upload',mid_token.verifyToken,m_upload.upload.single('noteImg'),handleAuth.handleUpload)
// get
route.get('/me',mid_token.verifyToken,handleAuth.handlePersonalDetail)
route.get('/auth/login',mid_token.verifyToken,handleAuth.handleIsLogin)
route.get('/notes',mid_token.verifyToken,handleAuth.handleNotes)
route.get('/tags',mid_token.verifyToken,handleAuth.handleGetTags)
route.get('/types',mid_token.verifyToken,handleAuth.handleGetTypes)
route.get('/notes/tags/:tagId',mid_token.verifyToken,handleAuth.handleNotesByTagId)
route.get('/chart',mid_token.verifyToken,handleAuth.handleChart)
route.get('/set',mid_token.verifyToken,handleAuth.handleGetSet)

route.get('/notes/types/:typeId',mid_token.verifyToken,handleAuth.handleNotesByTypeId)
route.get('/notes/types',mid_token.verifyToken,handleAuth.handleConTypes)
route.get('/notes/tags',mid_token.verifyToken,handleAuth.handleConTags)
route.get('/self',mid_token.verifyToken,handleAuth.handleGetSelfByToken)
route.get('/',mid_token.verifyToken,handleAuth.handleGetUsers)
route.get('/friends',mid_token.verifyToken,handleAuth.handleGetFriendLink)
// delete
route.delete('/notes/:noteId',mid_token.verifyToken,handleAuth.handleDeleteNotesByNoteId)
route.delete('/:id',mid_token.verifyToken,handleAuth. handleDeleteUserByUserId)
route.delete('/friends/:id',mid_token.verifyToken,handleAuth. handleDeleteFriendLink)
route.delete('/notes/tags/:id',mid_token.verifyToken,handleAuth.handleDeleteTag)
route.delete('/notes/types/:id',mid_token.verifyToken,handleAuth.handleDeleteType)
// patch
route.patch('/:id',mid_token.verifyToken,handleAuth.handlePatchUserById)
route.patch('/friends/:id',mid_token.verifyToken,handleAuth.handleUpdateFriendLink)
route.patch('/notes/tags/:id',mid_token.verifyToken,handleAuth.handleUpdateTag)
route.patch('/notes/types/:id',mid_token.verifyToken,handleAuth.handleUpdateType)

module.exports = route
