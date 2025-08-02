// client/src/components/Expenses/AddExpense.jsx
import React, { useState, useContext } from 'react';
import { addExpense } from '../../services/expenseService';
import { ExpenseContext } from '../../context/ExpenseContext';
import { NotificationsContext } from '../../context/NotificationsContext';
import { BudgetContext } from '../../context/BudgetContext';

const AddExpense = () => {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { fetchExpenses } = useContext(ExpenseContext);
  const { showNotification } = useContext(NotificationsContext);
  const { budgets, fetchBudgets } = useContext(BudgetContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpenseData({
      ...expenseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const checkBudgetLimits = (category, amount) => {
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Find budget for this category and current month
    const categoryBudget = budgets.find(
      budget => budget.category === category && 
                budget.month === month && 
                budget.year === year
    );

    if (categoryBudget) {
      // For simplicity, we'll check against the single expense amount
      // In a real app, you'd check total spending vs budget
      const expenseAmount = parseFloat(amount);
      
      if (expenseAmount > categoryBudget.amount) {
        showNotification(
          `⚠️ Overspending Alert: This expense exceeds your ${category} budget of $${categoryBudget.amount}!`,
          'warning'
        );
      } else if (expenseAmount > categoryBudget.amount * 0.8) {
        showNotification(
          `💡 Budget Alert: This expense brings you close to your ${category} budget limit.`,
          'info'
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(expenseData);
      setSuccess('Expense added successfully!');
      setError('');
      
      // Check budget limits
      checkBudgetLimits(expenseData.category, expenseData.amount);
      
      setExpenseData({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        isRecurring: false
      });
      
      // Refresh expense and budget lists
      fetchExpenses();
      fetchBudgets();
      
      showNotification('✅ Expense added successfully!', 'success');
    } catch (err) {
      const errorMessage = err.message || 'Failed to add expense';
      setError(errorMessage);
      setSuccess('');
      showNotification(`❌ ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Add Expense</h2>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="notification error show" style={{ marginBottom: '15px' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="notification success show" style={{ marginBottom: '15px' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter expense title"
              value={expenseData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
              value={expenseData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g., Food, Transport, Utilities"
              value={expenseData.category}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a description..."
              value={expenseData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isRecurring"
                checked={expenseData.isRecurring}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              <span>Recurring Expense</span>
            </label>
          </div>
          
          <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
            ➕ Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;