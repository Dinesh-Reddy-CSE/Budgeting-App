// client/src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(credentials);
      setError('');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '400px', margin: '30px auto' }}>
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)', textAlign: 'center' }}>
          🔐 Login
        </h2>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="notification error show" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" style={{ width: '100%', marginTop: '20px' }}>
            🚀 Sign In
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          paddingTop: '20px', 
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
            Don't have an account? Register above
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;