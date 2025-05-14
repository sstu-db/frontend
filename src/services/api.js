import axios from 'axios';

import { API_URL } from '../config';
// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getMyTrainers = async () => {
  const response = await api.get('/my-trainers');
  return response.data;
};

export const getMyClients = async () => {
  const response = await api.get('/my-clients');
  return response.data;
};

export const addTrainerToClient = async (clientId, trainerId) => {
  const response = await api.post(`/clients/${clientId}/trainers/${trainerId}`);
  return response.data;
};

export const removeTrainerFromClient = async (clientId, trainerId) => {
  const response = await api.delete(`/clients/${clientId}/trainers/${trainerId}`);
  return response.data;
};

export const getAllTrainers = async () => {
  const response = await api.get('/trainers');
  return response.data;
};

export const getAllClients = async () => {
  const response = await api.get('/clients');
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

export default api; 