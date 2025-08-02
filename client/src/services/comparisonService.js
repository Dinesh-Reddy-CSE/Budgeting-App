// client/src/services/comparisonService.js
import API from './api';

// Get previous period data for comparison
export const getPreviousPeriodData = async (currentPeriod, currentDate) => {
  try {
    // Calculate previous period date
    const currentDateObj = new Date(currentDate);
    let previousDate;
    
    if (currentPeriod === 'month') {
      // Previous month
      previousDate = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth() - 1, 1);
    } else {
      // Previous week
      previousDate = new Date(currentDateObj);
      previousDate.setDate(currentDateObj.getDate() - 7);
    }
    
    const response = await API.get('/reports/summary', {
      params: {
        period: currentPeriod,
        date: previousDate.toISOString().split('T')[0]
      }
    });
    
    return response.data;
  } catch (error) {
    console.log('Could not fetch previous period data:', error);
    return null;
  }
};

// Calculate growth percentage
export const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};