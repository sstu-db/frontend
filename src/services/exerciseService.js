import api from './api';

export const getMyExercises = async () => {
  const response = await api.get('/my-exercises');
  return response.data;
};

export const createExercise = async (exerciseData) => {
  const response = await api.post('/exercises', exerciseData);
  return response.data;
};

export const updateExercise = async (exerciseId, exerciseData) => {
  const response = await api.put(`/exercises/${exerciseId}`, exerciseData);
  return response.data;
};

export const deleteExercise = async (exerciseId) => {
  const response = await api.delete(`/exercises/${exerciseId}`);
  return response.data;
};

// Export a default service object for backward compatibility
export const exerciseService = {
  getMyExercises,
  createExercise,
  updateExercise,
  deleteExercise
}; 