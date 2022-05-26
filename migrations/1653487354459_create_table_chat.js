module.exports = {
  up: 'CREATE TABLE chat (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, room_id VARCHAR(512) NOT NULL, message TEXT, time DATETIME, PRIMARY KEY (id))',
  down: 'DROP TABLE chat',
};
