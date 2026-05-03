const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EventResource = sequelize.define('EventResource', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  event_id: { type: DataTypes.INTEGER, allowNull: false },
  resource_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
  tableName: 'event_resources',
  timestamps: false,
});

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  event_id: { type: DataTypes.INTEGER, allowNull: false },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  attended: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'registrations',
  timestamps: true,
  createdAt: 'registered_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['event_id', 'student_id'] }],
});

module.exports = { EventResource, Registration };
