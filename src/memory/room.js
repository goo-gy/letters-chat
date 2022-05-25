const rooms = new Map();

const checkMember = ({ roomName, user }) => {
  const room = rooms.get(roomName);
  if (room && room.get(user.id)) {
    return true;
  }
  return false;
};

const joinRoom = ({ roomName, user }) => {
  if (!rooms.get(roomName)) {
    rooms.set(roomName, new Map());
  }
  rooms.get(roomName).set(user.id, user);
};

const leaveRoom = ({ roomName, user }) => {
  if (rooms.get(roomName)) {
    rooms.get(roomName).delete(user.id);
  }
};

const getMembers = ({ roomName }) => {
  const room = rooms.get(roomName);
  if (room) return Array.from(room.values());
  else return [];
};

export { rooms, joinRoom, leaveRoom, getMembers, checkMember };
