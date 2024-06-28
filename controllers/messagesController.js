const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.createMessage = async (req, res) => {
  const { content, roomId } = req.body;
  try {
    userId = req.userId;
    const username = await User.findByPk(userId);
    console.log(username);
    const newMessage = await Message.create({
      userId,
      username: username.username,
      roomId,
      content,
    });
    res.json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// ROOM MUST BE ANONYMOUS TYPE
exports.createAnonymousMessage = async (req, res) => {
  const { content, roomId, guestName } = req.body;

  try {
    const room = await Room.findByPk(roomId);
    if (room.type !== "anonymous") {
      return res.status(400).json({ error: "Room must be anonymous" });
    }
    let guest = null;
    if (req.header("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.user = await User.findByPk(req.userId);
      guest = null;
    } else {
      guest = guestName || `Guest_${Math.floor(Math.random() * 1000)}`;
    }
    const newMessage = await Message.create({
      username: req.user.username,
      userId: req.userId,
      guestName: guest,
      roomId,
      content,
    });
    res.json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.findAll({ where: { roomId } });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAnonymousMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findByPk(roomId);
    if (room.type !== "anonymous") {
      return res.status(400).json({ error: "Room must be anonymous" });
    }
    const messages = await Message.findAll({
      where: { roomId },
    });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
