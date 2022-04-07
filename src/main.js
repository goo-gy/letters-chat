const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const cors = require('cors');

const PORT = 3001;

const app = express();
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

wsServer.on('connection', (socket) => {
  console.log('socketID:', socket.id);
  socket.on('room_join', ({ name }) => {
    socket.join(name);
    console.log(socket.rooms);
  });

  socket.on('msg', ({ msg }) => {
    socket.to('global').emit('msg', msg);
  });
});

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
