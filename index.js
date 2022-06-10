const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const users = [];
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket) => {
  // io.to(socket.id).emit("id",socket.id);
  console.log("a user connected", socket.id);

  // users.push(socket.id);

  socket.on("loginnedUser", (user) => {
    socket.broadcast.emit("new-user", { name: user, id: socket.id });
    io.to(socket.id).emit("connected-users", users);
    users.push({ id: socket.id , name: user });
    console.log(users);
  });

  socket.on("message", (message) => {
    console.log(users);
    message.msg.type = 1;
    console.log(message);
    console.log(message.msg);
    console.log(message.userID);
    socket.to(message.userID).emit("new-message", message);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
