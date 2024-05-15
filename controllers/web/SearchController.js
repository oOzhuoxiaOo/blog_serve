const SearchServices = require("../../services/web/searchService");

module.exports = class SearchController {
    static async apiGetNotesByKeyWord(req, res) {
        try {
            let { webMasterId } = req.web;
            let { keyword } = req.query;
            if (!webMasterId || typeof keyword !== "string") return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await SearchServices.getNotesByKeyWord(webMasterId,keyword);
            res.json({ code: 0, msg: '搜索文章获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }


}