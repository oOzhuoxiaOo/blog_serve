const multer = require('multer') // 文件处理模块包



// 设置文件上传目录和文件名
const storage = multer.diskStorage({
    // 配置文件上传目录
    destination: function (req, file, cb) { //destination: 目的地
        // const uploadPath = path.join(__dirname,'../../static/images/notes')
        // 回调第一个参数为错误对象，设为null标识没有错误
      cb(null, 'static/images/notes') // 文件上传目录 (此处标识应用服务，及app服务再的位置)
    },
    //配置文件保存名称
    filename: function (req, file, cb) { 
      cb(null, Date.now() + '-' + file.originalname) // 文件名
    }
  });

// 设置文件上传目录和文件名
const avatarConfig = multer.diskStorage({
    // 配置文件上传目录
    destination: function (req, file, cb) { //destination: 目的地
        // const uploadPath = path.join(__dirname,'../../static/images/notes')
        // 回调第一个参数为错误对象，设为null标识没有错误
      cb(null, 'static/images/users/avatar') // 文件上传目录 (此处标识应用服务，及app服务再的位置)
    },
    //配置文件保存名称
    filename: function (req, file, cb) { 
      cb(null, Date.now() + '-' + file.originalname) // 文件名
    }
  });

//   md文件
const upload = multer({storage}) //文件处理实例
// user头像
const avatarUpload = multer({storage:avatarConfig})




module.exports = {
    upload,
    avatarUpload
}

