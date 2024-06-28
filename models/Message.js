const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Room = require("./Room");
const User = require("./User");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      references: {
        model: Room,
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    guestName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message;
