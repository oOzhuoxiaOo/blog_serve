
/**
 * 连接数据库
 * 
 */
module.exports = function () {

    return new Promise((resolve, reject) => {

        // 引入mongoose模块
        const mongoose = require('mongoose')

        // 提取配置对象
        const { DBHOST, DBPORT, DBNAME } = require('../../config/config')

        // 3. 连接mongodb服务 '协议名称:host地址:端口号/数据库'
        mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

        // 4. 设置回调
        // 连接成功时的回调
        mongoose.connection.once('open', () => {
            console.log('连接数据库服务——成功')
            resolve();
        })

        //设置连接失败时的回调
        mongoose.connection.on('error', () => {
            console.log('连接数据库服务——失败')
            reject();
        })

        //设置连接关闭时的回调
        mongoose.connection.on('close', () => {
            console.log('连接关闭')
        })



    }

    )



}
