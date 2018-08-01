var express = require('express');
var router = express.Router();
var Comment = require('../schemas/comment');

//获取评论列表
router.post('/list',function(req,res,next){
    var date = new Date(new Date().setHours(0, 0, 0, 0));
    Comment.find({isDelected:false,createdAt:{$gte:date}}).exec(function(err,list){
        if(err){
            res.send(err.message);
            return;
        }
        res.send(list);
    });
})
//导出评论
router.post('/export',function(req,res,next){
    Comment.find({isDelected:false}).exec(function(err,list){
        if(err){
            res.send(err.message);
            return;
        }
        res.send(list);
    });
})
//清除评论
router.post('/remove',function(req,res,next){
    Comment.update({isDelected:false,createdAt:{$lte:new Date()}},{
        isDelected:true
    },function(err,doc){
        if(err){
            res.send(err.message);
            return;
        }
        res.json("delete success!");
    })
})
module.exports = router;