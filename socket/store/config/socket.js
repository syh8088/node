module.exports = function(app, products){

	var socketio = require('socket.io');
	var http = require('http');
	var conn = require('../config/db')();

	// �� ������ �����մϴ�.
	var server = http.createServer(app);

	// ���� ������ ���� �� �����մϴ�.
	io = socketio.listen(server);

	io.sockets.on('connection', function(socket){
		// �Լ��� �����մϴ�.
		function onReturn(index) {
			// ���� ������ ������ŵ�ϴ�.
			products[index].count++;

			// Ÿ�̸Ӹ� �����մϴ�.
			clearTimeout(cart[index].timerID);

			// ī���� Ÿ�̸Ӹ� ���� �մϴ�.
			clearInterval(cart[index].CountTimerID);

			// īƮ���� ������ �����մϴ�.
			delete cart[index];

			// count �̺�Ʈ�� �߻���ŵ�ϴ�.
			io.sockets.emit('init_count', {
				index: index,
				count: products[index].count
			});
		}

		//������ ���� �մϴ�.
		var cart = {};

		// cart �̺�Ʈ
		socket.on('cart', function(index){

			// ��ٱ��� īƮ ī��Ʈ �ٿ�
			var count_down = 10;

			// ���� ������ ���ҽ�ŵ�ϴ�.
			products[index].count--;

			// īƮ�� ������ �ְ� Ÿ�̸Ӹ� �����մϴ�.
			cart[index] = {};
			cart[index].index = index;
			cart[index].count_down = count_down;


			// count �̺�Ʈ�� �߻���ŵ�ϴ�.
			cart[index].CountTimerID = setInterval(function(){

				io.sockets.emit('countDown', {
					index: index,
					count_down: count_down,
					count: products[index].count
				});
				count_down--;
			}, 1000);

			cart[index].timerID = setTimeout(function(){

				onReturn(index);
	//		}, 10 * 60 * 1000);
			}, count_down * 1000);








		});

		// buy �̺�Ʈ
		socket.on('buy', function(index){
			// Ÿ�̸Ӹ� ���� �մϴ�.
			clearTimeout(cart[index].timerID);

			// ī���� Ÿ�̸Ӹ� ���� �մϴ�.
			clearInterval(cart[index].CountTimerID);

			// īƮ���� ������ �����մϴ�.
			delete cart[index];

			// count �̺�Ʈ�� �߻���ŵ�ϴ�.
			io.sockets.emit('init_count', {
				index: index,
				count: products[index].count
			});
		});

		// return �̺�Ʈ
		socket.on('return', function(index){
			onReturn(index);
		});
	});

	return server;

}