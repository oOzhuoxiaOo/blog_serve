// 配置文件
const path = require("path")
module.exports = {
    DBHOST:'127.0.0.1',
    DOMAIN:'127.0.0.1:9000',
    DBPORT:'27017',
    DBNAME:'blog',
    SECRETKEY:'xiana',
    DIRNAME:path.join(__dirname,"../")
}