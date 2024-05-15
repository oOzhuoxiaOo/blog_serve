
const UserModel = require("../../MongoDB/models/UserModel");


module.exports = class FriendServices {
    static async getFriendPage(webMasterId, pageWhich, pageNum) {
        try {
            const response = await UserModel
                .findOne({ _id: webMasterId })
                .populate("friends")
                .skip(pageNum * (pageWhich - 1))
                .limit(pageNum)

            return response.friends;
        } catch (error) {
            return  Promise.reject(error);
        }

    }

}