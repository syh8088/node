module.exports = function(app){

	var socketio = require('socket.io');
	var http = require('http');
	var conn = require('../config/db')();

	const server = http.createServer(app);
	const io = socketio.listen(server);

	require('date-utils');
	var dt = new Date();

	// 미들웨어를 설정합니다.
	//app.use(express.static(`${__dirname}/public`));


	// 소켓 서버를 만듭니다.
	io.sockets.on('connection', function(socket){
		// message 이벤트
		socket.on('message', function(data){

			console.log('메세지 서버로 통해 받음');

			var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
			var address = socket.handshake.address;

			var sql = "INSERT INTO chat (name, content, register_date, ip) VALUES(?, ?, ?, ?)";
			conn.query(sql, [data.name, data.message, d, address], function(err, result, fields) {
				if(err) {
					console.log(err);
				} else {
					// 클라이언트의 message 이벤트를 발생시킵니다.
					data.date = d;
					io.sockets.emit('message', data);
				}

			});

		});
	});

	return server;
}