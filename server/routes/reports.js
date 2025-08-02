// server/routes/reports.js
const express = require('express');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/summary
// @desc    Get weekly/monthly summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { period = 'month', date } = req.query; // period: 'week' or 'month'
    const userId = req.user.id;
    const targetDate = date ? new Date(date) : new Date();
    
    let startDate, endDate;

    if (period === 'week') {
      // Get start and end of week (Monday to Sunday)
      const dayOfWeek = targetDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate = new Date(targetDate);
      startDate.setDate(targetDate.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Get start and end of month
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Get expenses for period
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Get income for period
    const income = await Income.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const balance = totalIncome - totalExpenses;

    // Group by category
    const expenseByCategory = {};
    const incomeByCategory = {};

    expenses.forEach(expense => {
      if (!expenseByCategory[expense.category]) {
        expenseByCategory[expense.category] = 0;
      }
      expenseByCategory[expense.category] += parseFloat(expense.amount);
    });

    income.forEach(inc => {
      if (!incomeByCategory[inc.category]) {
        incomeByCategory[inc.category] = 0;
      }
      incomeByCategory[inc.category] += parseFloat(inc.amount);
    });

    res.json({
      message: `${period.charAt(0).toUpperCase() + period.slice(1)}ly summary retrieved successfully`,
      period: {
        type: period,
        startDate,
        endDate
      },
      totals: {
        totalIncome,
        totalExpenses,
        balance
      },
      byCategory: {
        expenses: expenseByCategory,
        income: incomeByCategory
      },
      details: {
        expenses,
        income
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/export
// @desc    Export data as CSV
// @access  Private
router.get('/export', auth, async (req, res) => {
  try {
    const { type = 'expenses', period = 'month', date } = req.query; // type: 'expenses' or 'income'
    const userId = req.user.id;
    const targetDate = date ? new Date(date) : new Date();
    
    let startDate, endDate;

    if (period === 'week') {
      // Get start and end of week (Monday to Sunday)
      const dayOfWeek = targetDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate = new Date(targetDate);
      startDate.setDate(targetDate.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Get start and end of month
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    let data, filename;

    if (type === 'income') {
      data = await Income.findAll({
        where: {
          userId,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'DESC']]
      });
      filename = `income_${period}_${startDate.toISOString().split('T')[0]}.csv`;
    } else {
      data = await Expense.findAll({
        where: {
          userId,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'DESC']]
      });
      filename = `expenses_${period}_${startDate.toISOString().split('T')[0]}.csv`;
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the selected period' });
    }

    // Prepare data for CSV
    const csvData = data.map(item => ({
      Date: item.date,
      Category: item.category,
      Amount: item.amount,
      Description: item.description || '',
      ...(type === 'income' ? { Source: item.source } : { Title: item.title })
    }));

    // Generate CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;