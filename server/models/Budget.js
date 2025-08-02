// server/models/Budget.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define relationship
Budget.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Budget, { foreignKey: 'userId' });

module.exports = Budget;