import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // for dev only
  },
});

io.on("connection", (socket) => {
  // console.log("CONNECTED:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room`, userId, "Rooms:", [
      ...socket.rooms,
    ]);
  });

  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, text } = data;
    // console.log("SEND EVENT RECEIVED:", data);

    // socket.broadcast.emit("receiveMessage", {
    //   ...data,
    //   fromSocket: socket.id,
    // });

    io.to(receiverId).emit("receiveMessage", {
      senderId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECTED:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("WebSocket server running on port 3000");
});
