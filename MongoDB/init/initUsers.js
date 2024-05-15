const UserModel = require("../models/UserModel")
module.exports = async function initUsers(){
    try {
        const response = await UserModel.findOne();
    } catch (error) {
        console.log(error)
    }
}