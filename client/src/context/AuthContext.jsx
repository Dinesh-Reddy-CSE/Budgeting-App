// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';
import { ExpenseProvider } from './ExpenseContext';
import { IncomeProvider } from './IncomeContext';
import { BudgetProvider } from './BudgetContext';
import { DashboardProvider } from './DashboardContext';
import { ReportsProvider } from './ReportsContext';
import { NotificationsProvider } from './NotificationsContext';
import { ThemeProvider } from './ThemeContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    const response = await loginService(credentials);
    setUser(response.user);
    return response;
  };

  const logoutUser = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <ThemeProvider>
          <ExpenseProvider>
            <IncomeProvider>
              <BudgetProvider>
                <DashboardProvider>
                  <ReportsProvider>
                    <NotificationsProvider>
                      {children}
                    </NotificationsProvider>
                  </ReportsProvider>
                </DashboardProvider>
              </BudgetProvider>
            </IncomeProvider>
          </ExpenseProvider>
        </ThemeProvider>
      )}
    </AuthContext.Provider>
  );
};