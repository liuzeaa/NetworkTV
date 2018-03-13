var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var userSchema = Schema({
    nickName:String,
    name:String,
    password:String,
    isAdmin:{type:Boolean,default:false},
    createdAt: {type: Date, default: Date.now },
    updatedAt:Date,
    isDelected:{type:Boolean,default:false}
})

//创建超级管理员账号
var md5 = crypto.createHash("md5");
var newPas = md5.update('123qwe').digest("hex");
var User = mongoose.model("User",userSchema);
User.findOne({name:'admin',isDelected:false,isAdmin:true},function(err,doc){
    if(doc==null){
        var admin = new User({nickName:"超级管理员",name: 'admin',password:newPas,isAdmin:true });
        admin.save(function (err, res) {
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
            }
        });
    }
})
module.exports = User;
