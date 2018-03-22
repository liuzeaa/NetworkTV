var express = require('express');
var router = express.Router();
var Comment = require('../schemas/comment');
var User = require('../schemas/user');

//获取评论列表
router.post('/list',function(req,res,next){
    var date = new Date(new Date().getTime()-1000*60*60*24)
    Comment.find({isDelected:false,createdAt:{$gte:date}}).populate('userId').exec(function(err,list){
        if(err){
            res.send(err.message);
            return;
        }
        res.send(list);
    });
})
router.post('/')
module.exports = router;