// client/src/components/ThemeToggle.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="slide-in"
      style={{
        backgroundColor: theme === 'light' ? '#333' : '#f0f0f0',
        color: theme === 'light' ? '#f0f0f0' : '#333',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <span>🌙</span>
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <span>☀️</span>
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;