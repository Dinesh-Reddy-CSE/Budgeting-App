// client/src/services/expenseService.js
import API from './api';

export const getExpenses = async () => {
  try {
    const response = await API.get('/expenses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await API.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await API.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await API.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};