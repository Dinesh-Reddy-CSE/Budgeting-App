// client/src/components/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardOverview from './Dashboard/DashboardOverview';
import AddBudget from './Budget/AddBudget';
import BudgetList from './Budget/BudgetList';
import AddIncome from './Income/AddIncome';
import IncomeList from './Income/IncomeList';
import AddExpense from './Expenses/AddExpense';
import ExpenseList from './Expenses/ExpenseList';
import ThemeToggle from './ThemeToggle';

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="container">
      <ThemeToggle />
      
      <div className="card fade-in">
        <div className="card-header">
          <h1 style={{ margin: '0', color: 'var(--text-primary)' }}>Dashboard</h1>
        </div>
        <div className="card-body">
          <h2 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)' }}>
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)' }}>
            <strong>Email:</strong> {user?.email}
          </p>
          <button 
            onClick={handleLogout}
            className="secondary"
          >
            🔐 Logout
          </button>
        </div>
      </div>
      
      <div className="fade-in">
        <DashboardOverview />
      </div>
      
      <div className="mb-30 fade-in">
        <AddBudget />
      </div>
      
      <div className="mb-30 fade-in">
        <BudgetList />
      </div>
      
      <div className="mb-30 fade-in">
        <AddIncome />
      </div>
      
      <div className="mb-30 fade-in">
        <IncomeList />
      </div>
      
      <div className="mb-30 fade-in">
        <AddExpense />
      </div>
      
      <div className="fade-in">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Dashboard;