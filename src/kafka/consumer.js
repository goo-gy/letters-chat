import Kafka from 'node-rdkafka';
// local
import topic from './topic.js';
import event from '../event';
import { verifyToken } from '../JWT';

const consumer = Kafka.KafkaConsumer(
  {
    'group.id': 'kafka-chat',
    'metadata.broker.list': 'localhost:9092',
  },
  {}
);

function setKafkaConsumer(io) {
  consumer.connect();

  consumer
    .on('ready', () => {
      console.log('Message consumer ready!');
      consumer.subscribe([topic.join, topic.leave, topic.message]);
      consumer.consume();
    })
    .on('data', (record) => {
      switch (record.topic) {
        case topic.join:
          try {
            const { room_id, token, time } = JSON.parse(record.value);
            const user = verifyToken(token);
            console.log('join', { room_id, token, time, user });
            io.in(room_id).emit(event.joinRoom, { user, time });
          } catch (error) {
            console.log('kafka-consumer-join', error);
          }
          break;
        case topic.leave:
          try {
            const { room_id, token, time } = JSON.parse(record.value);
            const user = verifyToken(token);
            console.log('leave', { room_id, token, time, user });
            io.in(room_id).emit(event.leaveRoom, { user, time });
          } catch (error) {
            console.log('kafka-consumer-leave', error);
          }
          break;
        case topic.message:
          try {
            const { room_id, token, message, time } = JSON.parse(record.value);
            const user = verifyToken(token);
            console.log('chat', { room_id, token, message, time });
            io.in(room_id).emit(event.message, {
              user_id: user.id,
              user_name: user.name,
              message,
              time,
            });
          } catch (error) {
            console.log('kafka-consumer-message', error);
          }
          break;
      }
    });
}

export default setKafkaConsumer;
