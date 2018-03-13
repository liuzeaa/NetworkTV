var express = require('express');
var pinyin = require('pinyin');
var router = express.Router();
var User = require('../schemas/user');
var crypto = require('crypto');
//登录
router.post('/login',function(req,res,next){
    var userName = req.body.name;
    var userPwd = req.body.password;
    console.log(userName);
    var md5 = crypto.createHash("md5");
    var newPas = md5.update(userPwd).digest("hex");
    User.findOne({name:userName,password:newPas,isDelected:false},function(err,doc){
        if(err){
            res.send(err.message);
            return
        }
        res.cookie('isAdmin',doc.isAdmin,{
            path:'/',
            maxAge:1000*60*60
        })
        res.cookie('userId',doc._id,{
            path:'/',
            maxAge:1000*60*60
        })
        res.cookie("userName",doc.name,{
            path:'/',
            maxAge:1000*60*60
        });
        res.cookie("nickName",doc.nickName,{
            path:'/',
            maxAge:1000*60*60
        });
        res.send({
            isAdmin:doc.isAdmin,
            userId:doc._id,
            userName:doc.name,
            nickName:doc.nickName
        });
    })
})
//退出
router.post("/logout", function (req,res,next) {
    res.cookie('isAdmin','',{
        path:'/',
        maxAge:1000*60*60
    })
    res.cookie('userId','',{
        path:'/',
        maxAge:1000*60*60
    })
    res.cookie("userName",'',{
        path:'/',
        maxAge:1000*60*60
    });
    res.cookie("nickName",'',{
        path:'/',
        maxAge:1000*60*60
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
  User.find({isDelected:false,isAdmin:false},function(err,list){
    if(err){
        res.send(err.message);
        return;
    }
    res.send(list);
  })
});
//新增用户
router.post('/create',function(req, res, next){
    var nickName = req.body.nickName;
    console.log(nickName)
    var md5 = crypto.createHash("md5");
    var newPas = md5.update('123qwe').digest("hex");
    var name = pinyin(req.body.nickName,{style:pinyin.STYLE_NORMAL}).join(',').replace(/\,+/,'');
    User.findOne({
        name:name
    },function(err,doc){
        if(err){
            res.send(err.message);
            return;
        }
        if(doc){
            res.json({
                status:'1',
                msg:'用户已存在',
                result:''
            });
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
router.post('/import',function(req,res,next){

})
module.exports = router;
