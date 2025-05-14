import api from './api';

class AuthService {
  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      const userResponse = await this.getCurrentUser();
      // Get client ID if user is a client
      if (userResponse.client_id) {
        userResponse.id = userResponse.client_id;
      }
      localStorage.setItem('user', JSON.stringify(userResponse));
    }
    return response.data;
  }

  async registerClient(userData) {
    const response = await api.post('/register/client', userData);
    return response.data;
  }

  async registerTrainer(userData) {
    const response = await api.post('/register/trainer', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 