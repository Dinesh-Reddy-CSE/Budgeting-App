// server/routes/income.js
const express = require('express');
const Income = require('../models/Income');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/income
// @desc    Add new income
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { source, amount, category, date, description, isRecurring } = req.body;

    const newIncome = await Income.create({
      source,
      amount,
      category,
      date,
      description,
      isRecurring: isRecurring || false,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Income added successfully',
      income: newIncome
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/income
// @desc    Get all income for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });

    res.json({
      message: 'Income retrieved successfully',
      income
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { source, amount, category, date, description, isRecurring } = req.body;

    let income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    income = await income.update({
      source,
      amount,
      category,
      date,
      description,
      isRecurring
    });

    res.json({
      message: 'Income updated successfully',
      income
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    await income.destroy();

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;