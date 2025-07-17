import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import formService, {
  Form,
  FormSubmission,
  CreateFormDto,
  UpdateFormDto,
  CreateFormSubmissionDto,
} from '../../services/formService';

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  submissions: FormSubmission[];
  currentSubmission: FormSubmission | null;
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  forms: [],
  currentForm: null,
  submissions: [],
  currentSubmission: null,
  loading: false,
  error: null,
};

// Form CRUD operations
export const fetchForms = createAsyncThunk(
  'form/fetchForms',
  async (_, { rejectWithValue }) => {
    try {
      return await formService.getAllForms();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forms');
    }
  }
);

export const fetchFormById = createAsyncThunk(
  'form/fetchFormById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await formService.getFormById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form');
    }
  }
);

export const fetchFormBySlug = createAsyncThunk(
  'form/fetchFormBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await formService.getFormBySlug(slug);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form');
    }
  }
);

export const createForm = createAsyncThunk(
  'form/createForm',
  async (form: CreateFormDto, { rejectWithValue }) => {
    try {
      return await formService.createForm(form);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create form');
    }
  }
);

export const updateForm = createAsyncThunk(
  'form/updateForm',
  async ({ id, form }: { id: string; form: UpdateFormDto }, { rejectWithValue }) => {
    try {
      return await formService.updateForm(id, form);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update form');
    }
  }
);

export const deleteForm = createAsyncThunk(
  'form/deleteForm',
  async (id: string, { rejectWithValue }) => {
    try {
      await formService.deleteForm(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete form');
    }
  }
);

// Form submission operations
export const submitForm = createAsyncThunk(
  'form/submitForm',
  async ({ formId, submission }: { formId: string; submission: CreateFormSubmissionDto }, { rejectWithValue }) => {
    try {
      return await formService.submitForm(formId, submission);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit form');
    }
  }
);

export const fetchFormSubmissions = createAsyncThunk(
  'form/fetchFormSubmissions',
  async (formId: string, { rejectWithValue }) => {
    try {
      return await formService.getFormSubmissions(formId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form submissions');
    }
  }
);

export const fetchFormSubmission = createAsyncThunk(
  'form/fetchFormSubmission',
  async (submissionId: string, { rejectWithValue }) => {
    try {
      return await formService.getFormSubmission(submissionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form submission');
    }
  }
);

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch forms
      .addCase(fetchForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form by ID
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form by slug
      .addCase(fetchFormBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create form
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
        state.currentForm = action.payload;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update form
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.map((form) =>
          form.id === action.payload.id ? action.payload : form
        );
        state.currentForm = action.payload;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete form
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((form) => form.id !== action.payload);
        if (state.currentForm?.id === action.payload) {
          state.currentForm = null;
        }
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit form
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions.unshift(action.payload);
        state.currentSubmission = action.payload;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form submissions
      .addCase(fetchFormSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchFormSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form submission
      .addCase(fetchFormSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubmission = action.payload;
      })
      .addCase(fetchFormSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentForm, clearCurrentSubmission, clearSubmissions } = formSlice.actions;

export const selectForm = (state: RootState) => state.form;

export default formSlice.reducer;