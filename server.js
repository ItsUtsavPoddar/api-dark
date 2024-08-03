const express = require("express");
const cors = require("cors");
require("dotenv").config();
const roomRoutes = require("./routes/rooms");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const sequelize = require("./config/db");
const socketIo = require("socket.io");
const {
  getMessagesByRoomHelper,
  createMessageHelper,
  createAnonymousMessageHelper,
} = require("./controllers/messagesController");
const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  try {
    await sequelize.sync(); // This ensures the tables are created or updated to match the models
    console.log("Database synced");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes); //users routes
app.use("/messages", messageRoutes);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async ({ roomId, userId, content }) => {
    // console.log("RECIEVED MESSAGE", roomId, userId, content);
    try {
      const newMessage = await createMessageHelper({ userId, roomId, content });
      console.log(roomId);
      io.to(roomId).emit("receiveMessage", newMessage);
      console.log("emitted");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  socket.on("sendAnonymousMessage", async ({ roomId, guestName, content }) => {
    // console.log("RECIEVED MESSAGE", roomId, userId, content);
    try {
      const newMessage = await createAnonymousMessageHelper({
        guestName,
        roomId,
        content,
      });
      console.log(roomId);
      io.to(roomId).emit("receiveMessage", newMessage);
      console.log("emitted");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
