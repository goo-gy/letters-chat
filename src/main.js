import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dotenv from 'dotenv';
// local
import setEventHandler from './handler';
import setKafkaConsumer from './kafka/consumer';

dotenv.config();
const { SERVICE_PORT } = process.env;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});
setEventHandler(io);
setKafkaConsumer(io);

const handleListen = () => console.log(`Listening on ${SERVICE_PORT}`);
httpServer.listen(SERVICE_PORT, handleListen);
