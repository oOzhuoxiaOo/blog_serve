const NoteTagModel = require('../../MongoDB/models/NoteTagModel')
const NoteModel = require('../../MongoDB/models/NoteModel')
const NoteTypeModel = require('../../MongoDB/models/NoteTypeModel')
const UserModel = require('../../MongoDB/models/UserModel')
const config = require('../../config/config')
const path = require('path')


/**
 * @returnJson 个人信息集合
 */
const handlePersonalDetail = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')


        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({_id:userId},{password:0}) //查询个人信息，去掉password字段
        if(!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 标签数🚩 笔记数 类别数
        let notesResult = await NoteModel.find({userId},{tags:1})
        let distinctTagsResult = await NoteModel.find({userId},{tags:1}).distinct('tags') //distinct: e:不同的 ,,也可进行去重
        let distinctTypeResult = await NoteModel.find({userId},{tags:1}).distinct('type') //distinct: e:不同的 ,,也可进行去重
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
            userInfo:findUserResult,
            noteInfo: {
                tagsCount,
                notesCount,
                typeCount
            }
        }

        res.json({code:0,data: personalInfo})

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:',error)
    }



}

const handleGetTags = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')

        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({_id:userId},{password:0}) //查询个人信息，去掉password字段
        if(!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有标签
        

        let distinctTagsResult = await NoteModel
        .find({userId},{tags:1})
        .distinct('tags') //distinct: e:不同的 ,,也可进行去重

        console.log('dist:----tags',distinctTagsResult)

        let tagsResult = await NoteTagModel.find({_id:{$in: distinctTagsResult}})

        res.json({code:0,data:tagsResult})

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:',error)
    }

}

const handleGetTypes = async (req, res) => {
    try {
        // 个人信息   
        console.log('通过token权限验证')
        const userId = req.user.userId
        let findUserResult = await UserModel.findOne({_id:userId},{password:0}) //查询个人信息，去掉password字段
        if(!findUserResult) {
            console.log('查询用户信息失败')
            return res.cc('不存在该用户')
        }

        // 返回该用户所有类别
        
        let distinctTypesResult = await NoteModel
        .find({userId},{type:1})
        .distinct('type') //distinct: e:不同的 ,,也可进行去重

        let typesResult = await NoteTypeModel.find({_id:{$in: distinctTypesResult}})

        res.json({code:0,data:typesResult})

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:',error)
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
        .find({userId,tags:tagId})
        .sort({createTime:-1})

      

        res.json({code:0,data:NotesResult})

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:',error)
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
        .find({userId,type:typeId})
        .sort({createTime:-1})

      

        res.json({code:0,data:NotesResult})

        // res.cc('你好:' + req.user.username)
    } catch (error) {
        console.log('错误信息:',error)
    }

}


const handlePublish = async (req, res) => {
    try {
        // 图片处理
        // 如果用户没有上传图片
        let imgFile = req.file
        if(req.file == undefined){
            imgFile ={
                isHasImg:false
            }
        } else {
            imgFile.isHasImg = true
            imgFile.path = imgFile.path.replace(/\\/g,'/') //纠正规范图片路径格式
        }


        // 标签处理
        const tags = JSON.parse(req.body.tags)
        const newTagIds = []
        const existingTagIds = []
        // 遍历存储插入收集标签数据
        console.log('tags数据:',tags)
        for(const tagname of tags){
            // 查找标签是否以存在
            let tag = await NoteTagModel.findOne({tagname})

            // 不存在则追加新标签
            if(!tag) {
                tag = await NoteTagModel.create({tagname})
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
        let resultType = await NoteTypeModel.findOne({typename})

        // 如果不存在该标签
        if(!resultType) {
            // 插入该标签
            resultType = await NoteTypeModel.create({typename})
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
        console.log('数据库——存在该用户信息:',resultUser)

        // 新建文档实例
        const docNote = new NoteModel({
            username: req.user.username,
            userId:resultUser._id,
            title: req.body.title,
            description: req.body.description,
            mdHtml: req.body.mdHtml,
            tags:tag_ids,
            type: resultType._id,
            img: imgFile
        })
        // 持久化保存到数据库
        let newNote = await docNote.save()

        if(!newNote) {
            console.log('数据库——添加用户信息失败')
            return res.cc('新笔记添加失败')
        }
        res.cc('笔记添加成功', 0)
        console.log('新笔记已添加', newNote)

        

    } catch (error) {
        console.log('错误情况——',error)
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
        console.log('数据库——存在该用户信息:',resultUser)

        const pageNum = Math.floor(req.query.pageNum) //一页数据数
        const pageWhich = Math.floor(req.query.pageWhich) //第几页

        // 获取添加笔记结果 (日期降序排列)
        let resultNotes = await NoteModel
        .find({userId:resultUser._id})
        .sort({createTime:-1})
        .skip(pageNum * (pageWhich - 1)) //跳过页数
        .limit(pageNum) // 截取一页数据
        .populate('tags') //填充关联数据 (populate:迁移)
        .populate('type') //填充关联数据 (populate:迁移)

        if(!resultNotes) {
            console.log('数据库——没有该用户笔记')
            return res.cc('没有该用户笔记')
        }
        
        // 加工下笔记图片地址
        for(let i = 0;i<resultNotes.length;i++){
            const item = resultNotes[i]
             // 如果存在图
             if(item.img.isHasImg){
                console.log('是否进入有img循坏')
                const imgPath = item.img.path //img对象的path路径
                const {DOMAIN} = config //域名
                // 将静态资源目录名替换为空，并将域名拼接
                const imgUrl = 'http://' + DOMAIN + imgPath.replace('static','') 
                item.img.imgUrl = imgUrl //将图片url地址给原对象
            }
        }
        
        // 标签

        res.json({code:0,msg:'笔记查找成功',data:resultNotes})
        console.log('笔记查找成功', resultNotes[0])
        console.log('@query',req.query)

    } catch (error) {
        console.log('错误情况——',error)
    }

}

const handleUpload = async (req,res)=>{
    
    console.log('body数据')
    console.log(req.body)
    console.log(req.file)
    res.json({code:0,msg:'提交访问成功'})
}








module.exports = {
    handlePersonalDetail,
    handlePublish,
    handleNotes,
    handleUpload,
    handleGetTags,
    handleGetTypes,
    handleNotesByTagId,
    handleNotesByTypeId
}