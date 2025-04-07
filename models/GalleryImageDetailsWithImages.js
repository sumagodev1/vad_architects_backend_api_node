const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GalleryImageDetailsWithImages = sequelize.define(
  "gallery_details_with_images2",
  {
    gallery_category_id: { type: DataTypes.STRING, allowNull: false },
    gallery_category: { type: DataTypes.STRING, allowNull: false },
    gallery_images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Store images as an array

    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true }
);

module.exports = GalleryImageDetailsWithImages;
