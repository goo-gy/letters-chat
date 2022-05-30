import dayjs from 'dayjs';
import { createRoom, joinRoom, leaveRoom, getRoomMembers } from './room';
import { saveChat, getChatList } from './chat';
import { registerUser } from './user';

const timeFormat = 'YYYY-MM-DD hh:mm:ss';

async function roomTest() {
  const result = await createRoom({ room_id: 'global', room_name: 'global' });
  console.log('createRoom', result);
  const resultJoin = await joinRoom({ room_id: 'global', user_id: 5 });
  console.log('joinRoom', resultJoin);
  const resultLeave = await leaveRoom({ room_id: 'global', user_id: '2' });
  console.log('leaveRoom', resultLeave);
  const resultMembers = await getRoomMembers({ room_id: 'global' });
  console.log('getRoomMembers', resultMembers);
}

async function userTest() {
  const result = await registerUser({ id: 1, name: 'goody', email: 'email' });
  console.log('registerUser', result);
}

async function chatTest() {
  const time = dayjs().format(timeFormat);
  const chat = { room_id: 'global', user_id: 1, message: 'Hello!', time };
  const result = await saveChat(chat);
  console.log('saveChat', result);

  const resultChat = await getChatList({ room_id: 'global' });
  console.log('getChatList', resultChat);
}

roomTest();
userTest();
chatTest();
