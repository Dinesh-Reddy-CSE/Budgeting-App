// client/src/components/AuthRoutes.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ReportsPage from './Reports/ReportsPage';
import ThemeToggle from './ThemeToggle';

const AuthRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--background-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
          <p style={{ color: 'var(--text-primary)', fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  if (isAuthenticated) {
    return (
      <div style={{ position: 'relative' }}>
        {currentPage === 'dashboard' ? (
          <div>
            <div className="container">
              <div style={{ 
                backgroundColor: 'var(--background-secondary)', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={() => handleNavigation('dashboard')}
                    className="success"
                    style={{
                      padding: '12px 24px',
                      fontWeight: '500'
                    }}
                  >
                    🏠 Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigation('reports')}
                    style={{
                      padding: '12px 24px',
                      fontWeight: '500',
                      backgroundColor: 'var(--info-color)'
                    }}
                  >
                    📊 Reports
                  </button>
                </div>
              </div>
              <Dashboard />
            </div>
          </div>
        ) : (
          <div>
            <div className="container">
              <div style={{ 
                backgroundColor: 'var(--background-secondary)', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={() => handleNavigation('dashboard')}
                    style={{
                      padding: '12px 24px',
                      fontWeight: '500',
                      backgroundColor: 'var(--info-color)'
                    }}
                  >
                    🏠 Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigation('reports')}
                    className="success"
                    style={{
                      padding: '12px 24px',
                      fontWeight: '500'
                    }}
                  >
                    📊 Reports
                  </button>
                </div>
              </div>
              <ReportsPage />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ThemeToggle />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: 'var(--text-primary)', 
            fontSize: '36px',
            margin: '0 0 10px 0'
          }}>
            💰 Budgeting App
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '18px',
            margin: '0'
          }}>
            Track your finances with ease
          </p>
        </div>
        
        {showRegister ? (
          <>
            <Register />
            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              width: '100%',
              maxWidth: '400px'
            }}>
              <button 
                onClick={() => setShowRegister(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                ← Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <Login />
            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              width: '100%',
              maxWidth: '400px'
            }}>
              <button 
                onClick={() => setShowRegister(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                Create New Account →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthRoutes;