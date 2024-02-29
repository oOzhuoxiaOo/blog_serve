## 功能模块

- [x] 登录注册相关
    - [x] 登录
    - [x] 注册
    - [x] 重置密码
- [ ] 笔记相关
    - [ ] 提交笔记
        - [ ] 类别处理
        - [ ] 标签处理
        - [ ] 笔记内容处理
        - [ ] 笔记图片处理
    - [x] api返回笔记
- [ ] 数据库设计
    - [ ] user
    - [ ] notes
    - [ ] tags
    - [ ] types
- [] 优化
    - [] 服务器上提交时间为同一时间


## 茶楼补缺

---
### 在静态资源中引入模块报错
***报错原因：***
1. 浏览器不支持conmonJs模块化规范

***解决方案：***
1. 使用es6新引入的模块语法
    - 引入script标签时，加上类型type="module",因为浏览年起不支持原生es6,需要告诉浏览器我要使用es6模块了
    - 导入模块时不要只导入模块名，也要加上后缀，比如./math.js
2. 使用打包工具打包
    - webpack
    - vite
---
### 修改密码失败
***date:2023 8.1***
***错误代码:***
```js
// 将明文密码加密
let hashResult = await bcrypt.hash(req.body.password, saltRounds)
```
***解决方案:***
此处加密时错误的传入了原密码，更**改为新密码**即可
```js
// 将明文密码加密
let hashResult = await bcrypt.hash(req.body.newPassword, saltRounds)
```



### 服务器上提交时间为同一时间
未知原因，
resolve: 将默认事件new Data()改为函数式返回new Data()


### 关于项目部署服务器注意事项
1

Multer
Multer 是一个node.js中间件，用于处理 multipart/form-data类型的表单数据，主要用于上传文件。
在form表单上要加上 enctype=“multipart/form-data” 的属性。
Multer 不会处理任何非 multipart/form-data 类型的表单数据。
不要将 Multer 作为全局中间件使用，因为恶意用户可以上传文件到一个你没有预料到的路由，应该只在你需要处理上传文件的路由上使用。
————————————————
版权声明：本文为CSDN博主「蒲公英芽」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/Charissa2017/article/details/105207422