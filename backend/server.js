const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
require("colors");
const { userJoin, getCurrentUser, userLeave } = require("./dummyuser");

app.use(cors());

const server = app.listen(process.env.PORT || 5050, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${
      process.env.PORT || 5050
    }`.yellow.bold
  );
});

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  //when new user join room
  socket.on("joinRoom", ({ username, roomname }) => {
    // create user
    const user = userJoin(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(user.room);

    // emit message to user to welcome
    socket.emit("message", {
      userId: user.id,
      username: user.username,
      text: `Welcome ${user.username}`,
    });

    // Broadcast message to everyone except sender
    socket.broadcast.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text: `${user.username} has joined the chat`,
    });
  });

  //when somebody send message
  socket.on("chat", (text) => {
    // Get user room and emit message
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text: text,
    });
  });

  // Disconnet, when user leave room
  socket.on("disconnect", () => {
    // delete user from users and emit that user left the chat
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        userId: user.id,
        username: user.username,
        text: `${user.username} has left the chat`,
      });
    }
  });
});
