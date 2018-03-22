var express = require('express');
var pinyin = require('pinyin');
var router = express.Router();
var User = require('../schemas/user');
var crypto = require('crypto');
var fs = require('fs');
let ejsExcel=require('ejsexcel');
var multer = require('multer');
var upload = multer({
    dest: 'public/uploads/'
});
//登录
router.post('/login',function(req,res,next){
    var userName = req.body.name;
    var userPwd = req.body.password;
    var md5 = crypto.createHash("md5");
    var newPas = md5.update(userPwd).digest("hex");
    User.findOne({name:userName,isDelected:false},function(err,doc) {
        if (err) {
            res.send(err.message);
            return
        }
        if (doc != null){
            if(doc.password==newPas){
                res.cookie('isAdmin', doc.isAdmin, {
                    path: '/',
                    maxAge: 1000 * 60 * 60*24*7
                })
                res.cookie('userId', doc._id, {
                    path: '/',
                    maxAge: 1000 * 60 * 60*24*7
                })
                res.cookie("userName", doc.name, {
                    path: '/',
                    maxAge: 1000 * 60 * 60*24*7
                });
                res.cookie("nickName", doc.nickName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60*24*7
                });
                res.send({
                    isAdmin: doc.isAdmin,
                    userId: doc._id,
                    userName: doc.name,
                    nickName: doc.nickName
                });
            }else{
                res.json({
                    status:'0',
                    msg:'密码错误'
                })
            }
        }else{
            res.json({
                status:'1',
                msg:'该用户不存在'
            })
        }
    })
})
//退出
router.post("/logout", function (req,res,next) {
    res.cookie('isAdmin','',{
        path:'/',
        maxAge:1000*60*60*24*7
    })
    res.cookie('userId','',{
        path:'/',
        maxAge:1000*60*60*24*7
    })
    res.cookie("userName",'',{
        path:'/',
        maxAge:1000*60*60*24*7
    });
    res.cookie("nickName",'',{
        path:'/',
        maxAge:1000*60*60*24*7
    });
    res.json({
        status:"0",
        msg:'',
        result:''
    })
});
// 检查登录状态cookies
router.post("/checkLogin", function (req,res,next) {
    if(req.cookies.userName&&req.cookies.nickName&&req.cookies.userId&&req.cookies.isAdmin){
        res.json({
            status:'1',
            msg:'',
            result:{
                isAdmin:req.cookies.isAdmin,
                userId:req.cookies.userId,
                userName:req.cookies.userName,
                nickName:req.cookies.nickName
            }
        });
    }else{
        res.json({
            status:'2',
            msg:'未登录',
            result:''
        });
    }
});
//获取用户列表
router.post('/list', function(req, res, next) {
    let pageIndex = parseInt(req.body.pageIndex);
    let pageSize = parseInt(req.body.pageSize);
    let skip = (pageIndex-1)*pageSize;
    let UserModel = User.find({isDelected:false,isAdmin:false,nickName:new RegExp(req.body.nickName),name:new RegExp(req.body.name)}).skip(skip).limit(pageSize);
    User.find({isDelected:false,isAdmin:false},function(err,list){
        if(err){
            res.send(err.message);
            return;
        }
        UserModel.exec(function (err, list2) {
            if(err){
                res.send(err.message);
                return;
            }

            res.json({
                totalCount:list.length,
                data:list2
            })
        })
    })

});
//新增用户
router.post('/create',function(req, res, next){
    var nickName = req.body.nickName;
    console.log(nickName)
    var md5 = crypto.createHash("md5");
    var newPas = md5.update(req.body.password).digest("hex");
    var name = pinyin(req.body.nickName,{style:pinyin.STYLE_NORMAL}).join(',').replace(/\,/g,'');
    User.findOne({
        name:name
    },function(err,doc){
        if(err){
            res.send(err.message);
            return;
        }
        console.log(doc)
        if(doc){
            if(doc.isDelected){
                User.update({_id:doc._id},{
                    $set:{
                        password:newPas,
                        isDelected:false
                    }
                },function(err,doc){
                    res.json('edit success!');
                })
            }else {
                res.json({
                    status:'1',
                    msg:'用户已存在',
                    result:''
                });
            }
        }else{
            User.create({
                nickName:nickName,
                name:name,
                password:newPas
            },function(err,doc2){
                if(err){
                    res.send(err.message);
                    return;
                }
               res.send(doc2)
            })
        }
    })
})
router.post('/edit/:id',function(req,res,next){
    console.log(req.params.id)
    var password = req.body.password;
    var md5 = crypto.createHash("md5");
    var newPas = md5.update(password).digest("hex");
    User.update({_id:req.params.id},{
        $set:{
            password:newPas,
            updatedAt:new Date()
        }
    },function(err,doc){
        if(err){
            res.send(err.message);
            return;
        }
        res.json('edit success!');
    })
})
router.post("/delete/:id",function(req,res,next){
    User.update({_id:req.params.id},{
        $set:{isDelected:true}
    },function(err,doc){
        if(err){
            res.send(err.message);
            return;
        }
        res.json("delete success!");
    })
})
//导入用户
router.post('/import', upload.single('uploadfile'),function(req,res,next){
    var file = req.file;
    let exBuf=fs.readFileSync(__dirname+'/../'+file.path);
    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        let workBook=exlJson;
        let workSheets=workBook[0].slice(1);
        var nickAry = [];
        workSheets.forEach((item,index)=>{
            var name = pinyin(item[0],{style:pinyin.STYLE_NORMAL}).join(',').replace(/\,/g,'');
            var md5 = crypto.createHash("md5");
            var newPas = md5.update(item[1]).digest("hex");
            nickAry.push({nickName:item[0],name:name,password:newPas});
        })
        User.find({isDelected:false,isAdmin:false},function(err,list){
            if(err){
                res.send(err.message);
                return;
            }
            var intersection = array_intersection(list,nickAry);
            for(var i = 0;i<intersection.length;i++){
                User.remove({
                    nickName:intersection[i].nickName
                },function(err,doc){

                        console.log(doc)
                })
            }
            User.create(nickAry,function(err1,doc2){
                if(err1){
                    res.send(err1.message);
                    return;
                }
                res.redirect('/user')
            })
        })

    }).catch(error=>{
        console.log(error);
    });
})
function array_remove_repeat(a) { // 去重
    var r = [];
    for(var i = 0; i < a.length; i ++) {
        var flag = true;
        var temp = a[i];
        for(var j = 0; j < r.length; j ++) {
            if(temp.nickName === r[j].nickName) {
                flag = false;
                break;
            }
        }
        if(flag) {
            r.push(temp);
        }
    }
    return r;
}
function array_union(a, b) { // 并集
    return array_remove_repeat(a.concat(b));
}
function array_intersection(a, b) { // 交集
    var result = [];
    for(var i = 0; i < b.length; i ++) {
        var temp = b[i];
        for(var j = 0; j < a.length; j ++) {
            if(temp.nickName === a[j].nickName) {
                result.push(temp);
                break;
            }
        }
    }
    return array_remove_repeat(result);
}
module.exports = router;
