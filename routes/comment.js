var express = require('express');
var router = express.Router();
var Comment = require('../schemas/comment');
var User = require('../schemas/user');
//获取评论列表
router.post('/list',function(req,res,next){
    Comment.find({isDelected:false}).populate('userId').exec(function(err,list){
        if(err){
            res.send(err.message);
            return;
        }
        res.send(list);
    });
})
//新增评论
router.post('/create',function(req,res,next){
    var userName = req.cookies.userName;
    if(req.cookies && req.cookies.userName){
        User.findOne({name:userName,isDelected:false},function(err,item){
            var userId = item._id;
            Comment.create({
                userId:userId,
                content:req.body.content
            },function(err,doc){
                if(err){
                    res.send(err.message);
                    return;
                }
                res.send(doc)
            })
        })
    }
})
module.exports = router;