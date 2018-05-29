var express = require('express');
var router = express.Router();
var Comments = require('../schemas/model').Comments

//获取评论列表
router.post('/list',function(req,res,next){
    var date = new Date(new Date().setHours(0, 0, 0, 0));
    Comments.findAll({
        where:{
            isDelete:0,
            createdAt:{
                $gte:date
            }
        }
    }).then(list=>{
        res.send(list);
    }).catch(err=>{
         res.send(err.message);
    })
})
//导出评论
router.post('/export',function(req,res,next){
    Comments.findAll({
        where:{
            isDelete:0
        }
    }).then(list=>{
         res.send(list);
    }).catch(err=>{
         res.send(err.message);
    })
})
//清除评论
router.post('/remove',function(req,res,next){
    Comments.update({isDelete:1},{
        where:{
            isDelete:0,
            createdAt:{
                $lte:new Date()
            }
        }
    }).then(list=>{
        res.send(list)
    }).catch(err=>{
         res.send(err.message);
    })
})
module.exports = router;