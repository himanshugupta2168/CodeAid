import { Server } from 'socket.io';
import express from 'express';

const app = express();
const server = require('http').createServer(app);
import userRoutes from "./Routes/userRoutes"
const io = new Server(server, {
  cors: {
    origin: '*' 
  }
});

app.use("/api/v1/auth", userRoutes)

app.get('/', (req, res) => {
  res.send('Hello from the socket server!');
});

io.on('connection', (socket) => {
  console.log('A user connected!');

  socket.on('message', (data) => {
    console.log('Received message:', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
