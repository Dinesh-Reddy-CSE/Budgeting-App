// client/src/components/Expenses/ExpenseItem.jsx
import React, { useContext } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { deleteExpense } from '../../services/expenseService';
import { NotificationsContext } from '../../context/NotificationsContext';

const ExpenseItem = ({ expense }) => {
  const { fetchExpenses } = useContext(ExpenseContext);
  const { showNotification } = useContext(NotificationsContext);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the expense "${expense.title}"?`)) {
      try {
        await deleteExpense(expense.id);
        fetchExpenses(); // Refresh the list
        showNotification('✅ Expense deleted successfully!', 'success');
      } catch (error) {
        showNotification(`❌ Failed to delete expense: ${error.message}`, 'error');
      }
    }
  };

  return (
    <div className="card" style={{ 
      marginBottom: '15px',
      backgroundColor: 'rgba(220, 53, 69, 0.05)',
      border: '1px solid rgba(220, 53, 69, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '10px'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 5px 0', 
            color: 'var(--text-primary)',
            fontSize: '18px'
          }}>
            {expense.title}
          </h3>
          <p style={{ 
            margin: '0', 
            color: 'var(--secondary-color)',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ${expense.amount}
          </p>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div>{expense.date}</div>
          <div style={{ 
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            display: 'inline-block',
            marginTop: '5px'
          }}>
            {expense.category}
          </div>
        </div>
      </div>
      
      {expense.description && (
        <p style={{ 
          margin: '10px 0 0 0', 
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          fontSize: '14px'
        }}>
          {expense.description}
        </p>
      )}
      
      {expense.isRecurring && (
        <div style={{ 
          marginTop: '10px',
          display: 'inline-block',
          backgroundColor: 'var(--warning-color)',
          color: '#212529',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          🔁 Recurring
        </div>
      )}
      
      <div style={{ 
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
      }}>
        <button 
          onClick={handleDelete}
          className="secondary"
          style={{ 
            padding: '6px 12px',
            fontSize: '12px'
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;