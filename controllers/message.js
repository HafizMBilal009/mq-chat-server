import { mqttServer } from '../index.js';

export const sendMessage = (req, res) => {
  const { sender, message } = req?.body;
  mqttServer.publish('SEND_MESSAGE', JSON.stringify({ sender, message }));
  res.send();
};
