
const UserModel = require("../../MongoDB/models/UserModel");
const SetModel = require("../../MongoDB/models/SetModel")
const initSettings = require("../../MongoDB/init/initSettings")

module.exports = class FriendServices {
    static async get(userid) {
        try {
            await initSettings();
            let response = await SetModel.findOne({ userid });
            if (!response) {
                let insertData = {
                    "userid": userid,
                    "web": {
                        "hobby": {
                            "totalTitle": "xx",
                            "totalDescription": "xx",
                            "children": [
                                {
                                    "imgUrl": "https://pic4.zhimg.com/v2-e80b18113caca330b909bf13cf8941a7_r.jpg?source=1940ef5c",
                                    "title": "动漫",
                                    "description": "入坑作《Clannad》,虽然喜欢绘画，奈何长了一双毫无用处的手，无论今后遇到什么难题，我都选择吃饭、睡觉、打豆豆",

                                },
                                {
                                    "imgUrl": "https://www.acgtubao.com/wp-content/uploads/2019/01/50745545_p0.jpg",
                                    "title": "Music",
                                    "description": "喜欢听音乐，尤其是老音乐",

                                },
                                {
                                    "imgUrl": "https://th.bing.com/th/id/OIP.JhlQ9PrVatvoepmHQ7JznAHaHa?rs=1&pid=ImgDetMain",
                                    "title": "Game",
                                    "description": "喜欢打游戏",

                                }
                            ]
                        },
                        "aboutMe": "我是夏娜",
                        "announcement": "欢迎来到我的小站",
                        "originIntroduction": "个人兴趣以及记录",
                        "isTheme": true,
                        "backgroundImage": "https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/3b292df5e0fe9925538aff9c33a85edf8cb1717c.jpg"
                    },
                    "admin": {
                        "webMaster": false,
                        "isTheme": true
                    },

                }

                let insertReult = await SetModel.insertMany( insertData )
                console.log("插入结果", insertReult)
                response = await SetModel.findOne({ userid: userid });
            }
            return response;
        } catch (error) {
            return Promise.reject(error);
        }

    }
    static async updateWeb(userid, updateData) {
        try {
            const response = await SetModel.updateOne({ userid }, { web: updateData })
            return response;
        } catch (error) {
            return Promise.reject(error);
        }

    }
    static async updateAdmin(userid, updateData) {
        try {
            const response = await SetModel.updateOne({ userid }, { admin: updateData })
            return response;
        } catch (error) {
            return Promise.reject(error);
        }

    }

}