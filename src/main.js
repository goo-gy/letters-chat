import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import dayjs from 'dayjs';

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

const rooms = new Map();

io.on(event.connection, (socket) => {
  socket['userName'] = '???';

  socket.on(event.joinRoom, ({ userName, roomName }, done) => {
    const time = dayjs().format(timeFormat);
    socket['userName'] = userName;
    socket.join(roomName);

    if (rooms.get(roomName)) rooms.get(roomName).add(userName);
    else rooms.set(roomName, new Set([userName]));

    socket.to(roomName).emit(event.joinRoom, { userName, time });
    done({ people: rooms.get(roomName), userName, time });
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
    socket.leave(roomName);
    if (rooms.get(roomName)) rooms.get(roomName).delete(socket['userName']);
    socket
      .to(roomName)
      .emit(event.leaveRoom, { userName: socket['userName'], time });
  });

  socket.on(event.disconnecting, () => {
    const time = dayjs().format(timeFormat);
    socket.rooms.forEach((room) => {
      if (rooms.get(room)) rooms.get(room).delete(socket['userName']);
      socket
        .to(room)
        .emit(event.leaveRoom, { userName: socket['userName'], time });
    });
  });

  socket.on(event.disconnect, () => {});
});

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
