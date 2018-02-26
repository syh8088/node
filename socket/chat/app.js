
/*
// 모듈을 추출합니다.
var http = require('http');
var fs = require('fs');
var express = require('express');
var socketio = require('socket.io');
var conn = require('./config/db')();

// 객체를 선언합니다.
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

// 미들웨어를 설정합니다.
app.use(express.static(`${__dirname}/public`));









// 웹 서버를 만듭니다.
var server = http.createServer(function(req, res) {
	// HTMLPAge.html 파일을 읽습니다.
	fs.readFile('./public/HTMLPage.html', function(error, data) {
		if(error) {
			console.log("에러 발생!!");
			console.log(error);
		}
		res.writeHead(200, {'Content-Type': 'text/html'});




		res.end(data);
	})
}).listen(1331, function() {
		console.log('1331 Connect');
});

		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, [id], function(err, results){
			if(err){
				console.log(err);
				done('There is no user.');
			} else {
				done(null, results[0]);
			}
		});




// 소켓 서버를 만듭니다.
io.sockets.on('connection', function(socket){
	// message 이벤트
	socket.on('message', function(data){
		// 클라이언트의 message 이벤트를 발생시킵니다.
		io.sockets.emit('message', data);
	});
});

*/


var app = require('./config/express')();
var conn = require('./config/db')();

	app.get('/chat', function(req, res){
		var sql = 'SELECT * FROM chat ORDER BY no DESC';
		conn.query(sql, function(err, data, fields){
			//console.log(data);
			res.render('chat', {datas:data});
		});
	});



// auth로 접근 하는 모든 요청에 대해서 auth라는 라이터가 처리하도록 위임
var auth = require('./routes/auth')();
app.use('/auth/', auth);

var socket = require('./config/socket')(app);







// 서버를 실행합니다.
socket.listen(1331, () => {
	console.log('Server Running at http://127.0.0.1:1331');
});