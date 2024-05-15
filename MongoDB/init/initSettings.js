const SetModel = require("../models/SetModel")
module.exports = async function initSettings() {
    try {
        const response = await SetModel.findOne({});
        if (!response) {
            const insertData = {
                userid: "64cce1a209f142772b4e8638",
                web: {
                    aboutMe: "我是夏娜",
                    announcement: "空的",
                    originIntroduction: "空的",
                    isTheme: true,
                    backgroundImage: "xxx",
                    hobby: {
                        totalTitle: "前端开发",
                        totalDescription: "2年半练习生",
                        children: [
                            {
                                imgUrl: "xxx",
                                title: "爱好1",
                                description: "描述1"
                            },
                            {
                                imgUrl: "xxx",
                                title: "爱好2",
                                description: "描述2"
                            },
                            {
                                imgUrl: "xxx",
                                title: "爱好3",
                                description: "描述3"
                            }
                        ]
                    }
                },
                admin: {
                    webMaster: true,
                    isTheme: true,
                }
            }
            const response1 = await SetModel.insertMany([insertData])
        }
    } catch (error) {
        console.log(error)
    }
}