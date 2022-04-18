import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dayjs from 'dayjs';

// local
import { users, verifyToken } from './db/user';
import { rooms, joinRoom, leaveRoom, getMembers, checkMember } from './db/room';

const PORT = 3001;
const timeFormat = 'YYYY-MM-DD hh:mm';

const event = {
  auth: 'auth',
  connection: 'connection',
  disconnect: 'disconnect',
  disconnecting: 'disconnecting',
  joinRoom: 'join_room',
  leaveRoom: 'leave_room',
  msg: 'msg',
};

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on(event.connection, (socket, data) => {
  socket.on(event.auth, ({ token }, done) => {
    const user = verifyToken(token);
    if (user.error) {
      return;
    }
    socket['userId'] = user.id;
    users.set(user.id, { ...user });
    done();
  });

  socket.on(event.joinRoom, ({ roomName }, done) => {
    const time = dayjs().format(timeFormat);
    const user = users.get(socket['userId']);
    if (!user) {
      return;
    }
    socket.join(roomName);
    if (!checkMember({ roomName, user })) {
      socket.to(roomName).emit(event.joinRoom, { user, time });
    }
    joinRoom({ roomName, user });
    const people = getMembers({ roomName });
    done({ people, user, time });
  });

  socket.on(event.msg, ({ roomName, msg }, done) => {
    const time = dayjs().format(timeFormat);
    const user = users.get(socket['userId']);
    if (msg) {
      socket.to(roomName).emit(event.msg, {
        user,
        msg,
        time,
      });
      done({ user, time });
    }
  });

  socket.on(event.leaveRoom, ({ roomName }) => {
    const time = dayjs().format(timeFormat);
    const user = users.get(socket['userId']);
    socket.leave(roomName);
    leaveRoom({ roomName, user });
    socket.to(roomName).emit(event.leaveRoom, { user, time });
  });

  socket.on(event.disconnecting, () => {
    const time = dayjs().format(timeFormat);
    const user = users.get(socket['userId']);
    socket.rooms.forEach((roomName) => {
      leaveRoom({ roomName, user });
      socket.to(roomName).emit(event.leaveRoom, { user, time });
    });
  });

  socket.on(event.disconnect, () => {});
});

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
