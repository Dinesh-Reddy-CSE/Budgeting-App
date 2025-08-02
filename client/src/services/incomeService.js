// client/src/services/incomeService.js
import API from './api';

export const getIncome = async () => {
  try {
    const response = await API.get('/income');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addIncome = async (incomeData) => {
  try {
    const response = await API.post('/income', incomeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateIncome = async (id, incomeData) => {
  try {
    const response = await API.put(`/income/${id}`, incomeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteIncome = async (id) => {
  try {
    const response = await API.delete(`/income/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};