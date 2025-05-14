import api from './api';

export const getMyDiariesByDates = async (startDate, endDate) => {
  const response = await api.get('/my-diaries-by-dates', {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data;
};

export const createDiary = async (diaryData) => {
  const response = await api.post('/diaries', diaryData);
  return response.data;
};

export const updateDiary = async (diaryId, diaryData) => {
  const response = await api.put(`/diaries/${diaryId}`, diaryData);
  return response.data;
};

export const deleteDiary = async (diaryId) => {
  const response = await api.delete(`/diaries/${diaryId}`);
  return response.data;
};

export const getFeelings = async () => {
  const response = await api.get('/feelings');
  return response.data;
};

export const getFeelingReasons = async () => {
  const response = await api.get('/feeling-reasons');
  return response.data;
};

// Export a default service object for backward compatibility
export const diaryService = {
  getMyDiariesByDates,
  createDiary,
  updateDiary,
  deleteDiary,
  getFeelings,
  getFeelingReasons
}; 