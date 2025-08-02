// server/routes/budget.js
const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/budget
// @desc    Set budget for a category
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({
      where: { 
        userId: req.user.id, 
        category, 
        month, 
        year 
      }
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category and period' });
    }

    const newBudget = await Budget.create({
      category,
      amount,
      month,
      year,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Budget set successfully',
      budget: newBudget
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/budget
// @desc    Get all budgets for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (month) whereClause.month = month;
    if (year) whereClause.year = year;

    const budgets = await Budget.findAll({
      where: whereClause,
      order: [['category', 'ASC']]
    });

    res.json({
      message: 'Budgets retrieved successfully',
      budgets
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/budget/:id
// @desc    Update budget
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    let budget = await Budget.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget = await budget.update({ amount });

    res.json({
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/budget/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.destroy();

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;