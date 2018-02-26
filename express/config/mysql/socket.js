module.exports = function(app){
	var socketio = require('socket.io');
	var http = require('http');
	var location = require('location-href');
	var conn = require('../../config/mysql/db')();

	const server = http.createServer(app);
	const io = socketio.listen(server);


	// 소켓 서버를 만듭니다.
	io.sockets.on('connection', function(socket){
		// message 이벤트
		socket.on('notice', function(data){
			var title = data.title;
			var description = data.description;
			var author = data.author;

			var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
			conn.query(sql, [title, description, author], function(err, result, fields){
				if(err){
					console.log(err);
					//res.status(500).send('Internal Server Error');
				} else {
					data.insertId = result.insertId;
					io.sockets.emit('message', data);
					location.set('/topic/'+result.insertId);
					//res.redirect('/topic/'+result.insertId);
				}
			});

		});
	});

	return server;
}