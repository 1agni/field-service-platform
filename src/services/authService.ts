import axios from 'axios';
import { API_URL } from '../config';

const API = axios.create({
  baseURL: API_URL,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (email: string, password: string) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, firstName: string, lastName: string, tenantId?: string) => {
    const response = await API.post('/auth/register', { email, password, firstName, lastName, tenantId });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await API.post('/auth/refresh-token');
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;