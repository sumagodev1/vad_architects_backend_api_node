const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectDetails = sequelize.define('project_deatils', {
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_category_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_info: { type: DataTypes.STRING, allowNull: false },
  project_year_of_completion: { type: DataTypes.STRING, allowNull: false },
  project_total_tonnage: { type: DataTypes.STRING, allowNull: true },
  project_status: { type: DataTypes.STRING, allowNull: true },
  is_feature_project: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default is off (0)
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

module.exports = ProjectDetails;
