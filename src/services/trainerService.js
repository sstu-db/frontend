import api from './api';

export const getMyClients = async () => {
  const response = await api.get('/my-clients');
  return response.data;
};

export const addClientToTrainer = async (clientId, trainerId) => {
  const response = await api.post(`/clients/${clientId}/trainers/${trainerId}`);
  return response.data;
};

export const removeClientFromTrainer = async (clientId, trainerId) => {
  const response = await api.delete(`/clients/${clientId}/trainers/${trainerId}`);
  return response.data;
};

// Export a default service object for backward compatibility
export const trainerService = {
  getMyClients,
  addClientToTrainer,
  removeClientFromTrainer
}; 