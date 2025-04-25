const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UploadCV = sequelize.define('cvLists', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true, // Unique constraint
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true, // Unique constraint
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // message: {
  //   type: DataTypes.TEXT,
  //   allowNull: false,
  // },
  cv: {
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
}, {
  timestamps: true,
});

module.exports = UploadCV;
