// client/src/services/api.js
import axios from 'axios';

// Detect if we're running on localhost or network
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '[::1]';

// Set API base URL based on environment
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:5000/api'
  : `http://${window.location.hostname}:5000/api`;

console.log('API Base URL:', API_BASE_URL); // For debugging

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;