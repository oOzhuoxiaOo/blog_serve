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


        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 标签数🚩 笔记数 类别数
        let notesResult = await NoteModel.find({ userId }, { tags: 1 })
        let distinctTagsResult = await NoteModel.find({ userId }, { tags: 1 }).distinct('tags') //distinct: e:不同的 ,,也可进行去重
        let distinctTypeResult = await NoteModel.find({ userId }, { tags: 1 }).distinct('type') //distinct: e:不同的 ,,也可进行去重
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

        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有标签


        let distinctTagsResult = await NoteModel
            .find({ userId }, { tags: 1 })
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
        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有类别

        let distinctTypesResult = await NoteModel
            .find({ userId }, { type: 1 })
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
        const userId = req.user.userId
        // 个人信息   
        console.log('通过token权限验证')

        // 返回该用户所有类别

        let NotesResult = await NoteModel
            .find({ userId, tags: tagId })
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
        const userId = req.user.userId
        // 个人信息   
        console.log('通过token权限验证')

        // 返回该用户所有类别

        let NotesResult = await NoteModel
            .find({ userId, type: typeId })
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
        // 获取userId,目的是将userid存储笔记字段
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
            userId: resultUser._id,
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
        console.log('通过token权限验证')
        // 获取userId,目的是获取该用户的id用来查找获取笔记
        const resultUser = await UserModel.findOne({ username: req.user.username })
        if (!resultUser) {
            // 如果获取失败(注意，这种失败是查询失败，而不是查询异常错误，异常错误会被try捕获到)
            console.log('数据库——没有该用户信息')
            return res.cc('不存在该用户')
        }
        console.log('数据库——存在该用户信息:', resultUser)

        const pageNum = Math.floor(Number(req.query.pageNum)) //一页数据数
        const pageWhich = Math.floor(Number(req.query.pageWhich)) //第几页

        // 获取添加笔记结果 (日期降序排列)
        let resultNotes = await NoteModel
            .find({ userId: resultUser._id, isDeleted: false })
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

const handleUpload = async (req, res) => {

    console.log('body数据')
    console.log(req.body)
    console.log('file数据')
    console.log(req.file)
    res.json({ code: 0, msg: '提交访问成功' })
}

const handleUserAvatarUpload = async (req, res) => {
    try {
        // 图片处理
        const userId = req.user.userId
        // 如果用户没有上传图片
        let keys = Object.keys(req.file)
        if (!keys.length) {
            return res.json({ code: 400, message: "没有文件上传" })
        }
        // 删除旧头像
        // 从数据库获取旧头像URL
        const oldAvatarInfo = await UserModel
            .findOne({ _id: userId }, { avatar: 1 })
        // 如果存在旧头像，根据旧头像url删除旧头像
        if (oldAvatarInfo.avatar) {
            const oldAvatarPath = path.join(config.DIRNAME, oldAvatarInfo.avatar)
            console.log("oldAvatarPath:", oldAvatarPath)
            await fs.unlink(oldAvatarPath)
        }

        const avatar = req.file.path.replace(/\\/g, '/') //纠正规范图片路径格式

        // 新建文档实例
        const result = await UserModel
            .updateOne({ _id: userId }, { $set: { avatar } })

        res.json({ code: 0, message: "上传成功" })

    } catch (error) {
        console.log('错误情况——', error)
        res.json({ code: 403, message: "上传失败" })
    }
}

const handleDeleteNotesByNoteId = async (req, res) => {
    try {
        let noteId = req.params.noteId
        const userId = req.user.userId
        // 个人信息   
        console.log('通过token权限验证')

        // 返回该用户所有类别
        let NotesResult = await NoteModel
            .updateOne({ _id: noteId }, { isDeleted: true })

        console.log("删除结果1", NotesResult)

        res.json({ code: 204, data: NotesResult })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        // console.log('错误信息:',error)
        res.json({ code: 404, message: "404 Note Fount" })
    }
}

const handleConTypes = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有类别+数

        let distinctTypesResult = await NoteModel
            .aggregate([
                { $match: { userId } },
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
        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
        if (!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有标签+数

        let result = await NoteModel
            .aggregate([
                { $match: { userId } },
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
        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({ _id: userId }, { password: 0 }) //查询个人信息，去掉password字段
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
        const userId = req.user.userId

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

const handlePatchUserById = async (req, res) => {
    try {
        console.log('通过token权限验证')
        const { nickname, email } = req.body
        const userId = req.user.userId
        const id = req.params.id
        // 更新数据事项，目前只支持更新nickname和email
        let updateResult = await UserModel
            .updateOne({ _id: id }, {
                nickname,
                email
            })

        res.json({ code: 0, message: "修改成功", data: updateResult })
    } catch (error) {
        console.log('错误信息:', error)
    }
}

const handleDeleteUserByUserId = async (req, res) => {
    try {
        let deletedUserId = req.params.id
        const userId = req.user.userId
        // 个人信息   
        console.log('通过token权限验证')

        // 删除用户，通过更改用户状态
        let updateResult = await UserModel
            .updateOne({ _id: deletedUserId }, { isDeleted: true })

        console.log("删除结果1", updateResult)

        res.json({ code: 204, message: "删除成功" })

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        // console.log('错误信息:',error)
        res.json({ code: 404, message: "404 Note Fount" })
    }
}

// const handleGetPanel = async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const userInfo = ""
//         const noteInfo = ""

//         const userResult = await UserModel
//             .find({ _id: userId }, { password: 0 })
//         const noteResult = await NoteModel
//             .find({ userId: userId })
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
const handleAddFriendLink = async (req, res) => {
    try {
        const userId = req.user.userId
        // console.log("req.Query",req.query)
        // console.log("req.Body",req.body)
        // 要更新的文档数据
        const addData = {
            imgUrl: req.body.imgUrl || "",
            name: req.body.name || "",
            description: req.body.description || "",
            link: req.body.link || ""
        }
        const insertResult = await FriendModel.insertMany([addData])
        const insertId = insertResult[0]._id
        updateUserResult = await UserModel.updateOne({ _id: userId }, { $push: { "friends": insertId } })
        res.json({ code: 0, message: "提交成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}


const handleUpdateFriendLink = async (req, res) => {
    try {
        const userId = req.user.userId
        const id = req.params.id
        // 要更新的文档数据
        const updateData = {
            imgUrl: req.body.imgUrl,
            name: req.body.name,
            description: req.body.description,
            link: req.body.link
        }
        const updateResult = await FriendModel.updateOne({ _id: id }, updateData)
        res.json({ code: 0, message: "修改成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

const handleGetFriendLink = async (req, res) => {
    try {
        const userId = req.user.userId
        const pageWhich = Math.floor(Number(req.query.pageWhich))
        const pageNum = Math.floor(Number(req.query.pageNum))
        const result = await UserModel
            .findOne({ _id: userId })
            .populate("friends")
            .skip(pageNum * (pageWhich - 1))
            .limit(pageNum)
        res.json({ code: 0, message: "获取成功", data: result.friends })

    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

const handleDeleteFriendLink = async (req, res) => {
    try {
        const userId = req.user.userId
        // 要删除的友情链接id
        const id = req.params.id
        const resultUser = await UserModel.updateOne({ _id: userId }, { $pull: { friends: id } })
        const resultFriend = await FriendModel.deleteOne({ _id: id })
        console.log("resultUser:", resultUser)
        console.log("resultFriend:", resultFriend)
        res.json({ code: 0, message: "删除成功" })

    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}


const handleChart = async (req, res) => {
    try {
        const userId = req.user.userId
        const noteCount = await NoteModel.find({ userId: userId }).count()
        console.log("count1",noteCount)
        const tagCount = await NoteTagModel.find().count();
        console.log("count2",tagCount)
        const typeCount = await NoteTypeModel.find().count();
        console.log("count3",typeCount)
        const friendCount = (await UserModel.findOne({_id:userId})).friends.length
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
const handleUpdateTag = async (req, res) => {
    try {
        const userId = req.user.userId
        const id = req.params.id
        // 要更新的文档数据
        const updateData = {
            tagname: req.body.tagname,
        }
        const updateResult = await NoteTagModel.updateOne({ _id: id }, updateData)
        console.log('tagname:',updateData.tagname)
        res.json({ code: 0, message: "修改成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

const handleDeleteTag = async (req, res) => {
    try {
        const userId = req.user.userId
        const id = req.params.id
        // 要删除的文档id
        const deleteData = {
            _id: req.body._id,
        }
        const deleteResult = await NoteTagModel.deleteOne({ _id: deleteData._id })
        // console.log('tagname:',updateData.tagname)
        res.json({ code: 0, message: "删除成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}
// 类被增删改查
const handleUpdateType = async (req, res) => {
    try {
        const userId = req.user.userId
        const id = req.params.id
        // 要更新的文档数据
        const updateData = {
            typename: req.body.typename,
        }
        const updateResult = await NoteTypeModel.updateOne({ _id: id }, updateData)
        console.log('typename:',updateData.typename)
        res.json({ code: 0, message: "修改成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

// 删除该类别
/**description:
 * 1. 删除该类别
 * 2. 将原该类别的笔记类别id，改为默认类别
 */
const handleDeleteType = async (req, res) => {
    try {
        const userId = req.user.userId
        const id = req.params.id
        // 要删除的文档id
        const deleteData = {
            _id: req.body._id,
        }
        // 删除该类别
        const deleteResult = await NoteTypeModel.deleteOne({ _id: deleteData._id })
        // 得到默认类别id
        const defaultType = await NoteTypeModel.findOne({typename: "default"});
        const defaultTypeId = defaultType._id;
        // 修改笔记所属类别id为默认
        const resultUpdate = await NoteModel.updateMany({type:id},{type:defaultTypeId})
        // console.log('tagname:',updateData.tagname)
        res.json({ code: 0, message: "删除成功" })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

const handleSet = async(req,res)=>{
    try {
        console.log("Set开始")
        const userId = req.user.userId
        //初始化数据
        const initSet = {
            base: {
                webMaster:""
            }
        }
        console.log("body-->",req.body)
        if(!req.body.willUpdateSetData) {
            res.json({ code: 400, message: "没有携带数据",testdata:req.body })
            return;
        }
        
        const willUpdateSetData = JSON.parse(req.body.willUpdateSetData)
        console.log("willUpdateSetData-->",willUpdateSetData)

        // 修改笔记所属类别id为默认
        let targetSetId = "";
        let findedSetDocument = await SetModel.findOne();
        // 如果没有该设置集合，就新增集合(初始化)
        if(!findedSetDocument) {
            const insertResult = await SetModel.insertMany(initSet)
            targetSetId = insertResult._id;
        } else {
            targetSetId = findedSetDocument._id;
        }
        console.log("targetId-->",targetSetId)
        const updateResult = await SetModel.updateMany({_id:targetSetId},willUpdateSetData)
        // console.log("setId是",setId)
        // const resultUpdate = await SetModel.updateMany({type:id},{type:defaultTypeId})
        // console.log('tagname:',updateData.tagname)
        res.json({ code: 0, message: "test bug ok",willUpdateSetData })


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}
const handleGetSet = async(req,res)=>{
    try {
        const userId = req.user.userId

        let findedSetDocument = await SetModel.findOne();
        res.json({ code: 0,data:findedSetDocument})


    } catch (error) {
        res.json({ code: 401, message: "错误" })
        console.log("error:-----", error)
    }
}

module.exports = {
    handlePersonalDetail,
    handlePublish,
    handleNotes,
    handleUpload,
    handleGetTags,
    handleGetTypes,
    handleNotesByTagId,
    handleNotesByTypeId,
    handleIsLogin,
    handleDeleteNotesByNoteId,
    handleConTypes,
    handleConTags,
    handleGetSelfByToken,
    handleGetUsers,
    handlePatchUserById,
    handleDeleteUserByUserId,
    handleUserAvatarUpload,
    handleAddFriendLink,
    handleGetFriendLink,
    handleDeleteFriendLink,
    handleUpdateFriendLink,
    handleChart,
    handleUpdateTag,
    handleDeleteTag,
    handleUpdateType,
    handleDeleteType,
    handleSet,
    handleGetSet,
}