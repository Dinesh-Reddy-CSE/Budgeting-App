// client/src/components/Budget/BudgetItem.jsx
import React, { useContext } from 'react';
import { BudgetContext } from '../../context/BudgetContext';
import { deleteBudget } from '../../services/budgetService';
import { NotificationsContext } from '../../context/NotificationsContext';

const BudgetItem = ({ budget }) => {
  const { fetchBudgets } = useContext(BudgetContext);
  const { showNotification } = useContext(NotificationsContext);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the budget for "${budget.category}"?`)) {
      try {
        await deleteBudget(budget.id);
        fetchBudgets(); // Refresh the list
        showNotification('✅ Budget deleted successfully!', 'success');
      } catch (error) {
        showNotification(`❌ Failed to delete budget: ${error.message}`, 'error');
      }
    }
  };

  return (
    <div className="card" style={{ 
      marginBottom: '15px',
      backgroundColor: 'rgba(255, 193, 7, 0.05)',
      border: '1px solid rgba(255, 193, 7, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 5px 0', 
            color: 'var(--text-primary)',
            fontSize: '18px'
          }}>
            {budget.category}
          </h3>
          <p style={{ 
            margin: '0', 
            color: 'var(--warning-color)',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ${budget.amount}
          </p>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ 
            backgroundColor: 'var(--warning-color)',
            color: '#212529',
            padding: '4px 12px',
            borderRadius: '15px',
            fontWeight: '500'
          }}>
            {new Date(budget.year, budget.month - 1, 1).toLocaleString('default', { month: 'short' })} {budget.year}
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '10px',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <span>📅</span>
        <span>Budget period: {new Date(budget.year, budget.month - 1, 1).toLocaleString('default', { month: 'long' })} {budget.year}</span>
      </div>
      
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

export default BudgetItem;