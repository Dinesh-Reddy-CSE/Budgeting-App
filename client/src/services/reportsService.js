// client/src/services/reportService.js
import API from './api';

export const getSummary = async (params = {}) => {
  try {
    const response = await API.get('/reports/summary', { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const exportData = async (params = {}) => {
  try {
    const response = await API.get('/reports/export', { 
      params,
      responseType: 'blob' // Important for file download
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};