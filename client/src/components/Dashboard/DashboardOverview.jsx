// client/src/components/Dashboard/DashboardOverview.jsx
import React, { useContext } from 'react';
import { DashboardContext } from '../../context/DashboardContext';

const DashboardOverview = () => {
  const { dashboardData, loading, error } = useContext(DashboardContext);

  if (loading) return <div className="card fade-in">Loading dashboard...</div>;
  if (error) return <div className="card fade-in">Error: {error}</div>;

  const { overview, recentExpenses, recentIncome } = dashboardData;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Financial Overview</h2>
      </div>
      
      <div className="card-body">
        <div className="grid grid-cols-3" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ 
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid var(--success-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--success-color)' }}>Total Income</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--success-color)' }}>
              ${overview.totalIncome.toFixed(2)}
            </p>
          </div>
          
          <div className="card" style={{ 
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid var(--secondary-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>Total Expenses</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--secondary-color)' }}>
              ${overview.totalExpenses.toFixed(2)}
            </p>
          </div>
          
          <div className="card" style={{ 
            backgroundColor: 'rgba(23, 162, 184, 0.1)',
            border: '1px solid var(--info-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--info-color)' }}>Balance</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--info-color)' }}>
              ${overview.balance.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2" style={{ gap: '30px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Recent Income</h3>
            {recentIncome.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No recent income</p>
            ) : (
              <div>
                {recentIncome.map(income => (
                  <div key={income.id} className="card" style={{ 
                    marginBottom: '10px',
                    backgroundColor: 'rgba(23, 162, 184, 0.05)'
                  }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}><strong>{income.source}</strong></p>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
                      ${income.amount} - {income.date}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Category: {income.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Recent Expenses</h3>
            {recentExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No recent expenses</p>
            ) : (
              <div>
                {recentExpenses.map(expense => (
                  <div key={expense.id} className="card" style={{ 
                    marginBottom: '10px',
                    backgroundColor: 'rgba(220, 53, 69, 0.05)'
                  }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}><strong>{expense.title}</strong></p>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
                      ${expense.amount} - {expense.date}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Category: {expense.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;