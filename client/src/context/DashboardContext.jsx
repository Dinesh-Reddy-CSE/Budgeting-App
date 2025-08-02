// client/src/context/DashboardContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDashboardData as getDashboardDataService } from '../services/dashboardService';
import { AuthContext } from './AuthContext';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    },
    recentExpenses: [],
    recentIncome: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await getDashboardDataService();
      setDashboardData(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const value = {
    dashboardData,
    loading,
    error,
    fetchDashboardData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};