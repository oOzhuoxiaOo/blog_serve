// 引入express 包
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./MongoDB/connectDB/db')
const mid_send = require('./middleware/mid_send')
const cookieParser = require('cookie-parser')

const cors = require('cors'); //跨域解决方案


// 导入路由
const routeUser = require('./routes/user/routeUser')
const routeAuth = require('./routes/user/routeAuth')



// 创建应用对象
const app = express();


// 🚩连接数据库


 let resultDb = db();

 
// 🚩设置中间件
app.use(cors({
    // credentials:true, //允许携带凭证(cookie)
    origin:'*',
})) //允许所有源跨域

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 解析cookie 获得token
app.use(cookieParser())

app.use(mid_send.cc)

// 配置静态资源
app.use(express.static(path.resolve(__dirname,'./static')))


// 🚩设置路由
app.use('/api/user',routeUser)
app.use('/api/user',routeAuth)



// 🚩监听端口

app.listen(9000,()=>{
    console.log('server running at http://127.0.0.1:9000')
})

