const db = require("./db/db");
const mongoose = require("mongoose");
const BookModel = require("./models/BookModel");


// 连接数据库
db()
  .then(() => {
    // 连接成功后做的事

    //  读取文档
    //  读取符合要求找到的所有文档
    BookModel.find({ name: "偷星九月天" })
      .then((data) => {
        console.log(data);
        mongoose.disconnect();
      })
      .catch((err) => {
        console.log(err);
        mongoose.disconnect();
      });
  })
  .catch(() => {
    // 连接失败后做的事
  });
