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

enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RELATION = 'relation',
  FILE = 'file',
  IMAGE = 'image',
  RICH_TEXT = 'rich_text',
  JSON = 'json',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  FORMULA = 'formula',
  LOOKUP = 'lookup',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  CREATED_BY = 'created_by',
  UPDATED_BY = 'updated_by',
}

interface DataModelField {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: FieldType;
  isRequired: boolean;
  isUnique: boolean;
  isSystem: boolean;
  isVisible: boolean;
  isEditable: boolean;
  isFilterable: boolean;
  isSortable: boolean;
  isSearchable: boolean;
  validations: Record<string, any>;
  settings: Record<string, any>;
  defaultValue?: string;
  dataModelId: string;
  relatedModelId?: string;
  relatedFieldId?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface DataModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
  fields: DataModelField[];
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CreateDataModelFieldDto {
  name: string;
  slug: string;
  description?: string;
  type: FieldType;
  isRequired?: boolean;
  isUnique?: boolean;
  isSystem?: boolean;
  isVisible?: boolean;
  isEditable?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  validations?: Record<string, any>;
  settings?: Record<string, any>;
  defaultValue?: string;
  relatedModelId?: string;
  relatedFieldId?: string;
  displayOrder?: number;
}

interface CreateDataModelDto {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  tenantId?: string;
  fields?: CreateDataModelFieldDto[];
  settings?: Record<string, any>;
}

interface UpdateDataModelDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  fields?: CreateDataModelFieldDto[];
  settings?: Record<string, any>;
}

interface UpdateDataModelFieldDto {
  name?: string;
  slug?: string;
  description?: string;
  type?: FieldType;
  isRequired?: boolean;
  isUnique?: boolean;
  isSystem?: boolean;
  isVisible?: boolean;
  isEditable?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  validations?: Record<string, any>;
  settings?: Record<string, any>;
  defaultValue?: string;
  relatedModelId?: string;
  relatedFieldId?: string;
  displayOrder?: number;
}

const dataModelService = {
  getAllDataModels: async (): Promise<DataModel[]> => {
    const response = await API.get('/data-models');
    return response.data;
  },
  
  getDataModelById: async (id: string): Promise<DataModel> => {
    const response = await API.get(`/data-models/${id}`);
    return response.data;
  },
  
  getDataModelBySlug: async (slug: string): Promise<DataModel> => {
    const response = await API.get(`/data-models/slug/${slug}`);
    return response.data;
  },
  
  createDataModel: async (dataModel: CreateDataModelDto): Promise<DataModel> => {
    const response = await API.post('/data-models', dataModel);
    return response.data;
  },
  
  updateDataModel: async (id: string, dataModel: UpdateDataModelDto): Promise<DataModel> => {
    const response = await API.patch(`/data-models/${id}`, dataModel);
    return response.data;
  },
  
  deleteDataModel: async (id: string): Promise<void> => {
    await API.delete(`/data-models/${id}`);
  },
  
  addField: async (dataModelId: string, field: CreateDataModelFieldDto): Promise<DataModelField> => {
    const response = await API.post(`/data-models/${dataModelId}/fields`, field);
    return response.data;
  },
  
  updateField: async (fieldId: string, field: UpdateDataModelFieldDto): Promise<DataModelField> => {
    const response = await API.patch(`/data-models/fields/${fieldId}`, field);
    return response.data;
  },
  
  deleteField: async (fieldId: string): Promise<void> => {
    await API.delete(`/data-models/fields/${fieldId}`);
  },
  
  // Dynamic data operations
  createRecord: async (modelId: string, data: Record<string, any>): Promise<Record<string, any>> => {
    const response = await API.post(`/data/${modelId}`, data);
    return response.data;
  },
  
  getRecords: async (
    modelId: string,
    options?: {
      filter?: Record<string, any>;
      sort?: Record<string, 'ASC' | 'DESC'>;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: Record<string, any>[]; total: number }> => {
    const params: Record<string, any> = {};
    
    if (options?.filter) {
      params.filter = JSON.stringify(options.filter);
    }
    
    if (options?.sort) {
      params.sort = JSON.stringify(options.sort);
    }
    
    if (options?.limit !== undefined) {
      params.limit = options.limit;
    }
    
    if (options?.offset !== undefined) {
      params.offset = options.offset;
    }
    
    const response = await API.get(`/data/${modelId}`, { params });
    return response.data;
  },
  
  getRecord: async (modelId: string, recordId: string): Promise<Record<string, any>> => {
    const response = await API.get(`/data/${modelId}/${recordId}`);
    return response.data;
  },
  
  updateRecord: async (modelId: string, recordId: string, data: Record<string, any>): Promise<Record<string, any>> => {
    const response = await API.patch(`/data/${modelId}/${recordId}`, data);
    return response.data;
  },
  
  deleteRecord: async (modelId: string, recordId: string): Promise<void> => {
    await API.delete(`/data/${modelId}/${recordId}`);
  },
};

export default dataModelService;
export { FieldType };
export type {
  DataModel,
  DataModelField,
  CreateDataModelDto,
  UpdateDataModelDto,
  CreateDataModelFieldDto,
  UpdateDataModelFieldDto,
};