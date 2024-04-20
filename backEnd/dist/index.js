"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = require('http').createServer(app);
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const queryRoutes_1 = __importDefault(require("./Routes/queryRoutes"));
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});
app.use(express_1.default.json());
app.use("/api/v1/auth", userRoutes_1.default);
app.use("/api/v1/queries", queryRoutes_1.default);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.io.on('connection', (socket) => {
    console.log('A user connected!', socket.id);
    socket.emit("socket_id", socket.id);
    socket.on("message", (data) => {
        console.log(data);
        socket.broadcast.emit("message", data);
    });
    socket.on("code_change", (data) => {
        socket.broadcast.emit("code_change", data); // Emit the "code_change" event with the data to all connected sockets except the sender
    });
    socket.on("language_change", (data) => {
        socket.broadcast.emit("language_change", data);
    });
    socket.on("outgoing_video", (offer) => {
        // console.log(offer);
        if (offer) {
            socket.broadcast.emit("incoming_video", offer); // Emitting offer object back to the same client
        }
        else {
            console.error("Received null offer.");
            // Handle the null offer case appropriately, such as sending an error message back to the client
            socket.emit("video_error", "Offer is null");
        }
    });
    socket.on("call_accepted", (offer) => {
        socket.broadcast.emit("call_accepted", offer);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
app.use((err, req, res, next) => {
    return res.status(400).json({
        success: false,
        error: err.message,
    });
});
// Start the server
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
