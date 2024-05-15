
const NoteModel = require("../../MongoDB/models/NoteModel");
const config = require("../../config/config")


module.exports = class SearchServices {
    static async getNotesByKeyWord(webMasterId, keyword) {
        try {
            let regexp = new RegExp(keyword, "i");
            // 获取文章结果(日期降序排列)
            let resultNotes = await NoteModel
                .find({ userId: webMasterId, isDeleted: false, title: regexp })
                .select('')
                .sort({ createTime: -1 })
                .populate('tags') //填充关联数据 (populate:迁移)
                .populate('type') //填充关联数据 (populate:迁移)

            // 加工下笔记图片地址
            for (let i = 0; i < resultNotes.length; i++) {
                const item = resultNotes[i]
                // 如果存在图
                if (item.img.isHasImg) {
                    console.log('是否进入有img循坏')
                    const imgPath = item.img.path //img对象的path路径
                    // 将静态资源目录名替换为空，并将域名拼接
                    const imgUrl = 'http://' + config.DOMAIN + imgPath.replace('static', '')
                    item.img.imgUrl = imgUrl //将图片url地址给原对象
                }
            }

            return resultNotes;
        } catch (error) {
            return Promise.reject(error)
        }

    }
}