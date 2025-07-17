import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { selectAuth, checkAuth } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Tenants from './pages/tenants/Tenants';
import TenantDetail from './pages/tenants/TenantDetail';
import Users from './pages/users/Users';
import UserDetail from './pages/users/UserDetail';
import DataModels from './pages/data-models/DataModels';
import DataModelDetail from './pages/data-models/DataModelDetail';
import Forms from './pages/forms/Forms';
import FormDetail from './pages/forms/FormDetail';
import FormBuilder from './pages/forms/FormBuilder';
import Workflows from './pages/workflows/Workflows';
import WorkflowDetail from './pages/workflows/WorkflowDetail';
import WorkflowBuilder from './pages/workflows/WorkflowBuilder';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth() as any);
  }, [dispatch]);
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        <Route path="tenants">
          <Route index element={<Tenants />} />
          <Route path=":id" element={<TenantDetail />} />
          <Route path="new" element={<TenantDetail />} />
        </Route>
        
        <Route path="users">
          <Route index element={<Users />} />
          <Route path=":id" element={<UserDetail />} />
          <Route path="new" element={<UserDetail />} />
        </Route>
        
        <Route path="data-models">
          <Route index element={<DataModels />} />
          <Route path=":id" element={<DataModelDetail />} />
          <Route path="new" element={<DataModelDetail />} />
        </Route>
        
        <Route path="forms">
          <Route index element={<Forms />} />
          <Route path=":id" element={<FormDetail />} />
          <Route path=":id/builder" element={<FormBuilder />} />
          <Route path="new" element={<FormDetail />} />
        </Route>
        
        <Route path="workflows">
          <Route index element={<Workflows />} />
          <Route path=":id" element={<WorkflowDetail />} />
          <Route path=":id/builder" element={<WorkflowBuilder />} />
          <Route path="new" element={<WorkflowDetail />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;