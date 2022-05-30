module.exports = {
  up: 'CREATE TABLE room_has_user ( id INT NOT NULL AUTO_INCREMENT, room_id VARCHAR(512), user_id INT, PRIMARY KEY (id), UNIQUE KEY (room_id, user_id) )',
  down: 'DROP TABLE room_has_user',
};
