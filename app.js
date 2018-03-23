var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require("./config/index");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user = require('./routes/user');
var comment = require('./routes/comment');
var Comment = require('./schemas/comment')
var User = require('./schemas/user');
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express)
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.render('wap/login',{title:'登录'});
    }else{
        res.render('web/login',{title:'登录'});
    }
});

app.get('/video', function(req, res, next) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.render('wap/video',{title:'在线直播'});
    }else{
        res.render('web/video',{title:'在线直播'});
    }
});
app.get('/user', function(req, res, next) {
    res.render('web/user',{title:'用户管理'});
});

app.use('/user', user);
app.use('/comment', comment);
server.listen(80);
// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;

io.on('connection', function(socket) {
    socket.on('login', function(obj) {
        // 将新加入用户的唯一标识当作socket的名称 obj userid,username,nickName
        socket.name = obj.userid;
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
        // 向所有客户端广播用户加入
        io.emit('login', {
            onlineUsers: onlineUsers,
            onlineCount: onlineCount,
            user: obj
        });
        console.log(obj.username + '加入聊天室');
    })

    //监听用户退出
    socket.on('disconnect', function() {
        //将退出的用户从在线列表中删除
        if (onlineUsers.hasOwnProperty(socket.name)) {
            // 退出用户的信息
            var obj = {
                userid: socket.name,
                username: onlineUsers[socket.name]
            }
            // 删除
            delete onlineUsers[socket.name]
            onlineCount--;
            io.emit('login', {
                onlineUsers: onlineUsers,
                onlineCount: onlineCount,
                user: obj
            });
            console.log(obj.username + '退出了聊天室');
        }
    })
    // 监听用户发布聊天内容
    socket.on('message', function(obj) {
        //obj userId content
        Comment.create(obj,function(err,data){
            if(err){
                console.log(err);
                return;
            }
            io.emit('message', {
                nickName:obj.nickName,
                content:obj.content,
                createdAt:new Date()
            });
        })
    });
})
