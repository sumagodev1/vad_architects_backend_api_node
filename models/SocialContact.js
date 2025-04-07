const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SocialContact = sequelize.define("social_links", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // email: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // whatsapp: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // twitter: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // linkedin: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = SocialContact;
