
const cc = (req,res,next)=>{
    res.cc = (msg='未配置信息',code = 1)=>{
        res.json({code,msg})
    }
    next()
}



module.exports = {
    cc
}