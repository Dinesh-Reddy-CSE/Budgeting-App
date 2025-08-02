// client/src/components/Reports/ReportsFilters.jsx
import React from 'react';

const ReportsFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      flexWrap: 'wrap',
      alignItems: 'end'
    }}>
      <div style={{ flex: '1', minWidth: '200px' }}>
        <label htmlFor="period" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Report Period
        </label>
        <select
          id="period"
          name="period"
          value={filters.period}
          onChange={handleChange}
          style={{ 
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-background)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="week">Weekly Report</option>
          <option value="month">Monthly Report</option>
        </select>
      </div>
      
      <div style={{ flex: '1', minWidth: '200px' }}>
        <label htmlFor="date" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Reference Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          style={{ 
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-background)',
            color: 'var(--text-primary)'
          }}
        />
      </div>
      
      <div style={{ alignSelf: 'end' }}>
        <button 
          onClick={() => onFilterChange({ ...filters })}
          style={{ 
            padding: '12px 24px',
            height: '42px'
          }}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default ReportsFilters;