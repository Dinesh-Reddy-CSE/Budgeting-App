// server/models/Expense.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
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
Expense.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Expense, { foreignKey: 'userId' });

module.exports = Expense;