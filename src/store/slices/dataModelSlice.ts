import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import dataModelService, {
  DataModel,
  DataModelField,
  CreateDataModelDto,
  UpdateDataModelDto,
  CreateDataModelFieldDto,
  UpdateDataModelFieldDto,
} from '../../services/dataModelService';

interface DataModelState {
  dataModels: DataModel[];
  currentDataModel: DataModel | null;
  records: Record<string, any>[];
  totalRecords: number;
  currentRecord: Record<string, any> | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataModelState = {
  dataModels: [],
  currentDataModel: null,
  records: [],
  totalRecords: 0,
  currentRecord: null,
  loading: false,
  error: null,
};

// Data Model CRUD operations
export const fetchDataModels = createAsyncThunk(
  'dataModel/fetchDataModels',
  async (_, { rejectWithValue }) => {
    try {
      return await dataModelService.getAllDataModels();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data models');
    }
  }
);

export const fetchDataModelById = createAsyncThunk(
  'dataModel/fetchDataModelById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await dataModelService.getDataModelById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data model');
    }
  }
);

export const createDataModel = createAsyncThunk(
  'dataModel/createDataModel',
  async (dataModel: CreateDataModelDto, { rejectWithValue }) => {
    try {
      return await dataModelService.createDataModel(dataModel);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create data model');
    }
  }
);

export const updateDataModel = createAsyncThunk(
  'dataModel/updateDataModel',
  async ({ id, dataModel }: { id: string; dataModel: UpdateDataModelDto }, { rejectWithValue }) => {
    try {
      return await dataModelService.updateDataModel(id, dataModel);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update data model');
    }
  }
);

export const deleteDataModel = createAsyncThunk(
  'dataModel/deleteDataModel',
  async (id: string, { rejectWithValue }) => {
    try {
      await dataModelService.deleteDataModel(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete data model');
    }
  }
);

// Field CRUD operations
export const addField = createAsyncThunk(
  'dataModel/addField',
  async ({ dataModelId, field }: { dataModelId: string; field: CreateDataModelFieldDto }, { rejectWithValue }) => {
    try {
      return await dataModelService.addField(dataModelId, field);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add field');
    }
  }
);

export const updateField = createAsyncThunk(
  'dataModel/updateField',
  async ({ fieldId, field }: { fieldId: string; field: UpdateDataModelFieldDto }, { rejectWithValue }) => {
    try {
      return await dataModelService.updateField(fieldId, field);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update field');
    }
  }
);

export const deleteField = createAsyncThunk(
  'dataModel/deleteField',
  async (fieldId: string, { rejectWithValue }) => {
    try {
      await dataModelService.deleteField(fieldId);
      return fieldId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete field');
    }
  }
);

// Record CRUD operations
export const fetchRecords = createAsyncThunk(
  'dataModel/fetchRecords',
  async (
    {
      modelId,
      options,
    }: {
      modelId: string;
      options?: {
        filter?: Record<string, any>;
        sort?: Record<string, 'ASC' | 'DESC'>;
        limit?: number;
        offset?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      return await dataModelService.getRecords(modelId, options);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch records');
    }
  }
);

export const fetchRecordById = createAsyncThunk(
  'dataModel/fetchRecordById',
  async ({ modelId, recordId }: { modelId: string; recordId: string }, { rejectWithValue }) => {
    try {
      return await dataModelService.getRecord(modelId, recordId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch record');
    }
  }
);

export const createRecord = createAsyncThunk(
  'dataModel/createRecord',
  async ({ modelId, data }: { modelId: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      return await dataModelService.createRecord(modelId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create record');
    }
  }
);

export const updateRecord = createAsyncThunk(
  'dataModel/updateRecord',
  async (
    { modelId, recordId, data }: { modelId: string; recordId: string; data: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      return await dataModelService.updateRecord(modelId, recordId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update record');
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'dataModel/deleteRecord',
  async ({ modelId, recordId }: { modelId: string; recordId: string }, { rejectWithValue }) => {
    try {
      await dataModelService.deleteRecord(modelId, recordId);
      return recordId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete record');
    }
  }
);

const dataModelSlice = createSlice({
  name: 'dataModel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDataModel: (state) => {
      state.currentDataModel = null;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearRecords: (state) => {
      state.records = [];
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch data models
      .addCase(fetchDataModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataModels.fulfilled, (state, action) => {
        state.loading = false;
        state.dataModels = action.payload;
      })
      .addCase(fetchDataModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch data model by ID
      .addCase(fetchDataModelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataModelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDataModel = action.payload;
      })
      .addCase(fetchDataModelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create data model
      .addCase(createDataModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDataModel.fulfilled, (state, action) => {
        state.loading = false;
        state.dataModels.push(action.payload);
        state.currentDataModel = action.payload;
      })
      .addCase(createDataModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update data model
      .addCase(updateDataModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDataModel.fulfilled, (state, action) => {
        state.loading = false;
        state.dataModels = state.dataModels.map((dataModel) =>
          dataModel.id === action.payload.id ? action.payload : dataModel
        );
        state.currentDataModel = action.payload;
      })
      .addCase(updateDataModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete data model
      .addCase(deleteDataModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDataModel.fulfilled, (state, action) => {
        state.loading = false;
        state.dataModels = state.dataModels.filter((dataModel) => dataModel.id !== action.payload);
        if (state.currentDataModel?.id === action.payload) {
          state.currentDataModel = null;
        }
      })
      .addCase(deleteDataModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add field
      .addCase(addField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentDataModel) {
          state.currentDataModel.fields = [...state.currentDataModel.fields, action.payload];
        }
      })
      .addCase(addField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update field
      .addCase(updateField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentDataModel) {
          state.currentDataModel.fields = state.currentDataModel.fields.map((field) =>
            field.id === action.payload.id ? action.payload : field
          );
        }
      })
      .addCase(updateField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete field
      .addCase(deleteField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentDataModel) {
          state.currentDataModel.fields = state.currentDataModel.fields.filter(
            (field) => field.id !== action.payload
          );
        }
      })
      .addCase(deleteField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch records
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.totalRecords = action.payload.total;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch record by ID
      .addCase(fetchRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create record
      .addCase(createRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [action.payload, ...state.records];
        state.totalRecords += 1;
        state.currentRecord = action.payload;
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update record
      .addCase(updateRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.map((record) =>
          record.id === action.payload.id ? action.payload : record
        );
        state.currentRecord = action.payload;
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete record
      .addCase(deleteRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter((record) => record.id !== action.payload);
        state.totalRecords -= 1;
        if (state.currentRecord?.id === action.payload) {
          state.currentRecord = null;
        }
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentDataModel, clearCurrentRecord, clearRecords } = dataModelSlice.actions;

export const selectDataModel = (state: RootState) => state.dataModel;

export default dataModelSlice.reducer;