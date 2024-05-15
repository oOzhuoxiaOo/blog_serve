const CommentServices = require("../../services/web/commentService");
const { isValidObjectId } = require("mongoose")
module.exports = class CommentController {
    static async apiCreateComment(req, res) {
        try {
            let noteId= req.body.noteid
            let { webMasterId } = req.web;
            let commentType = req.body.type;
            let { os, browser } = req.useragent;
            if (!webMasterId || !commentType|| !(commentType == 1 || commentType == 2) || !isValidObjectId(noteId)) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            if(commentType == 1) {
                let {nickname,email,content} = req.body;
                let commentOneItem = {nickname,email,content,os,browser}
                let response = await CommentServices.postCreateLevelOneComment(webMasterId,noteId,commentOneItem)
                res.json({ code: 0, msg: '评论成功' });
            }
            if(commentType == 2) {
                let {nickname,email,content,who,targetNickName} = req.body
                let commentTwoItem = {nickname,email,content,who,targetNickName,os,browser}
                let response = await CommentServices.postCreateLevelTwoComment(webMasterId,noteId,commentTwoItem)
                res.json({ code: 0, msg: '评论成功' });
            }
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }


}