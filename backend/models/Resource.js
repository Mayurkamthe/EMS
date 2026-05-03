const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resource = sequelize.define('Resource', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.ENUM('hall', 'projector', 'sound_system', 'other'), allowNull: false },
  total_quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  description: { type: DataTypes.TEXT },
}, {
  tableName: 'resources',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Resource;
