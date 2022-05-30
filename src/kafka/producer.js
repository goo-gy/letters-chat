import Kafka from 'node-rdkafka';
// local
import topic from './topic.js';

const streamJoin = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {}, // options
  {
    topic: topic.join,
  }
);
const streamLeave = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {}, // options
  {
    topic: topic.leave,
  }
);

const streamMesage = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {},
  {
    topic: topic.message,
  }
);

async function pushJoin({ room_id, token, time }) {
  try {
    const success = streamJoin.write(
      Buffer.from(JSON.stringify({ room_id, token, time }))
    );
    if (success) {
      return { success: true };
    }
    return { success: false, error_code: -1 };
  } catch (error) {
    console.log(error);
    return { success: false, error_code: error.code };
  }
}

async function pushLeave({ room_id, token, time }) {
  try {
    const success = streamLeave.write(
      Buffer.from(JSON.stringify({ room_id, token, time }))
    );
    if (success) {
      return { success: true };
    }
    return { success: false, error_code: -1 };
  } catch (error) {
    console.log(error);
    return { success: false, error_code: error.code };
  }
}

async function pushMessage({ room_id, token, message, time }) {
  try {
    const success = streamMesage.write(
      Buffer.from(JSON.stringify({ room_id, token, message, time }))
    );
    if (success) {
      return { success: true };
    }
    return { success: false, error_code: -1 };
  } catch (error) {
    console.log(error);
    return { success: false, error_code: error.code };
  }
}

export { pushJoin, pushLeave, pushMessage };
