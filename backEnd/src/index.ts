import { Server } from 'socket.io';
import express, {Request, Response, NextFunction} from 'express';

const app = express();
const server = require('http').createServer(app);
import userRoutes from "./Routes/userRoutes"
import queryRoutes from "./Routes/queryRoutes"
export const io = new Server(server, {
  cors: {
    origin: '*' ,
    credentials:true
  }
});
app.use(express.json());

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/queries",queryRoutes)

app.get('/', async (req, res) => {
  return res.send("hello");
});



io.on('connection', (socket) => {
  console.log('A user connected!', socket.id);
  socket.emit("socket_id", socket.id);


  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("message", data);
  });

  socket.on("code_change", (data) => {
    socket.broadcast.emit("code_change", data); // Emit the "code_change" event with the data to all connected sockets except the sender
  });
  socket.on("language_change", (data)=>{
    socket.broadcast.emit("language_change", data);
  })
  socket.on("outgoing_video", (offer) => {
    // console.log(offer);
    if (offer) {
      socket.broadcast.emit("incoming_video", offer); // Emitting offer object back to the same client
    } else {
      console.error("Received null offer.");
      // Handle the null offer case appropriately, such as sending an error message back to the client
      socket.emit("video_error", "Offer is null");
    }
  });
  socket.on("call_accepted", (offer)=>{
    socket.broadcast.emit("call_accepted", offer);
  })
  
  
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
server.listen(443, () => {
  console.log('Server listening on port 3000');
});
