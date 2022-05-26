module.exports = {
  up: 'CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(256) NOT NULL UNIQUE, name VARCHAR(128) NOT NULL, PRIMARY KEY (id))',
  down: 'DROP TABLE user',
};
