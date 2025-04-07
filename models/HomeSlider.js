const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HomeSlider = sequelize.define(
  "HomeSlider",
  {
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    view: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = HomeSlider;
