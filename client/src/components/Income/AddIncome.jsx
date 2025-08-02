// client/src/components/Income/AddIncome.jsx
import React, { useState, useContext } from 'react';
import { addIncome } from '../../services/incomeService';
import { IncomeContext } from '../../context/IncomeContext';
import { NotificationsContext } from '../../context/NotificationsContext';

const AddIncome = () => {
  const [incomeData, setIncomeData] = useState({
    source: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { fetchIncome } = useContext(IncomeContext);
  const { showNotification } = useContext(NotificationsContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIncomeData({
      ...incomeData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIncome(incomeData);
      setSuccess('Income added successfully!');
      setError('');
      
      setIncomeData({
        source: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        isRecurring: false
      });
      
      // Refresh income list
      fetchIncome();
      
      showNotification('✅ Income added successfully!', 'success');
    } catch (err) {
      const errorMessage = err.message || 'Failed to add income';
      setError(errorMessage);
      setSuccess('');
      showNotification(`❌ ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Add Income</h2>
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
            <label htmlFor="source">Source</label>
            <input
              type="text"
              id="source"
              name="source"
              placeholder="e.g., Salary, Freelance, Investment"
              value={incomeData.source}
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
              value={incomeData.amount}
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
              placeholder="e.g., Salary, Freelance, Investment"
              value={incomeData.category}
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
              value={incomeData.date}
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
              value={incomeData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isRecurring"
                checked={incomeData.isRecurring}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              <span>Recurring Income</span>
            </label>
          </div>
          
          <button type="submit" className="success" style={{ width: '100%', marginTop: '10px' }}>
            ➕ Add Income
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;