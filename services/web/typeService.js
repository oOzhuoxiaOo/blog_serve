const TypeModel = require("../../MongoDB/models/NoteTypeModel");
const NoteModel = require("../../MongoDB/models/NoteModel");



module.exports = class TypeServices {
    static async getTypes(webMasterId) {
        try {
            let distinctTypesResult = await NoteModel
                .find({ userId: webMasterId }, { type: 1 })
                .distinct('type') //distinct: e:不同的 ,,也可进行去重

            let response = await TypeModel.find({ _id: { $in: distinctTypesResult } })
            return response;
        } catch (error) {
            return  Promise.reject(error)
        }

    }
    static async getNotesByTypeId(webMasterId, typeId) {
        try {
            let response = await NoteModel
            .find({ userId:webMasterId, type: typeId })
            .sort({ createTime: -1 })

            return response;
        } catch (error) {
            return  Promise.reject(error)
        }

    }
}