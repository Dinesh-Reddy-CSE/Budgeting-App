// client/src/components/Reports/ReportsPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ReportsSummary from './ReportsSummary';
import ReportsFilters from './ReportsFilters';
import ThemeToggle from '../ThemeToggle';

const ReportsPage = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    period: 'month',
    date: new Date().toISOString().split('T')[0]
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="container">
      <ThemeToggle />
      
      <div className="card fade-in">
        <div className="card-header">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{ margin: '0', color: 'var(--text-primary)' }}>Reports</h1>
              <h2 style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '18px' }}>
                Welcome, {user?.firstName} {user?.lastName}!
              </h2>
            </div>
            <button 
              onClick={handleLogout}
              className="secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              🔐 Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="card fade-in">
        <div className="card-header">
          <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Report Filters</h2>
        </div>
        <div className="card-body">
          <ReportsFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      
      <div className="fade-in">
        <ReportsSummary filters={filters} />
      </div>
    </div>
  );
};

export default ReportsPage;