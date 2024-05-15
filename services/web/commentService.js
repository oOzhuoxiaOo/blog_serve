
const NoteModel = require("../../MongoDB/models/NoteModel");



module.exports = class CommentServices {
    static async postCreateLevelOneComment(webMasterId, noteId, commentOneItem) {
        try {
            let { nickname, email, content, os, browser } = commentOneItem;
            const updateCommentOneItem = {
                nickname,
                email,
                content,
                os,
                browser
            }
            // 给笔记添加评论
            const updateResult = await NoteModel.updateOne({ userId: webMasterId, _id: noteId }, {
                $push: { comments: updateCommentOneItem }
            })
            return updateResult;

        } catch (error) {
            return Promise.reject(error)
        }

    }
    static async postCreateLevelTwoComment(webMasterId, noteId, commentTwoItem) {
        try {
            let { nickname, email, content,who,targetNickName,os, browser } = commentTwoItem;
            const updateCommentTwoItem = {
                nickname,
                email,
                content,
                who,
                targetNickName,
                os, browser
            }
            // 给笔记添加评论
            const updateResult = await NoteModel.updateOne(
                { userId:webMasterId,_id:noteId, "comments._id": who },
                {
                    $push: { "comments.$.children": updateCommentTwoItem }
                })
            return updateResult;

        } catch (error) {
            return Promise.reject(error)
        }

    }
}

