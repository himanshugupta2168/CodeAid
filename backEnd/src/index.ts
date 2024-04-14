import { Server } from 'socket.io';
import express, {Request, Response, NextFunction} from 'express';

const app = express();
const server = require('http').createServer(app);
import userRoutes from "./Routes/userRoutes"
import queryRoutes from "./Routes/queryRoutes"
const io = new Server(server, {
  cors: {
    origin: '*' 
  }
});
app.use(express.json());

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/queries",queryRoutes)

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

app.use((err:Error, req:Request, res:Response, next:NextFunction)=>{
  return res.status(400).json({
      success:false, 
      error :err.message,
  })
})
// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
