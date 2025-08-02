// client/src/context/IncomeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getIncome as getIncomeService } from '../services/incomeService';
import { AuthContext } from './AuthContext';

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchIncome = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await getIncomeService();
      setIncome(response.income);
    } catch (err) {
      setError(err.message || 'Failed to fetch income');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [isAuthenticated]);

  const value = {
    income,
    loading,
    error,
    fetchIncome,
    setIncome
  };

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};