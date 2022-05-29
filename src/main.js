import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
// local
import setEventHandler from './handler';
import setKafkaConsumer from './kafka/consumer';

const PORT = 3001;

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

const handleListen = () => console.log(`Listening on ${PORT}`);
httpServer.listen(PORT, handleListen);
