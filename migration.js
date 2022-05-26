import mysql from 'mysql2';
import migration from 'mysql-migrations';

import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const connection = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'letters_chat',
});

migration.init(connection, __dirname + '/migrations');
