// server/models/Income.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Define relationship
Income.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Income, { foreignKey: 'userId' });

module.exports = Income;