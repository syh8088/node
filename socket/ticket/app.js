// 모듈을 설치 합니다.
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

// 변수를 선언합니다.
var seats = [
	[1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
];

// 웹 서버를 생성합니다.
var app = express();
var server = http.createServer(app);

// 라우트를 수행합니다.
app.get('/', function(req, res, next) {
	fs.readFile('./views/HTMLPage.html', function(error, data){

		//console.log(data);
//		console.log(data.toString());
		res.send(data.toString());
	});
});

app.get('/seats', function(req, res, next){
	res.send(seats);
});

// 웹 서버를 실행합니다.
server.listen(1331, function(){
	console.log('Server Conenct Success');
});

// 소켓 서버를 생성 및 실행합니다.
var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
	socket.on('reserve', function(data){
		//console.log(data);
		//console.log(seats);

		seats[data.y][data.x] = 2;
		io.sockets.emit('reserve', data);
	});
});