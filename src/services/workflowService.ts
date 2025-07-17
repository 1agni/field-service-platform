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

enum WorkflowExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

interface Workflow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
  definition: Record<string, any>;
  settings: Record<string, any>;
  isPublished: boolean;
  publishedVersion?: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  initiatorId?: string;
  status: WorkflowExecutionStatus;
  input: Record<string, any>;
  output: Record<string, any>;
  state: Record<string, any>;
  history: Record<string, any>[];
  error?: string;
  currentStepId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface CreateWorkflowDto {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  tenantId?: string;
  definition: Record<string, any>;
  settings?: Record<string, any>;
  isPublished?: boolean;
}

interface UpdateWorkflowDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  definition?: Record<string, any>;
  settings?: Record<string, any>;
  isPublished?: boolean;
}

interface ExecuteWorkflowDto {
  input?: Record<string, any>;
}

const workflowService = {
  getAllWorkflows: async (): Promise<Workflow[]> => {
    const response = await API.get('/workflows');
    return response.data;
  },
  
  getWorkflowById: async (id: string): Promise<Workflow> => {
    const response = await API.get(`/workflows/${id}`);
    return response.data;
  },
  
  getWorkflowBySlug: async (slug: string): Promise<Workflow> => {
    const response = await API.get(`/workflows/slug/${slug}`);
    return response.data;
  },
  
  createWorkflow: async (workflow: CreateWorkflowDto): Promise<Workflow> => {
    const response = await API.post('/workflows', workflow);
    return response.data;
  },
  
  updateWorkflow: async (id: string, workflow: UpdateWorkflowDto): Promise<Workflow> => {
    const response = await API.patch(`/workflows/${id}`, workflow);
    return response.data;
  },
  
  deleteWorkflow: async (id: string): Promise<void> => {
    await API.delete(`/workflows/${id}`);
  },
  
  executeWorkflow: async (workflowId: string, execution: ExecuteWorkflowDto): Promise<WorkflowExecution> => {
    const response = await API.post(`/workflows/${workflowId}/execute`, execution);
    return response.data;
  },
  
  getWorkflowExecutions: async (workflowId: string): Promise<WorkflowExecution[]> => {
    const response = await API.get(`/workflows/${workflowId}/executions`);
    return response.data;
  },
  
  getWorkflowExecution: async (executionId: string): Promise<WorkflowExecution> => {
    const response = await API.get(`/workflows/executions/${executionId}`);
    return response.data;
  },
  
  cancelWorkflowExecution: async (executionId: string): Promise<WorkflowExecution> => {
    const response = await API.post(`/workflows/executions/${executionId}/cancel`);
    return response.data;
  },
};

export default workflowService;
export { WorkflowExecutionStatus };
export type {
  Workflow,
  WorkflowExecution,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  ExecuteWorkflowDto,
};