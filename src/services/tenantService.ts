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

interface Tenant {
  id: string;
  name: string;
  slug: string;
  displayName?: string;
  isActive: boolean;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings: Record<string, any>;
  databaseSchema: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTenantDto {
  name: string;
  slug: string;
  displayName?: string;
  isActive?: boolean;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings?: Record<string, any>;
}

interface UpdateTenantDto {
  name?: string;
  slug?: string;
  displayName?: string;
  isActive?: boolean;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings?: Record<string, any>;
}

const tenantService = {
  getAllTenants: async (): Promise<Tenant[]> => {
    const response = await API.get('/tenants');
    return response.data;
  },
  
  getTenantById: async (id: string): Promise<Tenant> => {
    const response = await API.get(`/tenants/${id}`);
    return response.data;
  },
  
  getTenantBySlug: async (slug: string): Promise<Tenant> => {
    const response = await API.get(`/tenants/slug/${slug}`);
    return response.data;
  },
  
  createTenant: async (tenant: CreateTenantDto): Promise<Tenant> => {
    const response = await API.post('/tenants', tenant);
    return response.data;
  },
  
  updateTenant: async (id: string, tenant: UpdateTenantDto): Promise<Tenant> => {
    const response = await API.patch(`/tenants/${id}`, tenant);
    return response.data;
  },
  
  deleteTenant: async (id: string): Promise<void> => {
    await API.delete(`/tenants/${id}`);
  },
};

export default tenantService;
export type { Tenant, CreateTenantDto, UpdateTenantDto };