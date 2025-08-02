// client/src/components/Budget/BudgetList.jsx
import React, { useContext, useEffect } from 'react';
import { BudgetContext } from '../../context/BudgetContext';
import BudgetItem from './BudgetItem';

const BudgetList = () => {
  const { budgets, loading, error, fetchBudgets } = useContext(BudgetContext);

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return <div className="card fade-in">Loading budgets...</div>;
  if (error) return <div className="card fade-in">Error: {error}</div>;

  // Group budgets by year and month for better organization
  const groupedBudgets = budgets.reduce((acc, budget) => {
    const key = `${budget.year}-${budget.month}`;
    if (!acc[key]) {
      acc[key] = {
        year: budget.year,
        month: budget.month,
        budgets: []
      };
    }
    acc[key].budgets.push(budget);
    return acc;
  }, {});

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Budgets</h2>
      </div>
      
      <div className="card-body">
        {budgets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              📊 No budgets found
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Set your first budget to start tracking your spending!
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Showing {budgets.length} budget entr{budgets.length !== 1 ? 'ies' : 'y'}
            </p>
            
            {Object.keys(groupedBudgets).map(key => {
              const group = groupedBudgets[key];
              const monthName = new Date(group.year, group.month - 1, 1).toLocaleString('default', { month: 'long' });
              
              return (
                <div key={key} style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    color: 'var(--text-primary)', 
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '10px',
                    marginBottom: '15px'
                  }}>
                    {monthName} {group.year}
                  </h3>
                  
                  <div className="grid grid-cols-1" style={{ gap: '15px' }}>
                    {group.budgets.map(budget => (
                      <BudgetItem key={budget.id} budget={budget} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetList;