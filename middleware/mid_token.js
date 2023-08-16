
const jwt = require('jsonwebtoken')

const {SECRETKEY} = require('../config/config')

const verifyToken = async (req,res,next)=>{
    // 获取token
    const token = req.cookies.token

    if(!token) {
        return res.cc('没有携带token',10) //错误代码10 未携带token
    }
    try{
        // 解析token
        let verifyResult = await jwt.verify(token,SECRETKEY)
        // token验证成功，解码放到user中
        req.user = verifyResult
        console.log('解码token后的user',req.user)
        next()
    }catch(err){
        // token验证失败，返回错误信息
        res.cc('无效的token')
    }

}

module.exports = {
    verifyToken
}