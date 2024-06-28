const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({ username, password: hashedPassword });
    res.send(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["username", "createdAt"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    userDetails = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.getGuestId = async (req, res) => {
  const { guestName } = req.body;
  try {
    const guestId =
      `${guestName}${Math.floor(Math.random() * 1000000)}` ||
      `guest_${Math.floor(Math.random() * 1000000)}`;
    res.json({ guestId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
