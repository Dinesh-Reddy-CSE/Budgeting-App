// client/src/context/ReportsContext.jsx
import React, { createContext, useState } from 'react';

export const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const value = {
    reportData,
    loading,
    error,
    setReportData,
    setLoading,
    setError
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};