const NoteServices = require("../../services/web/noteService");
module.exports = class NoteController {
    static async apiGetPage(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let { pageWhich, pageNum } = req.query;
            if (!webMasterId || !pageWhich || !pageNum) return res.json({ code: 400, msg: 'ȱ�ٶ�Ӧ�����������ʽ����ȷ' });
            const response = await NoteServices.getNotePage(webMasterId, pageWhich, pageNum);
            res.json({ code: 0, msg: '�����б��ȡ�ɹ�', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '����������δ֪����' })
        }
    }
    static async apiGetNote(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let noteId = req.params.noteId
            if (!webMasterId || !noteId) return res.json({ code: 400, msg: 'ȱ�ٶ�Ӧ�����������ʽ����ȷ' });
            const response = await NoteServices.getNoteById(webMasterId,noteId);
            res.json({ code: 0, msg: '���»�ȡ', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '����������δ֪����' })
        }
    }

}