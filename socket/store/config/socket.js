module.exports = function(app, products){

	var socketio = require('socket.io');
	var http = require('http');
	var conn = require('../config/db')();

	// 웹 서버를 생성합니다.
	var server = http.createServer(app);

	// 소켓 서버를 생성 및 실행합니다.
	io = socketio.listen(server);

	io.sockets.on('connection', function(socket){
		// 함수를 선업합니다.
		function onReturn(index) {
			// 물건 개수를 증가시킵니다.
			products[index].count++;

			// 타이머를 제거합니다.
			clearTimeout(cart[index].timerID);

			// 카운터 타이머를 제거 합니다.
			clearInterval(cart[index].CountTimerID);

			// 카트에서 물건을 제거합니다.
			delete cart[index];

			// count 이벤트를 발생시킵니다.
			io.sockets.emit('init_count', {
				index: index,
				count: products[index].count
			});
		}

		//변수를 선언 합니다.
		var cart = {};

		// cart 이벤트
		socket.on('cart', function(index){

			// 장바구니 카트 카운트 다운
			var count_down = 10;

			// 물건 개수를 감소시킵니다.
			products[index].count--;

			// 카트에 물건을 넣고 타이머를 시작합니다.
			cart[index] = {};
			cart[index].index = index;
			cart[index].count_down = count_down;


			// count 이벤트를 발생시킵니다.
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

		// buy 이벤트
		socket.on('buy', function(index){
			// 타이머를 제거 합니다.
			clearTimeout(cart[index].timerID);

			// 카운터 타이머를 제거 합니다.
			clearInterval(cart[index].CountTimerID);

			// 카트에서 물건을 제거합니다.
			delete cart[index];

			// count 이벤트를 발생시킵니다.
			io.sockets.emit('init_count', {
				index: index,
				count: products[index].count
			});
		});

		// return 이벤트
		socket.on('return', function(index){
			onReturn(index);
		});
	});

	return server;

}