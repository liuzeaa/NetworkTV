var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{title:'登录'});
});
router.get('/index', function(req, res, next) {
    res.render('index',{title:'在线直播'});
});
router.get('/user', function(req, res, next) {
    res.render('user',{title:'用户管理'});
});
module.exports = router;
