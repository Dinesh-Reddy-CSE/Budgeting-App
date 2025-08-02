// client/src/context/BudgetContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBudgets as getBudgetsService } from '../services/budgetService';
import { AuthContext } from './AuthContext';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchBudgets = async (params = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await getBudgetsService(params);
      setBudgets(response.budgets);
    } catch (err) {
      setError(err.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [isAuthenticated]);

  const value = {
    budgets,
    loading,
    error,
    fetchBudgets,
    setBudgets
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};