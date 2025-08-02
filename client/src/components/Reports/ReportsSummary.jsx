// client/src/components/Reports/ReportsSummary.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getSummary, exportData } from '../../services/reportsService';
import { getPreviousPeriodData, calculateGrowth } from '../../services/comparisonService';
import { ReportsContext } from '../../context/ReportsContext';
// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportsSummary = ({ filters }) => {
  const [summary, setSummary] = useState(null);
  const [previousSummary, setPreviousSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setLoading: setContextLoading, setError: setContextError } = useContext(ReportsContext);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      setContextLoading(true);
      setContextError('');
      
      // Fetch current period data
      const response = await getSummary(filters);
      setSummary(response);
      
      // Fetch previous period data for comparison
      const prevResponse = await getPreviousPeriodData(filters.period, filters.date);
      setPreviousSummary(prevResponse);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch report summary';
      setError(errorMessage);
      setContextError(errorMessage);
    } finally {
      setLoading(false);
      setContextLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const blob = await exportData({
        ...filters,
        type
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${filters.period}_${filters.date}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export ' + (err.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  if (loading) return (
    <div className="card fade-in">
      <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
        <p>Loading report data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="card fade-in">
      <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
        <p>Error: {error}</p>
      </div>
    </div>
  );

  if (!summary) return (
    <div className="card fade-in">
      <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
        <p>No report data available</p>
      </div>
    </div>
  );

  const { period, totals, byCategory, details } = summary;
  const hasPreviousData = previousSummary && previousSummary.totals;

  // Calculate growth percentages
  const incomeGrowth = hasPreviousData ? calculateGrowth(totals.totalIncome, previousSummary.totals.totalIncome) : 0;
  const expenseGrowth = hasPreviousData ? calculateGrowth(totals.totalExpenses, previousSummary.totals.totalExpenses) : 0;
  const balanceGrowth = hasPreviousData ? calculateGrowth(totals.balance, previousSummary.totals.balance) : 0;

  // Format period dates
  const startDate = new Date(period.startDate).toLocaleDateString();
  const endDate = new Date(period.endDate).toLocaleDateString();

  // Prepare chart data
  const expenseCategories = Object.keys(byCategory.expenses);
  const expenseAmounts = Object.values(byCategory.expenses);
  
  const incomeCategories = Object.keys(byCategory.income);
  const incomeAmounts = Object.values(byCategory.income);

  // Expense by category chart data
  const expenseChartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: expenseAmounts,
        backgroundColor: [
          'rgba(220, 53, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(108, 117, 125, 0.8)',
          'rgba(111, 66, 193, 0.8)',
          'rgba(233, 30, 99, 0.8)'
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(108, 117, 125, 1)',
          'rgba(111, 66, 193, 1)',
          'rgba(233, 30, 99, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Income by category chart data
  const incomeChartData = {
    labels: incomeCategories,
    datasets: [
      {
        label: 'Income by Category',
        data: incomeAmounts,
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(108, 117, 125, 0.8)',
          'rgba(111, 66, 193, 0.8)',
          'rgba(233, 30, 99, 0.8)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(108, 117, 125, 1)',
          'rgba(111, 66, 193, 1)',
          'rgba(233, 30, 99, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Comparison chart data
  const comparisonData = {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [
      {
        label: 'Current Period',
        data: [totals.totalIncome, totals.totalExpenses, totals.balance],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(13, 202, 240, 0.8)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(13, 202, 240, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    }
  };

  // Growth indicator component
  const GrowthIndicator = ({ value }) => {
    if (value > 0) {
      return <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>↗ {value.toFixed(1)}%</span>;
    } else if (value < 0) {
      return <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>↘ {Math.abs(value).toFixed(1)}%</span>;
    } else {
      return <span style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>→ 0.0%</span>;
    }
  };

  return (
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
            <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>
              {period.type === 'week' ? 'Weekly' : 'Monthly'} Financial Report
            </h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Period: {startDate} - {endDate}
              {hasPreviousData && (
                <span style={{ display: 'block', marginTop: '5px' }}>
                  Compared to previous period
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleExport('expenses')}
              className="secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              📥 Export Expenses
            </button>
            <button 
              onClick={() => handleExport('income')}
              className="success"
              style={{ whiteSpace: 'nowrap' }}
            >
              📥 Export Income
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        {/* Financial Overview Cards with Growth */}
        <div className="grid grid-cols-3" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ 
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid var(--success-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--success-color)' }}>Total Income</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--success-color)' }}>
              ${totals.totalIncome.toFixed(2)}
            </p>
            {hasPreviousData && (
              <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
                <GrowthIndicator value={incomeGrowth} />
              </p>
            )}
          </div>
          
          <div className="card" style={{ 
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid var(--secondary-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>Total Expenses</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--secondary-color)' }}>
              ${totals.totalExpenses.toFixed(2)}
            </p>
            {hasPreviousData && (
              <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
                <GrowthIndicator value={expenseGrowth} />
              </p>
            )}
          </div>
          
          <div className="card" style={{ 
            backgroundColor: 'rgba(23, 162, 184, 0.1)',
            border: '1px solid var(--info-color)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--info-color)' }}>Balance</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: 'var(--info-color)' }}>
              ${totals.balance.toFixed(2)}
            </p>
            {hasPreviousData && (
              <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
                <GrowthIndicator value={balanceGrowth} />
              </p>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2" style={{ gap: '30px', marginBottom: '30px' }}>
          <div className="card">
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              📊 Expense Distribution
            </h3>
            {expenseCategories.length > 0 ? (
              <div className="chart-container">
                <Pie data={expenseChartData} options={pieChartOptions} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <p>No expense data available for charts</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              💰 Income Distribution
            </h3>
            {incomeCategories.length > 0 ? (
              <div className="chart-container">
                <Pie data={incomeChartData} options={pieChartOptions} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <p>No income data available for charts</p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '10px'
          }}>
            📈 Financial Overview
          </h3>
          <div className="chart-container">
            <Bar data={comparisonData} options={chartOptions} />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2" style={{ gap: '30px' }}>
          <div className="card">
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              💸 Expenses by Category
            </h3>
            {Object.keys(byCategory.expenses).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No expenses for this period
              </p>
            ) : (
              <div>
                {Object.entries(byCategory.expenses).map(([category, amount]) => (
                  <div key={category} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontWeight: '500' }}>{category}</span>
                    <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              💰 Income by Category
            </h3>
            {Object.keys(byCategory.income).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No income for this period
              </p>
            ) : (
              <div>
                {Object.entries(byCategory.income).map(([category, amount]) => (
                  <div key={category} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontWeight: '500' }}>{category}</span>
                    <span style={{ fontWeight: '600', color: 'var(--success-color)' }}>${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights Section */}
        <div className="card" style={{ marginTop: '30px', backgroundColor: 'rgba(13, 202, 240, 0.05)' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: 'var(--info-color)',
            borderBottom: '1px solid var(--info-color)',
            paddingBottom: '10px'
          }}>
            🎯 Financial Insights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--success-color)' }}>Savings Rate</h4>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: '0', 
                color: 'var(--success-color)'
              }}>
                {totals.totalIncome > 0 ? ((totals.balance / totals.totalIncome) * 100).toFixed(1) : '0.0'}%
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Percentage of income saved
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(255, 193, 7, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid rgba(255, 193, 7, 0.3)'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--warning-color)' }}>Expense Ratio</h4>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: '0', 
                color: 'var(--warning-color)'
              }}>
                {totals.totalIncome > 0 ? ((totals.totalExpenses / totals.totalIncome) * 100).toFixed(1) : '0.0'}%
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Percentage of income spent
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>Net Worth</h4>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: '0', 
                color: 'var(--secondary-color)'
              }}>
                ${totals.balance.toFixed(2)}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Current financial position
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSummary;