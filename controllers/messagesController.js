const e = require("express");
const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getMessagesByRoomHelper = async (roomId) => {
  try {
    const messages = await Message.findAll({ where: { roomId } });
    return messages;
  } catch (error) {
    return { error: error.message };
  }
};

const createMessageHelper = async ({ userId, roomId, content }) => {
  try {
    const username = await User.findByPk(userId);
    const newMessage = await Message.create({
      userId,
      username: username.username,
      roomId,
      content,
    });
    return newMessage;
  } catch (error) {
    return { error: error.message };
  }
};

const createAnonymousMessageHelper = async ({ roomId, content, guestName }) => {
  try {
    const guest = guestName || `Guest_${Math.floor(Math.random() * 1000)}`;
    const room = await Room.findByPk(roomId);
    if (room.type !== "anonymous") {
      return res.status(400).json({ error: "Room must be anonymous" });
    }
    const newMessage = await Message.create({
      username: null,
      userId: null,
      guestName: guest,
      roomId,
      content,
    });
    return newMessage;
  } catch (error) {
    return { error: error.message };
  }
};

exports.createMessage = async (req, res) => {
  const { content, roomId } = req.body;
  try {
    userId = req.userId;
    const newMessage = await createMessageHelper({ userId, roomId, content });
    res.json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// ROOM MUST BE ANONYMOUS TYPE
exports.createAnonymousMessage = async (req, res) => {
  const { content, roomId, guestName } = req.body;

  try {
    const newMessage = await createAnonymousMessageHelper({
      roomId,
      content,
      guestName,
    });
    res.json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await getMessagesByRoomHelper(roomId);
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

exports.getMessagesByRoomHelper = getMessagesByRoomHelper;
exports.createMessageHelper = createMessageHelper;
exports.createAnonymousMessageHelper = createAnonymousMessageHelper;
