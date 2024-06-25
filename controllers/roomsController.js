const Room = require("../models/Room");
const UserRoom = require("../models/UserRoom");

function generateRoomID(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomID += characters.charAt(randomIndex);
  }
  return roomID;
}

exports.createRoom = async (req, res) => {
  const { name, type } = req.body;
  const expires_at =
    type === "anonymous" ? new Date(Date.now() + 3600000) : null; // 1 hour for anonymous rooms
  try {
    const newRoom = await Room.create({
      id: generateRoomID(),
      name,
      type,
      expires_at,
    });
    res.json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createAnonymousRoom = async (req, res) => {
  const { name } = req.body;
  const type = "anonymous";
  const expires_at = new Date(Date.now() + 3600000); // 1 hour for anonymous rooms
  try {
    const newRoom = await Room.create({
      id: generateRoomID(),
      name,
      type,
      expires_at,
    });
    res.json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: {
        type: "public",
      },
    });
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get rooms by userId from UserRoom

exports.getRoomsByUser = async (req, res) => {
  try {
    const rooms = await UserRoom.findAll({
      where: { userId: req.userId },
    });
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    // Check if already in the room
    const existingUserRoom = await UserRoom.findOne({
      where: { userId: req.userId, roomId },
    });
    if (existingUserRoom) {
      return res.status(400).json({ error: "User is already in the room" });
    }

    const userRoom = await UserRoom.create({ userId: req.userId, roomId });
    res.json(userRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.joinAnonymousRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findByPk(roomId);
    if (room.type !== "anonymous") {
      return res.status(400).json({ error: "Not an anonymous room" });
    }
    res.json({ message: `Joined room ${roomId}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
