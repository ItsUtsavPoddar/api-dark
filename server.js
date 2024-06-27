const express = require("express");
const cors = require("cors");
require("dotenv").config();
const roomRoutes = require("./routes/rooms");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const sequelize = require("./config/db");

const app = express();
app.use(cors());

const server = app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  try {
    await sequelize.sync(); // This ensures the tables are created or updated to match the models
    console.log("Database synced");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
