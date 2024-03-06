const NoteTagModel = require('../../MongoDB/models/NoteTagModel')
const NoteModel = require('../../MongoDB/models/NoteModel')
const NoteTypeModel = require('../../MongoDB/models/NoteTypeModel')
const UserModel = require('../../MongoDB/models/UserModel')
const FriendModel = require('../../MongoDB/models/FriendModel')
const SetModel = require('../../MongoDB/models/SetModel')

const config = require('../../config/config')
const path = require('path')
const fs = require("node:fs/promises")





/**
 * @returnJson 个人信息集合
 */
const handlePersonalDetail = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 标签数🚩 笔记数 类别数
        let notesResult = await NoteModel.find({ userId:webMasterId }, { tags: 1 })
        let distinctTagsResult = await NoteModel.find({ userId:webMasterId }, { tags: 1 }).distinct('tags') //distinct: e:不同的 ,,也可进行去重
        let distinctTypeResult = await NoteModel.find({ userId:webMasterId }, { tags: 1 }).distinct('type') //distinct: e:不同的 ,,也可进行去重
        let tagsCount = distinctTagsResult.length
        let notesCount = notesResult.length
        let typeCount = distinctTypeResult.length

        // for(let i = 0; i < NotesResult.length; i++) {
        //     let tags = NotesResult[i].tags
        //     for(let val of tags) {
        //         // 将new Objectid转为字符串再传入_tagsArr数组
        //         _tagsArr.push(val.toString())
        //     }
        // }
        // 数组去重
        // let tagsArr = Array.from(new Set(arr))
        // let tagsCount = tagsArr.length




        // 个人信息集合
        let personalInfo = {
            userInfo: findUserResult,
            noteInfo: {
                tagsCount,
                notesCount,
                typeCount
            }
        }

        res.json({ code: 0, data: personalInfo })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }



}
const handleIsLogin = async (req, res) => {
    res.json({ code: 0, msg: '已登录' })
}

const handleGetTags = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')

        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有标签


        let distinctTagsResult = await NoteModel
            .find({ webMasterId }, { tags: 1 })
            .distinct('tags') //distinct: e:不同的 ,,也可进行去重

        console.log('dist:----tags', distinctTagsResult)

        let tagsResult = await NoteTagModel.find({ _id: { $in: distinctTagsResult } })

        res.json({ code: 0, data: tagsResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }

}

const handleGetTypes = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有类别

        let distinctTypesResult = await NoteModel
            .find({ webMasterId }, { type: 1 })
            .distinct('type') //distinct: e:不同的 ,,也可进行去重

        let typesResult = await NoteTypeModel.find({ _id: { $in: distinctTypesResult } })

        res.json({ code: 0, data: typesResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }

}
// 根据标签id获取笔记
const handleNotesByTagId = async (req, res) => {
    try {

        let tagId = req.params.tagId
        const webMasterId= req.web.webMasterId
        // 个人信息   
        console.log('通过token权限验证')

        // 返回该用户所有类别

        let NotesResult = await NoteModel
            .find({ webMasterId, tags: tagId })
            .sort({ createTime: -1 })



        res.json({ code: 0, data: NotesResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }

}
// 根据类别id获取笔记
const handleNotesByTypeId = async (req, res) => {
    try {
        let typeId = req.params.typeId
        const webMasterId= req.web.webMasterId
        // 个人信息   
        console.log('通过token权限验证')

        // 返回该用户所有类别

        let NotesResult = await NoteModel
            .find({ webMasterId, type: typeId })
            .sort({ createTime: -1 })



        res.json({ code: 0, data: NotesResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }

}


const handlePublish = async (req, res) => {
    try {
        // 图片处理
        // 如果用户没有上传图片
        let imgFile = req.file
        if (req.file == undefined) {
            imgFile = {
                isHasImg: false
            }
        } else {
            imgFile.isHasImg = true
            imgFile.path = imgFile.path.replace(/\\/g, '/') //纠正规范图片路径格式
        }


        // 标签处理
        const tags = JSON.parse(req.body.tags)
        const newTagIds = []
        const existingTagIds = []
        // 遍历存储插入收集标签数据
        console.log('tags数据:', tags)
        for (const tagname of tags) {
            // 查找标签是否以存在
            let tag = await NoteTagModel.findOne({ tagname })

            // 不存在则追加新标签
            if (!tag) {
                tag = await NoteTagModel.create({ tagname })
                // 将追加后新标签的索引收集
                newTagIds.push(tag._id)
            } else {
                // 存在则收集以存在该标签的索引
                existingTagIds.push(tag._id)
            }
        }
        // 合并标签索引 
        const tag_ids = existingTagIds.concat(newTagIds)


        // 类别处理
        const typename = req.body.typename
        // 查找是否唯一
        let resultType = await NoteTypeModel.findOne({ typename })

        // 如果不存在该标签
        if (!resultType) {
            // 插入该标签
            resultType = await NoteTypeModel.create({ typename })
        }



        // 添加笔记处理
        // console.log('————笔记添加功能————')
        // console.log('通过token权限验证')
        // 获取webMasterId,目的是将webMasterId存储笔记字段
        const resultUser = await UserModel.findOne({ username: req.user.username })
        if (!resultUser) {
            // 如果获取失败(注意，这种失败是查询失败，而不是查询异常错误，异常错误会被try捕获到)
            console.log('数据库——没有该用户信息')
            return res.cc('不存在该用户')
        }
        console.log('数据库——存在该用户信息:', resultUser)

        // 新建文档实例
        const docNote = new NoteModel({
            username: req.user.username,
            webMasterId: resultUser._id,
            title: req.body.title,
            description: req.body.description,
            mdHtml: req.body.mdHtml,
            tags: tag_ids,
            type: resultType._id,
            img: imgFile
        })
        // 持久化保存到数据库
        let newNote = await docNote.save()

        if (!newNote) {
            console.log('数据库——添加用户信息失败')
            return res.cc('新笔记添加失败')
        }
        res.cc('笔记添加成功', 0)
        console.log('新笔记已添加', newNote)



    } catch (error) {
        console.log('错误情况——', error)
    }

}



const handleNotes = async (req, res) => {
    try {

        console.log('————查找笔记s功能———')
        
        const webMasterId= req.web.webMasterId
        const pageNum = Math.floor(Number(req.query.pageNum)) //一页数据数
        const pageWhich = Math.floor(Number(req.query.pageWhich)) //第几页

        // 获取添加笔记结果 (日期降序排列)
        let resultNotes = await NoteModel
            .find({ userId: webMasterId, isDeleted: false })
            .select('')
            .sort({ createTime: -1 })
            .skip(pageNum * (pageWhich - 1)) //跳过页数
            .limit(pageNum) // 截取一页数据
            .populate('tags') //填充关联数据 (populate:迁移)
            .populate('type') //填充关联数据 (populate:迁移)

        if (!resultNotes) {
            console.log('数据库——没有该用户笔记')
            return res.cc('没有该用户笔记')
        }

        // 加工下笔记图片地址
        for (let i = 0; i < resultNotes.length; i++) {
            const item = resultNotes[i]
            // 如果存在图
            if (item.img.isHasImg) {
                console.log('是否进入有img循坏')
                const imgPath = item.img.path //img对象的path路径
                const { DOMAIN } = config //域名
                // 将静态资源目录名替换为空，并将域名拼接
                const imgUrl = 'http://' + DOMAIN + imgPath.replace('static', '')
                item.img.imgUrl = imgUrl //将图片url地址给原对象
            }
        }

        // 标签

        res.json({ code: 0, msg: '笔记查找成功', data: resultNotes })
        console.log('笔记查找成功', resultNotes[0])
        console.log('@query', req.query)

    } catch (error) {
        console.log('错误情况——', error)
    }

}




const handleConTypes = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有类别+数

        let distinctTypesResult = await NoteModel
            .aggregate([
                { $match: { webMasterId } },
                { $group: { _id: "$type", count: { $sum: 1 } } },
                { $lookup: { from: "types", localField: "_id", foreignField: "_id", as: "typeInfo" } },
                { $project: { typename: "$typeInfo.typename", count: 1 } },
                { $unwind: "$typename" }
            ])


        // let typesResult = await NoteTypeModel.find({ _id: { $in: distinctTypesResult } })

        res.json({ code: 0, message: "请求成功", data: distinctTypesResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }
}




const handleConTags = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有标签+数

        let result = await NoteModel
            .aggregate([
                { $match: { webMasterId } },
                { $unwind: "$tags" },
                { $group: { _id: "$tags", count: { $sum: 1 } } },
                { $lookup: { from: "tags", localField: "_id", foreignField: "_id", as: "tagInfo" } },
                { $project: { tagname: "$tagInfo.tagname", count: 1 } },
                { $unwind: "$tagname" }
            ])

        // let typesResult = await NoteTypeModel.find({ _id: { $in: distinctTypesResult } })

        res.json({ code: 0, message: "请求成功", data: result })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:', error)
    }
}

// 个人信息
const handleGetSelfByToken = async (req, res) => {
    try {
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId
        let findUserResult = await UserModel.findOne({ _id: webMasterId }, { password: 0 }) //查询个人信息，去掉password字段
        console.log("FindUserResult", findUserResult)
        // 如果没有设置头像，直接响应
        if (!findUserResult.avatar) {
            return res.json({ code: 0, message: "请求成功", data: findUserResult })
        }
        // 如果设置头像了 补全头像路径
        findUserResult.avatar = "http://" + config.DOMAIN + "/" + findUserResult.avatar.replace(/static\//g, "")
        res.json({ code: 0, message: "请求成功", data: findUserResult })

    } catch (error) {
        console.log('错误信息:', error)
    }
}

// 获取所有用户信息
const handleGetUsers = async (req, res) => {
    try {
        console.log('通过token权限验证')
        const webMasterId= req.web.webMasterId

        if(!req.query.pageNum || !req.query.pageWhich) {
            let findUserResult = await UserModel.find();
            res.json({ code: 0, message: "请求成功", data: findUserResult });
            return;
        }
        const pageNum = Math.floor(Number(req.query.pageNum)) //一页数据数
        const pageWhich = Math.floor(Number(req.query.pageWhich)) //第几页

        let findUserResult = await UserModel
            .find({ isDeleted: false }, { password: 0, __v: 0 }) //查询个人信息，去掉password字段
            .skip((pageWhich - 1) * pageNum)
            .limit(pageNum)
        console.log("FindUserResult", findUserResult)
        res.json({ code: 0, message: "请求成功", data: findUserResult })
    } catch (error) {
        console.log('错误信息:', error)
    }
}





// const handleGetPanel = async (req, res) => {
//     try {
//         const webMasterId= req.web.webMasterId;
//         const userInfo = ""
//         const noteInfo = ""

//         const userResult = await UserModel
//             .find({ _id: webMasterId }, { password: 0 })
//         const noteResult = await NoteModel
//             .find({ webMasterId: webMasterId })
//         const tagResult = await NoteTagModel.find({})
//         const typeResult = await NoteTypeModel.find({})

//         const sendRes = res.json(
//             {
//                 code: 0,
//                 message: "请求成功",
//                 data: {
//                     noteCount: noteResult.count(),
//                     typeCount:typeResult.count(),
//                     tagCount:tagResult.count(),
//                 }
//             }
//         )
//     } catch (error) {

//     }
// }





const handleGetFriendLink = async (req, res) => {
    try {
        const webMasterId= req.web.webMasterId
        const pageWhich = Math.floor(Number(req.query.pageWhich))
        const pageNum = Math.floor(Number(req.query.pageNum))
        const result = await UserModel
            .findOne({ _id: webMasterId })
            .populate("friends")
            .skip(pageNum * (pageWhich - 1))
            .limit(pageNum)

            console.log("friends--------------");
        res.json({ code: 0, message: "获取成功", data: result.friends })

    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}




const handleChart = async (req, res) => {
    try {
        const webMasterId= req.web.webMasterId
        const noteCount = await NoteModel.find({ webMasterId: webMasterId }).count()
        console.log("count1",noteCount)
        const tagCount = await NoteTagModel.find().count();
        console.log("count2",tagCount)
        const typeCount = await NoteTypeModel.find().count();
        console.log("count3",typeCount)
        const friendCount = (await UserModel.findOne({_id:webMasterId})).friends.length
        console.log("count4",friendCount)
        const resultData = {
            noteCount,
            tagCount,
            typeCount,
            friendCount
        }
        console.log("resultData----------",resultData)
        res.json({ code: 0, message: "获取成功", data: resultData })
    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

// 标签增删改查

// 类被增删改查





const handleGetSet = async(req,res)=>{
    try {
        const webMasterId= req.web.webMasterId

        let findedSetDocument = await SetModel.findOne();
        res.json({ code: 0,data:findedSetDocument})


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

const handlePostComment = async(req,res)=>{
    try {
        const commentType = req.body.type;
        let message = "";
        // 如果为1，则为一级评论
        if(commentType == 1) {
            const commentOneItem = {
                nickname:req.body.nickname,
                email:req.body.email,
                content:req.body.content,
            }
            // 给笔记添加评论
            const updateData = await NoteModel.updateOne({_id:req.body.noteid},{
                $push: {comments:commentOneItem }
            })
            message = "一级评论成功"
        }
        // 如果为2，则为二级评论
        if(commentType == 2) {
            const commentTwoItem = {
                nickname:req.body.nickname,
                email:req.body.email,
                content:req.body.content,
                who:req.body.who,
                targetNickName:req.body.targetNickName
            }
            // 给笔记添加二级评论
            const updateData = await NoteModel.updateOne(
                {_id:req.body.noteid, "comments._id":req.body.who},
                { $push: {"comments.$.children": commentTwoItem }
            })
            message = "二级评论成功"
        }
        const webMasterId= req.web.webMasterId
        res.json({ code: 0,message})


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

module.exports = {
    handlePersonalDetail,
    handlePublish,
    handleNotes,
    handleGetTags,
    handleGetTypes,
    handleNotesByTagId,
    handleNotesByTypeId,
    handleIsLogin,
    handleConTypes,
    handleConTags,
    handleGetSelfByToken,
    handleGetUsers,
    handleGetFriendLink,
    handleChart,
    handleGetSet,
    handlePostComment,

}