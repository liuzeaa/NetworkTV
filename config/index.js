var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/NetworkTV");

var db = mongoose.connection;

db.once("open",function(){
    console.log("数据库成功打开");
});

module.exports = db;