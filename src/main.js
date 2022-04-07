const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const dayjs = require('dayjs');

const PORT = 3001;
const timeFormat = 'YYYY-MM-DD hh:mm';

const event = {
  connection: 'connection',
  disconnect: 'disconnect',
  joinRoom: 'join_room',
  msg: 'msg',
};

const app = express();
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const rooms = {};

wsServer.on(event.connection, (socket) => {
  socket.on(event.joinRoom, ({ userName, roomName }, done) => {
    const time = dayjs().format(timeFormat);
    socket.join(roomName);
    if (rooms[roomName]) {
      rooms[roomName] = [...rooms[roomName], userName];
    } else {
      rooms[roomName] = [userName];
    }
    // const peopleCount = wsServer.sockets.adapter.rooms.get(roomName)?.size;
    // TODO : check same host
    socket.to(roomName).emit(event.joinRoom, { userName, time });
    done({ people: rooms[roomName], userName, time });
  });

  socket.on(event.msg, ({ userName, roomName, msg }, done) => {
    const time = dayjs().format(timeFormat);
    if (msg) {
      socket.to(roomName).emit(event.msg, {
        userName,
        msg,
        time,
      });
      done(time);
    }
  });

  socket.on(event.disconnect, () => {
    const peopleCount = wsServer.sockets.adapter.rooms.get('global')?.size;
    if (peopleCount) socket.to('global').emit(event.joinRoom, { peopleCount });
  });
});

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
