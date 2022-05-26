import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'letters_chat',
});

const poolPromise = pool.promise();

export { poolPromise };
