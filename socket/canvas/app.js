// 모듈을 추출합니다.
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '======',
	database : 'syh8088'
});
conn.connect();


// 웹 서버를 생성 합니다.
var app = express();
app.use(express.static('pubilc'));

// 웹 서버를 실행합니다.
var server = http.createServer(app);
server.listen(1331, function() {
	console.log('1331 Connect Success');
});

// 라우트를 수행합니다.
app.get('/', function(req, res){
	fs.readFile('./views/Lobby.html', function(error, data){
		res.send(data.toString());
	});
});

app.get('/canvas/:room', function(req, res){
	fs.readFile('./views/Canvas.html', 'utf8', function(error, data){

		var sql = 'SELECT imgBase64 FROM canvas WHERE room=?';
		conn.query(sql, [req.params.room], function(err, imgBase64, fields){


//console.log(imgBase64[0].imgBase64);

			res.send(ejs.render(data, {
				room: req.params.room,
				imgBase64: imgBase64[0].imgBase64
			}));

//			io.sockets.emit('load', imgBase64);
		});







	});






});

app.get('/room', function(req, res){
	var rooms = Object.keys(io.sockets.adapter.rooms).filter(function(item){
		return item.indexOf('/') < 0;
	});
	res.send(rooms);
});

// 소켓 서버를 생성합니다.
var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
	var roomId = '';

	socket.on('join', function(data){
		socket.join(data);
		roomId = data;
		io.sockets.in(roomId).emit('line', data);

	});

	socket.on('draw', function(data){
		io.sockets.in(roomId).emit('line', data);
	});




	socket.on('create_room', function(data){

		var sql = "INSERT INTO canvas (room) VALUES(?)";
		conn.query(sql, [data], function(err, result, fields) {
			if(err) {
				console.log(err);
			} else {
				io.sockets.emit('create_room', data.toString());
			}
		});




	});

	socket.on('upload', function(data){
		var base64Data = data.image;
		var img_name = data.room;

		var sql = 'UPDATE canvas SET imgBase64=? WHERE room=?';
		conn.query(sql, [base64Data, img_name], function(err, result, fields){
			if(err){
				console.log(err);
				//res.status(500).send('Internal Server Error');
			} else {

			}
		});



/*
		base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
		console.log(base64Data);
		console.log(img_name);


		fs.writeFile("./images/" + img_name + ".png", base64Data, 'base64', function(err) {
			console.log(err);
		});
*/




	});


});