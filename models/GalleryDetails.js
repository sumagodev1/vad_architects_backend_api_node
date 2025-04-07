const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryDetails = sequelize.define('gallery_deatils', {
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gallery_category: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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

module.exports = GalleryDetails;
