import dayjs from 'dayjs';
// local
import event from './event';
import { verifyToken } from './JWT';
import { pushJoin, pushLeave, pushMessage } from './kafka/producer';
import { registerUser } from './db/user';
import { checkRoom, getRoomMembers, checkRoomMembers } from './db/room';
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
        const user = verifyToken(token);
        console.log(user);
        if (!user) {
          // TODO : token 재발급
          done({ success: false, error_msg: '로그인이 필요합니다.' });
          return;
        }
        const resultRoom = await checkRoom({ room_id });
        if (!resultRoom.data) {
          done({ success: false, error_msg: '채팅방이 존재하지 않습니다.' });
          return;
        }

        const { success, data } = await checkRoomMembers({
          room_id,
          user_id: user.id,
        });
        if (success && !data) {
          pushJoin({
            room_id,
            token,
            time,
          });
        }
        socket.join(room_id);
        // front
        const membersResult = await getRoomMembers({ room_id });
        const chatResult = await getChatList({ room_id });
        if (membersResult.success && chatResult.success) {
          done({
            success: true,
            people: membersResult.data,
            chatList: chatResult.data,
          });
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
        // const time = dayjs().format(timeFormat);
        // const token = socket['token'];
        // socket.rooms.forEach((room_id) => {
        //   pushLeave({ room_id, token, time });
        // });
      } catch (error) {
        console.log('socket-disconnecting', error);
      }
    });

    socket.on(event.disconnect, () => {});
  });
}

export default setEventHandler;
