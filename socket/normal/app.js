// ����� �����մϴ�.
const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

// ��ü�� �����մϴ�.
const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

// �̵��� �����մϴ�.
app.use(express.static(`${__dirname}/public`));

// �� ������ �����մϴ�.
io.sockets.on('connection', (socket) => {
  // ������ �����մϴ�.
  var roomName = null;
  console.log(socket);

  // Ŭ���̾�Ʈ�� �濡 �����մϴ�.
  socket.on('joinABCD', (data) => {
    roomName = data.roomName;
    socket.join(data.roomName);
  });

  // Ŭ���̾�Ʈ���� �����Ͱ� ���޵Ǹ�, ����մϴ�.
  socket.on('message', (data) => {
    io.sockets.in(roomName).emit('message', {
      message: 'From Server'
    });
  });
});

// ������ �����մϴ�.
server.listen(1331, () => {
  console.log('Server Running at http://127.0.0.1:52273');
});