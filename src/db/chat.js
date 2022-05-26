// local
import { poolPromise } from './connect';

const timeFormatSQL = '%Y-%m-%d %h:%m:%s';

const saveChat = async (chat) => {
  try {
    const { room_id, user_id, message, time } = chat;
    const QUERY_SAVE_CHAT = `INSERT INTO chat (room_id, user_id, message, time) VALUES('${room_id}', '${user_id}', '${message}', '${time}')`;
    const [result, fields] = await poolPromise.query(QUERY_SAVE_CHAT);
    return { success: true };
  } catch (error) {
    return { success: false, error_code: error.code };
  }
};

const getChatList = async ({ room_id }) => {
  try {
    // let QUERY_GET_CHAT = `SELECT id, user_id, message, DATE_FORMAT(time, '${timeFormatSQL}') AS time FROM chat`;
    let QUERY_GET_CHAT = `SELECT chat.id, user_id, user.name as user_name, message, DATE_FORMAT(time, '${timeFormatSQL}') AS time FROM chat JOIN user ON user_id=user.id AND room_id='${room_id}' order by chat.id`;
    const [rows, fields] = await poolPromise.query(QUERY_GET_CHAT);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error_code: error.code };
  }
};

export { saveChat, getChatList };
