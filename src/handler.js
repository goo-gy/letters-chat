import dayjs from 'dayjs';
// local
import event from './event';
import { verifyToken } from './JWT';
import { pushJoin, pushLeave, pushMessage } from './kafka/producer';
import { registerUser } from './db/user';
import { getRoomMembers } from './db/room';
import { getChatList } from './db/chat';

const timeFormat = 'YYYY-MM-DD hh:mm';

function setEventHandler(io) {
  io.on(event.connection, (socket) => {
    socket.on(event.auth, ({ token }, done) => {
      try {
        const user = verifyToken(token);
        if (user.error) {
          return;
        }
        socket['token'] = token;
        registerUser(user);
        done();
      } catch (error) {
        console.log('socket-auth', error);
      }
    });

    socket.on(event.joinRoom, async ({ room_id }, done) => {
      try {
        const token = socket['token'];
        const time = dayjs().format(timeFormat);
        const result = await pushJoin({
          room_id,
          token,
          time,
        });
        if (result.success) {
          socket.join(room_id);
          // front
          const { success, data } = await getRoomMembers({ room_id });
          done({ people: data });
        }
      } catch (error) {
        console.log('socket-joinRoom', error);
      }
    });

    socket.on(event.message, async ({ room_id, message }, messageDone) => {
      try {
        if (message) {
          const token = socket['token'];
          const time = dayjs().format(timeFormat);
          const { success } = await pushMessage({
            room_id,
            token,
            message,
            time,
          });
          if (success) {
            messageDone();
          }
        }
      } catch (error) {
        console.log('socket-message', error);
      }
    });

    socket.on(event.leaveRoom, async ({ room_id }) => {
      try {
        const token = socket['token'];
        const time = dayjs().format(timeFormat);
        const result = await pushLeave({ room_id, token, time });
        socket.leave(room_id);
      } catch (error) {
        console.log('socket-leaveRoom', error);
      }
    });

    socket.on(event.disconnecting, async () => {
      try {
        const time = dayjs().format(timeFormat);
        const token = socket['token'];
        socket.rooms.forEach((room_id) => {
          pushLeave({ room_id, token, time });
        });
      } catch (error) {
        console.log('socket-disconnecting', error);
      }
    });

    socket.on(event.disconnect, () => {});
  });
}

export default setEventHandler;
