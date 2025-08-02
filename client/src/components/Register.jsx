// client/src/components/Register.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', userData);
      setSuccess('Registration successful! Logging you in...');
      setError('');
      
      // Automatically login after registration
      setTimeout(async () => {
        await loginUser({
          email: userData.email,
          password: userData.password
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '400px', margin: '30px auto' }}>
      <div className="card-header">
        <h2 style={{ margin: '0', color: 'var(--text-primary)', textAlign: 'center' }}>
          📝 Register
        </h2>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="notification error show" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="notification success show" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={userData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={userData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
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
              placeholder="Create a password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="success" style={{ width: '100%', marginTop: '20px' }}>
            🎉 Create Account
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          paddingTop: '20px', 
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
            Already have an account? Login above
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;