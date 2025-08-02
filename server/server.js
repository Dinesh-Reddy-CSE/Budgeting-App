// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./database/db');
const { Op } = require('sequelize');
const User = require('./models/User');
const Expense = require('./models/Expense'); // Import Expense model
const Income = require('./models/Income'); // Import Income model
const Budget = require('./models/Budget'); // Import Budget model
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses'); // Import expense routes
const incomeRoutes = require('./routes/income'); // Import income routes
const budgetRoutes = require('./routes/budget'); // Import budget routes
const reportsRoutes = require('./routes/reports'); // Import reports routes
const auth = require('./middleware/auth');

const app = express(); // Initialize app first
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/expenses', expenseRoutes); // Mount expense routes
app.use('/api/income', incomeRoutes); // Mount income routes
app.use('/api/budget', budgetRoutes); // Mount budget routes
app.use('/api/reports', reportsRoutes); // Mount reports routes

// Enhanced dashboard route
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total income
    const totalIncomeResult = await sequelize.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM Incomes WHERE userId = ?`,
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );
    const totalIncome = parseFloat(totalIncomeResult[0].total);

    // Get total expenses
    const totalExpensesResult = await sequelize.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM Expenses WHERE userId = ?`,
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );
    const totalExpenses = parseFloat(totalExpensesResult[0].total);

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    // Get recent expenses (last 5)
    const recentExpenses = await Expense.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent income (last 5)
    const recentIncome = await Income.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      message: 'Dashboard data retrieved successfully',
      overview: {
        totalIncome,
        totalExpenses,
        balance
      },
      recentExpenses,
      recentIncome,
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Budgeting App API is running!' });
});

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start server - CHANGED to accept external connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is accessible on network at http://YOUR_IP:${PORT}`);
});