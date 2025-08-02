// client/src/components/Expenses/ExpenseList.jsx
import React, { useContext, useEffect } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import ExpenseItem from './ExpenseItem';

const ExpenseList = () => {
  const { expenses, loading, error, fetchExpenses } = useContext(ExpenseContext);

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) return <div className="card fade-in">Loading expenses...</div>;
  if (error) return <div className="card fade-in">Error: {error}</div>;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Expenses</h2>
      </div>
      
      <div className="card-body">
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              📉 No expenses found
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Add your first expense to get started!
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Showing {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </p>
            <div>
              {expenses.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;