// client/src/components/Budget/AddBudget.jsx
import React, { useState, useContext } from 'react';
import { addBudget } from '../../services/budgetService';
import { BudgetContext } from '../../context/BudgetContext';
import { NotificationsContext } from '../../context/NotificationsContext';

const AddBudget = () => {
  const [budgetData, setBudgetData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { fetchBudgets } = useContext(BudgetContext);
  const { showNotification } = useContext(NotificationsContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetData({
      ...budgetData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBudget(budgetData);
      setSuccess('Budget set successfully!');
      setError('');
      
      setBudgetData({
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      
      // Refresh budget list
      fetchBudgets();
      
      showNotification('✅ Budget set successfully!', 'success');
    } catch (err) {
      const errorMessage = err.message || 'Failed to set budget';
      setError(errorMessage);
      setSuccess('');
      showNotification(`❌ ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Set Budget</h2>
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
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g., Food, Transport, Entertainment"
              value={budgetData.category}
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
              value={budgetData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="month">Month</label>
              <select
                id="month"
                name="month"
                value={budgetData.month}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                  <option key={month} value={month}>
                    {new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={budgetData.year}
                onChange={handleChange}
                required
              >
                {[2024, 2025, 2026, 2027, 2028, 2029].map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="warning" style={{ width: '100%', marginTop: '20px' }}>
            💰 Set Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBudget;