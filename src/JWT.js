import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const users = new Map();

dotenv.config();
const secretKey = process.env.SECRET_KEY;

users.set(0, {
  name: 'admin',
  sockets: [],
  rooms: [],
});

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return { error: true };
  }
};

export { users, verifyToken };
