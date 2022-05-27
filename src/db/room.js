import { poolPromise } from './connect';

// error.code: 'ER_DUP_ENTRY'
// error.errno : 1062

async function createRoom({ room_id, room_name }) {
  try {
    const QUERY_CREATE_ROOM = `INSERT INTO room (id, name) VALUES('${room_id}', '${room_name}')`;
    const [result, fields] = await poolPromise.query(QUERY_CREATE_ROOM);
    return { success: true };
  } catch (error) {
    return { success: false, error_code: error.code };
  }
}

async function joinRoom({ room_id, user_id }) {
  // TODO : Check room exist
  try {
    const QUERY_JOIN_ROOM = `INSERT INTO room_has_user (room_id, user_id) VALUES('${room_id}', '${user_id}')`;
    const [result, fields] = await poolPromise.query(QUERY_JOIN_ROOM);
    return { success: true };
  } catch (error) {
    return { success: false, error_code: error.code };
  }
}

async function leaveRoom({ room_id, user_id }) {
  try {
    const QUERY_LEAVE_ROOM = `DELETE FROM room_has_user WHERE room_id='${room_id}' AND user_id=${user_id}`;
    const [result, fields] = await poolPromise.query(QUERY_LEAVE_ROOM);
    return { success: true };
  } catch (error) {
    return { success: false, error_code: error.code };
  }
}

async function getRoomMembers({ room_id }) {
  try {
    const QUERY_GET_MEMBER = `SELECT user.id as id, user.email as email, user.name as name FROM room_has_user JOIN user ON room_id='${room_id}' AND user_id=user.id`;
    const [rows, fields] = await poolPromise.query(QUERY_GET_MEMBER);
    return { success: true, data: rows };
  } catch (error) {
    console.log(error);
    return { success: false, error_code: error.code };
  }
}

export { createRoom, joinRoom, leaveRoom, getRoomMembers };
