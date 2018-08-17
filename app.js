var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require("./config/index");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
let FileStreamRotator = require('file-stream-rotator');
var user = require('./routes/user');
var comment = require('./routes/comment');
var Comment = require('./schemas/comment')
var User = require('./schemas/user');

const compression = require('compression');
app.use(compression());

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
/*
* 增加日志文件
* */
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// 日志分割流
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express)
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{maxAge:1000*60*60}));

app.get('/', function(req, res, next) {
    isMobile(req,function(){
        res.render('wap/login',{title:'登录'});
    },function(){
        res.render('web/login',{title:'登录'});
    })
});

app.get('/video', function(req, res, next) {
    isMobile(req,function(){
        res.render('wap/video',{title:'在线直播'});
    },function(){
        res.render('web/video',{title:'在线直播'});
    })
});
function isMobile(req,mobileCb,pcCb){
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        mobileCb()
    }else{
        pcCb();
    }
}
app.get('/user', function(req, res, next) {
    res.render('web/user',{title:'用户管理'});
});

app.use('/user', user);
app.use('/comment', comment);
server.listen(3000);
// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;

io.on('connection', function(socket) {
    onlineCount++;
    // 向所有客户端广播用户加入
    io.emit('login', {
        onlineCount: onlineCount
    });

    //监听用户退出
    socket.on('disconnect', function() {
        onlineCount--;
        io.emit('login', {
            onlineCount: onlineCount
        });
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
