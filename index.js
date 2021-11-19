import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import mqtt from 'mqtt';
import messageRoutes from './routes/message.js';
import cors from 'cors';
import { config } from 'dotenv';
config();
export const mqttServer = mqtt.connect({
  host: process.env.MQTT_SERVER_HOST,
  port: 1883,
});
const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.on('SEND_MESSAGE', () => {
  console.log('Yaaaayyyyyy!');
});
mqttServer.on('message', (topic, data) => {
  const { message, sender } = JSON.parse(data.toString());
  io.sockets.emit('SEND_MESSAGE', {
    sender,
    message,
  });
});
mqttServer.on('connect', () => {
  console.log('MQ Server Connected!');
  mqttServer.subscribe('SEND_MESSAGE');
  // mqttServer.end();
});

app.use(cors());
app.use(express.json());
app.use('/message', messageRoutes);

server.listen(5000, async () => {
  console.log('Server started at port 5000');
  io.on('connection', (socket) => {
    console.log('Socket Server Connected');
  });
});
