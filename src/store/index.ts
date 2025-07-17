import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import userReducer from './slices/userSlice';
import dataModelReducer from './slices/dataModelSlice';
import formReducer from './slices/formSlice';
import workflowReducer from './slices/workflowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    user: userReducer,
    dataModel: dataModelReducer,
    form: formReducer,
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;