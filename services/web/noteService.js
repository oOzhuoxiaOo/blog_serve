const NoteModel = require("../../MongoDB/models/NoteModel");
const config = require("../../config/config");

module.exports = class NoteServices {
    static async getNotePage(webMasterId, pageWhich, pageNum) {
        try {
            // 获取添加笔记结果 (日期降序排列)
            let response = await NoteModel
                .find({ userId: webMasterId, isDeleted: false })
                .select('')
                .sort({ createTime: -1 })
                .skip(pageNum * (pageWhich - 1)) //跳过页数
                .limit(pageNum) // 截取一页数据
                .populate('tags') //填充关联数据 (populate:迁移)
                .populate('type') //填充关联数据 (populate:迁移)

            // 加工下笔记图片地址
            for (let i = 0; i < response.length; i++) {
                const item = response[i]
                // 如果存在图
                if (item.img.isHasImg) {
                    console.log('是否进入有img循坏')
                    const imgPath = item.img.path //img对象的path路径
                    // 将静态资源目录名替换为空，并将域名拼接
                    const imgUrl = 'http://' + config.DOMAIN + imgPath.replace('static', '')
                    item.img.imgUrl = imgUrl //将图片url地址给原对象
                }
            }
            return response;

        } catch (error) {
            console.log('不等获得notes', error)
        }

    }
    static async getNoteById(webMasterId, noteId) {
        try {

            let response = await NoteModel
                .findOne({ userId: webMasterId, _id: noteId })
                .populate('tags') //填充关联数据 (populate:迁移)
                .populate('type') //填充关联数据 (populate:迁移)

            return response;

        } catch (error) {
            return  Promise.reject(error);
        }

    }
}