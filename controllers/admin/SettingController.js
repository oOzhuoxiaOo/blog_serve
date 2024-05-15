const MeServices = require("../../services/web/meService");
const SettingServices = require("../../services/admin/settingService");
module.exports = class TypeController {
    static async apiGet(req, res) {
        try {
            let { userId } = req.user;
            const response = await SettingServices.get(userId);
            res.json({ code: 0, msg: '站长信息获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiUpdateWeb(req, res) {
        try {
            let { userId } = req.user;
            const response = await SettingServices.updateWeb(userId);
            res.json({ code: 0, msg: '站长信息获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiUpdateAdmin(req, res) {
        try {
            let { userId } = req.user;
            
            const response = await SettingServices.updateAdmin(userId);
            res.json({ code: 0, msg: '站长信息获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }

}