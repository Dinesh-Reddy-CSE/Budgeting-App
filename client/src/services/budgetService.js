// client/src/services/budgetService.js
import API from './api';

export const getBudgets = async (params = {}) => {
  try {
    const response = await API.get('/budget', { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addBudget = async (budgetData) => {
  try {
    const response = await API.post('/budget', budgetData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await API.put(`/budget/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await API.delete(`/budget/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};