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
module.exports = router;