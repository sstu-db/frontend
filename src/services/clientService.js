import api from './api';

export const getMyTrainers = async () => {
  const response = await api.get('/my-trainers');
  return response.data;
};

// Export a default service object for backward compatibility
export const clientService = {
  getMyTrainers
}; 