import Kafka from 'node-rdkafka';
// local
import topic from './topic.js';
import { verifyToken } from '../JWT';
import { createRoom, joinRoom, leaveRoom } from '../db/room';
import { saveChat } from '../db/chat';

const consumer = Kafka.KafkaConsumer(
  {
    'group.id': 'kafka-writer',
    'metadata.broker.list': 'localhost:9092',
  },
  {}
);

consumer.connect();

consumer
  .on('ready', () => {
    console.log('DB writer ready!');
    consumer.subscribe([topic.join, topic.leave, topic.message]);
    consumer.consume();
  })
  .on('data', (record) => {
    console.log('save', record.topic);
    switch (record.topic) {
      case topic.join:
        try {
          const { room_id, token, time } = JSON.parse(record.value);
          const user = verifyToken(token);
          joinRoom({ room_id, user_id: user.id });
        } catch (error) {
          console.log('kafka-writer-join', error);
        }
        break;
      case topic.leave:
        try {
          const { room_id, token, time } = JSON.parse(record.value);
          const user = verifyToken(token);
          leaveRoom({ room_id, user_id: user.id });
        } catch (error) {
          console.log('kafka-writer-leave', error);
        }
        break;
      case topic.message:
        try {
          const { room_id, token, message, time } = JSON.parse(record.value);
          const user = verifyToken(token);
          saveChat({ room_id, user_id: user.id, message, time });
        } catch (error) {
          console.log('kafka-writer-message', error);
        }
        break;
    }
  });
