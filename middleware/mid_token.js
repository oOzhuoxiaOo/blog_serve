
const jwt = require('jsonwebtoken')

const {SECRETKEY} = require('../config/config')

const verifyToken = async (req,res,next)=>{
    // 获取token
    const token = req.headers.authorization

    if(!token) {
        return res.send({code:401,msg:"没有携带token"}) //错误状态吗401 未携带token(登录授权)
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
        return res.send({code:401,msg:"无效的token"})
    }

}

module.exports = {
    verifyToken
}