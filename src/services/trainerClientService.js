import api from './api';

class TrainerClientService {
  async getMyTrainers() {
    const response = await api.get('/my-trainers');
    return response.data.data;
  }

  async getMyClients() {
    const response = await api.get('/my-clients');
    return response.data.data;
  }

  async addTrainerToClient(clientId, trainerId) {
    const response = await api.post(`/clients/${clientId}/trainers/${trainerId}`);
    return response.data;
  }

  async removeTrainerFromClient(clientId, trainerId) {
    const response = await api.delete(`/clients/${clientId}/trainers/${trainerId}`);
    return response.data;
  }
}

export const trainerClientService = new TrainerClientService(); 