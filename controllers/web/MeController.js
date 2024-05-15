const MeServices = require("../../services/web/meService");
module.exports = class TypeController {
    static async apiGetMe(req, res) {
        try {
            let { webMasterId } = req.web;
            if (!webMasterId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await MeServices.getMe(webMasterId);
            res.json({ code: 0, msg: '站长信息获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }

}