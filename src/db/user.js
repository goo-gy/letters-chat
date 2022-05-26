import { poolPromise } from './connect';

const registerUser = async ({ id, name, email }) => {
  try {
    const QUERY_CREATE_USER = `INSERT INTO user (id, name, email) VALUES('${id}', '${name}', '${email}')`;
    const [result, fields] = await poolPromise.query(QUERY_CREATE_USER);
    return { success: true };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      try {
        const QUERY_UPDATE_USER = `UPDATE user SET name='${name}', email='${email}'  WHERE id='${id}'`;
        const [result, fields] = await poolPromise.query(QUERY_UPDATE_USER);
        return { success: true };
      } catch (error) {
        return { success: false, error_code: error.code };
      }
    }
    return { success: false, error_code: error.code };
  }
};
export { registerUser };
