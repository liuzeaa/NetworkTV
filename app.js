var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var db = require("./config/index");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Comment = require('./schemas/comment');
var User = require('./schemas/user');
var index = require('./routes/index');
var user = require('./routes/user');
var comment = require('./routes/comment');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
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
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/comment', comment);
/*var clients ={};
var numClients = 0;
io.on('connection',function (socket) {
    numClients++;
    socket.emit('numClients', { numClients: numClients });
    socket.on('send-message',function(obj) {
        User.findOne({
            name: obj.name,
            isDelected: false
        }, function (err, doc1) {
            if (err1) {
                return;
            }
            var userId = doc1._id;
            if (userId) {
                Comment.create({
                    userId: userId,
                    content: obj.content
                }, function (err2, doc2) {
                    if (err2) {
                        return;
                    }
                    socket.emit('receive-message', obj)
                })
            }
        })
    })
    socket.on('disconnect', function() {
        numClients--;
        socket.emit('numClients', {numClients: numClients});
    });
})*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
