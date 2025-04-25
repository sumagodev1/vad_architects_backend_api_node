const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectDetailsWithImages = sequelize.define(
  "project_details_with_images2",
  {
    project_category_id: { type: DataTypes.STRING, allowNull: false },
    project_category: { type: DataTypes.STRING, allowNull: false },
    project_name_id: { type: DataTypes.STRING, allowNull: false },
    project_name: { type: DataTypes.STRING, allowNull: false, unique: true },

    // New Fields
    before_img: { type: DataTypes.STRING, allowNull: false }, // Single before image
    before_description: { type: DataTypes.TEXT, allowNull: false }, // Before description
    planning_img: { type: DataTypes.STRING, allowNull: false }, // Planning image
    planning_description: { type: DataTypes.TEXT, allowNull: false }, // Planning description
    after_img: { type: DataTypes.STRING, allowNull: false }, // After image
    after_description: { type: DataTypes.TEXT, allowNull: false }, // After description
    detailed_description: { type: DataTypes.TEXT, allowNull: false }, 

    hero_img: { type: DataTypes.STRING, allowNull: false }, // Single before image

    client_name: { type: DataTypes.TEXT, allowNull: true },
    client_designation: { type: DataTypes.TEXT, allowNull: true },
    client_review: { type: DataTypes.TEXT, allowNull: true },
    star: { type: DataTypes.TEXT, allowNull: true }, 
    client_img: { type: DataTypes.STRING, allowNull: true },

    project_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // Store multiple images
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true }
);

module.exports = ProjectDetailsWithImages;
