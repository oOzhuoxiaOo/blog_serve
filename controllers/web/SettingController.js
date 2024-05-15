const SettingServices = require("../../services/web/settingService");
module.exports = class SettingController {
    static async apiGetSetting(req, res) {
        try {
            let { webMasterId } = req.web;
            if (!webMasterId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await SettingServices.getSetting(webMasterId);
            res.json({ code: 0, msg: '设置数据获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
    static async apiGetSettingWebMaster(req, res) {
        try {
            let { webMasterId } = req.web;
            if (!webMasterId) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await SettingServices.getWebMaster(webMasterId);
            res.json({ code: 0, msg: '设置数据获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }
}