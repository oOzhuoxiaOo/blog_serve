const TypeServices = require("../../services/web/typeService");
const { isValidObjectId } = require("mongoose")
module.exports = class TypeController {
    static async apiGetTypes(req, res) {
        try {
            let { webMasterId } = req.web;
            if (!webMasterId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await TypeServices.getTypes(webMasterId);
            res.json({ code: 0, msg: '类别获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiGetNotesByTypeId(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let { typeId } = req.params;
            if (!webMasterId || !typeId || !isValidObjectId(typeId)) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await TypeServices.getNotesByTypeId(webMasterId, typeId);
            res.json({ code: 0, msg: '通过类别ID,文章获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }

}