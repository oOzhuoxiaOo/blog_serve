const TagServices = require("../../services/web/tagService");
module.exports = class TagController {
    static async apiGetTags(req, res) {
        try {
            let { webMasterId } = req.web;
            if (!webMasterId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await TagServices.getTags(webMasterId);
            res.json({ code: 0, msg: '标签列表获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiGetNotesByTagId(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let { tagId } = req.params;
            if (!webMasterId || !tagId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await TagServices.getNotesByTagId(webMasterId, tagId);
            res.json({ code: 0, msg: '通过标签ID,文章获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }

}