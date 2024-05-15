const FriendServices = require("../../services/web/friendService");
module.exports = class FriendController {
    static async apiGetPage(req, res) {
        try {
            let webMasterId = req.web.webMasterId;
            let { pageWhich, pageNum } = req.query;
            if (!webMasterId || !pageWhich || !pageNum) return res.json({ code: 400, msg: '缺少对应参数或参数格式不正确' });
            const response = await FriendServices.getFriendPage(webMasterId, pageWhich, pageNum);
            res.json({ code: 0, msg: '友情链接获取成功', data: response })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, msg: '服务器出现未知错误' })
        }
    }


}