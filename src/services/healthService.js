import api from './api';

export const getMyStepsByDates = async (startDate, endDate) => {
  const response = await api.get('/my-steps-by-dates', {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data;
};

export const createSteps = async (stepsData) => {
  const response = await api.post('/steps', stepsData);
  return response.data;
};

export const updateSteps = async (stepsId, stepsData) => {
  const response = await api.put(`/steps/${stepsId}`, stepsData);
  return response.data;
};

export const deleteSteps = async (stepsId) => {
  const response = await api.delete(`/steps/${stepsId}`);
  return response.data;
};

export const getMyWaterByDates = async (startDate, endDate) => {
  const response = await api.get('/my-waters-by-dates', {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data;
};

export const createWater = async (waterData) => {
  const response = await api.post('/water', waterData);
  return response.data;
};

export const updateWater = async (waterId, waterData) => {
  const response = await api.put(`/water/${waterId}`, waterData);
  return response.data;
};

export const deleteWater = async (waterId) => {
  const response = await api.delete(`/water/${waterId}`);
  return response.data;
};

// Export a default service object for backward compatibility
export const healthService = {
  getMyStepsByDates,
  createSteps,
  updateSteps,
  deleteSteps,
  getMyWaterByDates,
  createWater,
  updateWater,
  deleteWater
}; 