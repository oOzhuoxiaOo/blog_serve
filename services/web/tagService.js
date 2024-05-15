const TagModel = require("../../MongoDB/models/NoteTagModel");
const NoteModel = require("../../MongoDB/models/NoteModel");


const config = require("../../config/config");

module.exports = class TagServices {
    static async getTags(webMasterId) {
        try {
            let distinctTagsResult = await NoteModel
                .find({ userId: webMasterId }, { tags: 1 })
                .distinct('tags') //distinct: e:不同的 ,,也可进行去重

            let response = await TagModel.find({ _id: { $in: distinctTagsResult } })
            return response;
        } catch (error) {
            return  Promise.reject(error);
        }

    }
    static async getNotesByTagId(webMasterId, tagId) {
        try {
            let response = await NoteModel
                .find({ userId: webMasterId, tags: tagId })
                .sort({ createTime: -1 })
            return response;
        } catch (error) {
            return  Promise.reject(error);
        }

    }
}