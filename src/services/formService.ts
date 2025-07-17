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

interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
  dataModelId?: string;
  schema: Record<string, any>;
  settings: Record<string, any>;
  validations: Record<string, any>;
  layout: Record<string, any>;
  isPublished: boolean;
  publishedVersion?: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface FormSubmission {
  id: string;
  formId: string;
  submitterId?: string;
  data: Record<string, any>;
  recordId?: string;
  status: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CreateFormDto {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  tenantId?: string;
  dataModelId?: string;
  schema: Record<string, any>;
  settings?: Record<string, any>;
  validations?: Record<string, any>;
  layout?: Record<string, any>;
  isPublished?: boolean;
}

interface UpdateFormDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  dataModelId?: string;
  schema?: Record<string, any>;
  settings?: Record<string, any>;
  validations?: Record<string, any>;
  layout?: Record<string, any>;
  isPublished?: boolean;
}

interface CreateFormSubmissionDto {
  data: Record<string, any>;
  status?: string;
  metadata?: Record<string, any>;
}

const formService = {
  getAllForms: async (): Promise<Form[]> => {
    const response = await API.get('/forms');
    return response.data;
  },
  
  getFormById: async (id: string): Promise<Form> => {
    const response = await API.get(`/forms/${id}`);
    return response.data;
  },
  
  getFormBySlug: async (slug: string): Promise<Form> => {
    const response = await API.get(`/forms/slug/${slug}`);
    return response.data;
  },
  
  createForm: async (form: CreateFormDto): Promise<Form> => {
    const response = await API.post('/forms', form);
    return response.data;
  },
  
  updateForm: async (id: string, form: UpdateFormDto): Promise<Form> => {
    const response = await API.patch(`/forms/${id}`, form);
    return response.data;
  },
  
  deleteForm: async (id: string): Promise<void> => {
    await API.delete(`/forms/${id}`);
  },
  
  submitForm: async (formId: string, submission: CreateFormSubmissionDto): Promise<FormSubmission> => {
    const response = await API.post(`/forms/${formId}/submit`, submission);
    return response.data;
  },
  
  getFormSubmissions: async (formId: string): Promise<FormSubmission[]> => {
    const response = await API.get(`/forms/${formId}/submissions`);
    return response.data;
  },
  
  getFormSubmission: async (submissionId: string): Promise<FormSubmission> => {
    const response = await API.get(`/forms/submissions/${submissionId}`);
    return response.data;
  },
};

export default formService;
export type { Form, FormSubmission, CreateFormDto, UpdateFormDto, CreateFormSubmissionDto };