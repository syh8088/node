
/*
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views/mysql');
app.set('view engine', 'jade');
*/
var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

var auth = require('./routes/mysql/auth')(passport);
// auth로 접근 하는 모든 요청에 대해서 auth라는 라이터가 처리하도록 위임
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);  // 애플리케이션 레벨 미들웨어에게 use 통해서 topic이라는 변수가 가르키는 라우트객체에게 위임한다.

var socket = require('./config/mysql/socket')(app);

//app.listen(1331, function(){
socket.listen(1331, function(){
	console.log('Connected, 1331 port!');
})