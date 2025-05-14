import api from './api';

export const getMyTrainingPlans = async () => {
  const response = await api.get('/my-training-plans');
  return response.data;
};

export const createTrainingPlan = async (planData) => {
  const response = await api.post('/training-plans', planData);
  return response.data;
};

export const deleteTrainingPlan = async (planId) => {
  const response = await api.delete(`/training-plans/${planId}`);
  return response.data;
};

export const getMyWorkouts = async () => {
  const response = await api.get('/my-workouts');
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const deleteWorkout = async (workoutId) => {
  const response = await api.delete(`/workouts/${workoutId}`);
  return response.data;
};

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

export const trainingService = {
  getMyTrainingPlans,
  createTrainingPlan,
  deleteTrainingPlan,
  getMyWorkouts,
  createWorkout,
  deleteWorkout,
  getMyExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseTypes: async () => {
    const response = await api.get('/exercise-types');
    return response.data;
  },
  getExerciseDifficultyLevels: async () => {
    const response = await api.get('/exercise-difficulty-levels');
    return response.data;
  },
  getExerciseStages: async () => {
    const response = await api.get('/exercise-stages');
    return response.data;
  }
}; 