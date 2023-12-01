const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const passport = require("passport");
const { createServer } = require("http");
const httpServer = createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const port = process.env.PORT || 8080;
require("./config/passport")(passport);
require("dotenv").config();

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("connect mongodb atlas success");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://teatalk.onrender.com"],
    methods: ["POST", "GET", "PATCH"],
  })
);
app.use("/api/user", authRoute);

app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

app.use(
  "/api/chat",
  passport.authenticate("jwt", { session: false }),
  chatRoute
);

app.use(
  "/api/message",
  passport.authenticate("jwt", { session: false }),
  messageRoute
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const io = new Server(httpServer, {
  cors: {
    origin: "https://teatalk.onrender.com",
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      //如果等於傳送訊息的人就return, 所以只會傳送給自己以外的人
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});

httpServer.listen(port);
