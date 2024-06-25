const express = require("express");
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  createAnonymousRoom,
  joinRoom,
  joinAnonymousRoom,
  getRoomsByUser,
} = require("../controllers/roomsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createRoom);
router.post("/anonymous", createAnonymousRoom);
router.get("/", authMiddleware, getRoomsByUser);
router.get("/all", authMiddleware, getAllRooms);
router.post("/join/:roomId", authMiddleware, joinRoom);
router.post("/join-anonymous/:roomId", joinAnonymousRoom);
module.exports = router;
