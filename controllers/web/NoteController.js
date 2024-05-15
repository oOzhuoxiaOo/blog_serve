const NoteServices = require("../../services/web/noteService");
module.exports = class NoteController {
    static async apiGetPage(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let { pageWhich, pageNum } = req.query;
            if (!webMasterId || !pageWhich || !pageNum) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await NoteServices.getNotePage(webMasterId, pageWhich, pageNum);
            res.json({ code: 0, msg: '文章列表获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiGetNote(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let noteId = req.params.noteId
            if (!webMasterId || !noteId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await NoteServices.getNoteById(webMasterId,noteId);
            res.json({ code: 0, msg: '文章获取', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }

}