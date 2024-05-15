
const SettingModel = require("../../MongoDB/models/SetModel");


const config = require("../../config/config");

module.exports = class SettingServices {
    static async getSetting(webMasterId) {
        try {
            let response = await SettingModel
                .findOne({ userid: webMasterId },{web:true})
            return response;
        } catch (error) {
            return  Promise.reject(error);
        }

    }
    static async getWebMaster(webMasterId) {
        try {
            let response = await SettingModel
                .findOne({ userid: webMasterId },{userid:true})
            return response;
        } catch (error) {
            return  Promise.reject(error);
        }

    }

}