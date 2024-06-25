const express = require("express");
const {
  createMessage,
  createAnonymousMessage,
  getMessagesByRoom,
  getAnonymousMessagesByRoom,
} = require("../controllers/messagesController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.post("/anonymous", createAnonymousMessage);
router.get("/:roomId", authMiddleware, getMessagesByRoom);
router.get("/anonymous/:roomId", getAnonymousMessagesByRoom);

module.exports = router;
