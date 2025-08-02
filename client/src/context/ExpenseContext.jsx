// client/src/context/ExpenseContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getExpenses as getExpensesService } from '../services/expenseService';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchExpenses = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await getExpensesService();
      setExpenses(response.expenses);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [isAuthenticated]);

  const value = {
    expenses,
    loading,
    error,
    fetchExpenses,
    setExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};