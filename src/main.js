const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const dayjs = require('dayjs');

const PORT = 3001;
const timeFormat = 'YYYY-MM-DD hh:mm';

const event = {
  connection: 'connection',
  disconnect: 'disconnect',
  disconnecting: 'disconnecting',
  joinRoom: 'join_room',
  leaveRoom: 'leave_room',
  msg: 'msg',
};

const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const rooms = {};

io.on(event.connection, (socket) => {
  socket['userName'] = '???';
  socket.on(event.joinRoom, ({ userName, roomName }, done) => {
    socket['userName'] = userName;
    const time = dayjs().format(timeFormat);
    socket.join(roomName);
    if (rooms[roomName]) {
      rooms[roomName] = [...rooms[roomName], userName];
    } else {
      rooms[roomName] = [userName];
    }
    socket.to(roomName).emit(event.joinRoom, { userName, time });
    done({ people: rooms[roomName], userName, time });
  });

  socket.on(event.msg, ({ roomName, msg }, done) => {
    const time = dayjs().format(timeFormat);
    if (msg) {
      socket.to(roomName).emit(event.msg, {
        userName: socket['userName'],
        msg,
        time,
      });
      done(time);
    }
  });

  socket.on(event.leaveRoom, ({ roomName }) => {
    const time = dayjs().format(timeFormat);
    if (rooms[roomName]) {
      rooms[roomName] = [...rooms[roomName], socket['userName']];
      rooms[roomName] = rooms[roomName].filter(
        (name) => name !== socket['userName']
      );
    }
    socket
      .to(roomName)
      .emit(event.leaveRoom, { userName: socket['userName'], time });
  });

  socket.on(event.disconnect, () => {
    // const peopleCount = io.sockets.adapter.rooms.get('global')?.size;
    // if (peopleCount) socket.to('global').emit(event.joinRoom, { peopleCount });
  });

  socket.on(event.disconnecting, () => {
    const time = dayjs().format(timeFormat);
    socket.rooms.forEach((room) => {
      socket
        .to(room)
        .emit(event.leaveRoom, { userName: socket['userName'], time });
    });
  });
});

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
