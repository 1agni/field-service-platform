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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  roles: string[];
  tenantId?: string;
  preferences: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  roles?: string[];
  tenantId?: string;
}

interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  roles?: string[];
  tenantId?: string;
  preferences?: Record<string, any>;
}

const userService = {
  getAllUsers: async (tenantId?: string): Promise<User[]> => {
    const response = await API.get('/users', {
      params: { tenantId },
    });
    return response.data;
  },
  
  getUserById: async (id: string): Promise<User> => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (user: CreateUserDto): Promise<User> => {
    const response = await API.post('/users', user);
    return response.data;
  },
  
  updateUser: async (id: string, user: UpdateUserDto): Promise<User> => {
    const response = await API.patch(`/users/${id}`, user);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await API.delete(`/users/${id}`);
  },
  
  changePassword: async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
    await API.post(`/users/${id}/change-password`, {
      currentPassword,
      newPassword,
    });
  },
};

export default userService;
export type { User, CreateUserDto, UpdateUserDto };