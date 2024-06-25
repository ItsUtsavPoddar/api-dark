const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Room = require("./Room");
const User = require("./User");

const UserRoom = sequelize.define(
  "UserRoom",
  {
    roomId: {
      type: DataTypes.UUID,
      references: {
        model: Room,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserRoom;
