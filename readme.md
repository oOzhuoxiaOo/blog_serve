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
    - [ ] note
    - [ ] tags
    - [ ] types


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




