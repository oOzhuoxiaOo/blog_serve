const handlePersonalDetail = (req,res)=>{
    console.log('通过token权限验证')
    res.cc('你好:'+ req.user.username)
}

module.exports = {
    handlePersonalDetail
}