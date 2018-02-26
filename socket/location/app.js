// 모듈을 추출합니다.
var fs = require('fs');
var http = require('http');
var express = require('express');

var socketio = require('socket.io');


var mysql = require('mysql');

var cors = require('cors');



// 데이터베이스와 연결합니다.
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '======',
	database : 'syh8088'
});

// 웹 서버를 생성합니다.
var app = express();

app.use(cors());

var server = http.createServer(app);




// GET - /tracket
app.get('/tracker', function(req, res){
	// Tracker.html 파일을 제공합니다.
	fs.readFile('./views/Tracker.html', function(error, data){
		res.send(data.toString());
	});
});

// GET - /observer
app.get('/observer', function(req, res){
	// Observer.html 파일을 제공합니다.
	fs.readFile('./views/Observer.html', function(error, data){
		res.send(data.toString());
	});
});

// GET - /Showdata
app.get('/showdata', function(req, res){
	// 데이터베이스의 데이터를 제공합니다.
	conn.query('SELECT * FROM locations WHERE name=?', [req.params.name],
		function(error, data){
			res.send(data);
		}
	);
});

// 웹 서버를 실행합니다.
server.listen(1331, function(){
	console.log('Server Connect Success');
});

// 소켓 서버를 생성 및 실행합니다.
io = socketio.listen(server);
io.sockets.on('connection', function(socket){

	// join 이벤트
	socket.on('join', function(data){
		socket.join(data);
	});


	// location 이벤트
	socket.on('location', function(data){
		// 데이터를 삽입합니다.
		conn.query('INSERT INTO locations(name, latitude, longitude, date) VALUES(?, ?, ?, NOW())', [data.name, data.latitude, data.longitude]);

		// receive 이벤트를 발생시킵니다.
		io.sockets.in(data.name).emit('receive', {
			latitude: data.latitude,
			longitude: data.longitude,
			date: Date.now()
		});
	});
});

