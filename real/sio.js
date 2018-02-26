
var io = require('socket.io').listen(8090);

process.on('uncaughtException', function (err) {
  console.log(err);
})

io.sockets.on('connection', function (socket) {

	socket.on('written', function (data) {
			console.log(data);
		io.sockets.emit('broadcast', { id: data.writtenBy, comment:data.comment});
	});
});