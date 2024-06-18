//
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/mesagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("Welcome to the ChatAPP Project....");
// });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected Successfully !!!!");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`SERVER is listening on the port: ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost/3001",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.io);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
