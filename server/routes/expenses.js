// server/routes/expenses.js
const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date, description, isRecurring } = req.body;

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      date,
      description,
      isRecurring: isRecurring || false,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });

    res.json({
      message: 'Expenses retrieved successfully',
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, amount, category, date, description, isRecurring } = req.body;

    let expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense = await expense.update({
      title,
      amount,
      category,
      date,
      description,
      isRecurring
    });

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.destroy();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;