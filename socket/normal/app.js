// 모듈을 추출합니다.
const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

// 객체를 선언합니다.
const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

// 미들웨어를 설정합니다.
app.use(express.static(`${__dirname}/public`));

// 웹 소켓을 설정합니다.
io.sockets.on('connection', (socket) => {
  // 변수를 선언합니다.
  var roomName = null;
  console.log(socket);

  // 클라이언트를 방에 배정합니다.
  socket.on('joinABCD', (data) => {
    roomName = data.roomName;
    socket.join(data.roomName);
  });

  // 클라이언트에서 데이터가 전달되면, 배분합니다.
  socket.on('message', (data) => {
    io.sockets.in(roomName).emit('message', {
      message: 'From Server'
    });
  });
});

// 서버를 실행합니다.
server.listen(1331, () => {
  console.log('Server Running at http://127.0.0.1:52273');
});