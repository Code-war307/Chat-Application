import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true, // allow cookies to be sent with requests
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // return the socket ID for the given user ID
}

const userSocketMap = {}; // use to store online users -> {userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    if(!userSocketMap[userId]){
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id); // store the userId and socketId
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // is used to send events to all connected clients

  socket.on("typing", ({receiverId, senderId}) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("typing")
    if(receiverSocketId){
      receiverSocketId.forEach((id) => {
        io.to(id).emit("showTyping", senderId)
      })
      
    }
  })

  socket.on("disconnect", () => {
    if(userSocketMap[userId]){
      userSocketMap[userId].delete(socket.id)
      if(userSocketMap[userId].size === 0){
        delete userSocketMap[userId]
      }
    } // remove the userId from the map
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // update the online users
  });
});

export { io, app, server };
