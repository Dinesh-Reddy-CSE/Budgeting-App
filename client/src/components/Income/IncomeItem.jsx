// client/src/components/Income/IncomeItem.jsx
import React, { useContext } from 'react';
import { IncomeContext } from '../../context/IncomeContext';
import { deleteIncome } from '../../services/incomeService';
import { NotificationsContext } from '../../context/NotificationsContext';

const IncomeItem = ({ income }) => {
  const { fetchIncome } = useContext(IncomeContext);
  const { showNotification } = useContext(NotificationsContext);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the income "${income.source}"?`)) {
      try {
        await deleteIncome(income.id);
        fetchIncome(); // Refresh the list
        showNotification('✅ Income deleted successfully!', 'success');
      } catch (error) {
        showNotification(`❌ Failed to delete income: ${error.message}`, 'error');
      }
    }
  };

  return (
    <div className="card" style={{ 
      marginBottom: '15px',
      backgroundColor: 'rgba(40, 167, 69, 0.05)',
      border: '1px solid rgba(40, 167, 69, 0.2)',
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
            {income.source}
          </h3>
          <p style={{ 
            margin: '0', 
            color: 'var(--success-color)',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ${income.amount}
          </p>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div>{income.date}</div>
          <div style={{ 
            backgroundColor: 'var(--success-color)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            display: 'inline-block',
            marginTop: '5px'
          }}>
            {income.category}
          </div>
        </div>
      </div>
      
      {income.description && (
        <p style={{ 
          margin: '10px 0 0 0', 
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          fontSize: '14px'
        }}>
          {income.description}
        </p>
      )}
      
      {income.isRecurring && (
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

export default IncomeItem;