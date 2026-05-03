const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false },
  venue: { type: DataTypes.STRING(200) },
  total_seats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
  registered_seats: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
  fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  rejection_reason: { type: DataTypes.TEXT },
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Event;
