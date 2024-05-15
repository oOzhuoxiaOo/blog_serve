const UserModel = require("../../MongoDB/models/UserModel");
const NoteModel = require("../../MongoDB/models/NoteModel");
const config = require("../../config/config")


module.exports = class MeServices {
    static async getMe(webMasterId) {
        try {
            let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
            // 标签数🚩 笔记数 类别数
            let notesResult = await NoteModel.find({ userId: webMasterId }, { tags: 1 })
            let distinctTagsResult = await NoteModel.find({ userId: webMasterId }, { tags: 1 }).distinct('tags') //distinct: e:不同的 ,,也可进行去重
            let distinctTypeResult = await NoteModel.find({ userId: webMasterId }, { tags: 1 }).distinct('type') //distinct: e:不同的 ,,也可进行去重
            let tagsCount = distinctTagsResult.length
            let notesCount = notesResult.length
            let typeCount = distinctTypeResult.length

            const oldAvatar = findUserResult.avatar;
            findUserResult.avatar = 'http://' + config.DOMAIN + oldAvatar.replace('static', '');
            // 个人信息集合
            let response = {
                userInfo: findUserResult,
                noteInfo: {
                    tagsCount,
                    notesCount,
                    typeCount
                }
            }
            return response;
        } catch (error) {
            return Promise.reject(error)
        }

    }

}