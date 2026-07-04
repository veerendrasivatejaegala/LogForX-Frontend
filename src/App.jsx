import React from 'react';
import { ForensicProvider, useForensic } from './context/ForensicContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { isAuthenticated, activePage } = useForensic();

  if (!isAuthenticated) {
    if (activePage === 'forgot-password') {
      return <ForgotPassword />;
    }
    if (activePage === 'reset-password') {
      return <ResetPassword />;
    }
    if (activePage === 'register') {
      return <Register />;
    }
    return <Login />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <ForensicProvider>
      <AppContent />
    </ForensicProvider>
  );
}
