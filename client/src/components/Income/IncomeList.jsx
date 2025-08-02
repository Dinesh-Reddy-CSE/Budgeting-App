// client/src/components/Income/IncomeList.jsx
import React, { useContext, useEffect } from 'react';
import { IncomeContext } from '../../context/IncomeContext';
import IncomeItem from './IncomeItem';

const IncomeList = () => {
  const { income, loading, error, fetchIncome } = useContext(IncomeContext);

  useEffect(() => {
    fetchIncome();
  }, []);

  if (loading) return <div className="card fade-in">Loading income...</div>;
  if (error) return <div className="card fade-in">Error: {error}</div>;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Income</h2>
      </div>
      
      <div className="card-body">
        {income.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              💰 No income found
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Add your first income source to get started!
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Showing {income.length} income entr{income.length !== 1 ? 'ies' : 'y'}
            </p>
            <div>
              {income.map(inc => (
                <IncomeItem key={inc.id} income={inc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;