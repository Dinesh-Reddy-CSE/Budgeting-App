// server/database/db.js
const { Sequelize } = require('sequelize');

// Using SQLite database file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/budgeting_app.db', // This file will be created automatically
  logging: false, // Set to true if you want to see SQL queries in console
});

module.exports = sequelize;