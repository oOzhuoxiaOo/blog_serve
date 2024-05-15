const SetModel = require('../MongoDB/models/SetModel')

const getWebMasterId = async (req, res, next) => {
    const settingDocument = await SetModel.findOne({"admin.webMaster":true});
    console.log("settingDocument:",settingDocument)
    const id = settingDocument.userid;
    console.log("id 有没?",id)

    if (!id) {
        return res.send({ code: 500, msg: "未配置站长" })
    }

    req["web"] = {};
    req["web"]["webMasterId"] = id
    console.log('站长id', req.web.webMasterId)
    next()


}

module.exports = {
    getWebMasterId
}