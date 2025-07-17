import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import workflowService, {
  Workflow,
  WorkflowExecution,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  ExecuteWorkflowDto,
} from '../../services/workflowService';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  executions: WorkflowExecution[];
  currentExecution: WorkflowExecution | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  executions: [],
  currentExecution: null,
  loading: false,
  error: null,
};

// Workflow CRUD operations
export const fetchWorkflows = createAsyncThunk(
  'workflow/fetchWorkflows',
  async (_, { rejectWithValue }) => {
    try {
      return await workflowService.getAllWorkflows();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflows');
    }
  }
);

export const fetchWorkflowById = createAsyncThunk(
  'workflow/fetchWorkflowById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await workflowService.getWorkflowById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflow');
    }
  }
);

export const fetchWorkflowBySlug = createAsyncThunk(
  'workflow/fetchWorkflowBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await workflowService.getWorkflowBySlug(slug);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflow');
    }
  }
);

export const createWorkflow = createAsyncThunk(
  'workflow/createWorkflow',
  async (workflow: CreateWorkflowDto, { rejectWithValue }) => {
    try {
      return await workflowService.createWorkflow(workflow);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workflow');
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  'workflow/updateWorkflow',
  async ({ id, workflow }: { id: string; workflow: UpdateWorkflowDto }, { rejectWithValue }) => {
    try {
      return await workflowService.updateWorkflow(id, workflow);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workflow');
    }
  }
);

export const deleteWorkflow = createAsyncThunk(
  'workflow/deleteWorkflow',
  async (id: string, { rejectWithValue }) => {
    try {
      await workflowService.deleteWorkflow(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workflow');
    }
  }
);

// Workflow execution operations
export const executeWorkflow = createAsyncThunk(
  'workflow/executeWorkflow',
  async ({ workflowId, execution }: { workflowId: string; execution: ExecuteWorkflowDto }, { rejectWithValue }) => {
    try {
      return await workflowService.executeWorkflow(workflowId, execution);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to execute workflow');
    }
  }
);

export const fetchWorkflowExecutions = createAsyncThunk(
  'workflow/fetchWorkflowExecutions',
  async (workflowId: string, { rejectWithValue }) => {
    try {
      return await workflowService.getWorkflowExecutions(workflowId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflow executions');
    }
  }
);

export const fetchWorkflowExecution = createAsyncThunk(
  'workflow/fetchWorkflowExecution',
  async (executionId: string, { rejectWithValue }) => {
    try {
      return await workflowService.getWorkflowExecution(executionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflow execution');
    }
  }
);

export const cancelWorkflowExecution = createAsyncThunk(
  'workflow/cancelWorkflowExecution',
  async (executionId: string, { rejectWithValue }) => {
    try {
      return await workflowService.cancelWorkflowExecution(executionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel workflow execution');
    }
  }
);

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentWorkflow: (state) => {
      state.currentWorkflow = null;
    },
    clearCurrentExecution: (state) => {
      state.currentExecution = null;
    },
    clearExecutions: (state) => {
      state.executions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch workflow by ID
      .addCase(fetchWorkflowById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkflow = action.payload;
      })
      .addCase(fetchWorkflowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch workflow by slug
      .addCase(fetchWorkflowBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkflow = action.payload;
      })
      .addCase(fetchWorkflowBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create workflow
      .addCase(createWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows.push(action.payload);
        state.currentWorkflow = action.payload;
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update workflow
      .addCase(updateWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = state.workflows.map((workflow) =>
          workflow.id === action.payload.id ? action.payload : workflow
        );
        state.currentWorkflow = action.payload;
      })
      .addCase(updateWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete workflow
      .addCase(deleteWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = state.workflows.filter((workflow) => workflow.id !== action.payload);
        if (state.currentWorkflow?.id === action.payload) {
          state.currentWorkflow = null;
        }
      })
      .addCase(deleteWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Execute workflow
      .addCase(executeWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.executions.unshift(action.payload);
        state.currentExecution = action.payload;
      })
      .addCase(executeWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch workflow executions
      .addCase(fetchWorkflowExecutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowExecutions.fulfilled, (state, action) => {
        state.loading = false;
        state.executions = action.payload;
      })
      .addCase(fetchWorkflowExecutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch workflow execution
      .addCase(fetchWorkflowExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowExecution.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExecution = action.payload;
      })
      .addCase(fetchWorkflowExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel workflow execution
      .addCase(cancelWorkflowExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelWorkflowExecution.fulfilled, (state, action) => {
        state.loading = false;
        state.executions = state.executions.map((execution) =>
          execution.id === action.payload.id ? action.payload : execution
        );
        state.currentExecution = action.payload;
      })
      .addCase(cancelWorkflowExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentWorkflow, clearCurrentExecution, clearExecutions } = workflowSlice.actions;

export const selectWorkflow = (state: RootState) => state.workflow;

export default workflowSlice.reducer;