import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import tenantService, { Tenant, CreateTenantDto, UpdateTenantDto } from '../../services/tenantService';

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
};

export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async (_, { rejectWithValue }) => {
    try {
      return await tenantService.getAllTenants();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
    }
  }
);

export const fetchTenantById = createAsyncThunk(
  'tenant/fetchTenantById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await tenantService.getTenantById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant');
    }
  }
);

export const createTenant = createAsyncThunk(
  'tenant/createTenant',
  async (tenant: CreateTenantDto, { rejectWithValue }) => {
    try {
      return await tenantService.createTenant(tenant);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tenant');
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenant/updateTenant',
  async ({ id, tenant }: { id: string; tenant: UpdateTenantDto }, { rejectWithValue }) => {
    try {
      return await tenantService.updateTenant(id, tenant);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tenant');
    }
  }
);

export const deleteTenant = createAsyncThunk(
  'tenant/deleteTenant',
  async (id: string, { rejectWithValue }) => {
    try {
      await tenantService.deleteTenant(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tenant');
    }
  }
);

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTenant: (state) => {
      state.currentTenant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tenant by ID
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTenant = action.payload;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create tenant
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants.push(action.payload);
        state.currentTenant = action.payload;
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update tenant
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.map((tenant) =>
          tenant.id === action.payload.id ? action.payload : tenant
        );
        state.currentTenant = action.payload;
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete tenant
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.filter((tenant) => tenant.id !== action.payload);
        if (state.currentTenant?.id === action.payload) {
          state.currentTenant = null;
        }
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentTenant } = tenantSlice.actions;

export const selectTenant = (state: RootState) => state.tenant;

export default tenantSlice.reducer;