import React, { useState, useEffect } from 'react';
import { isAdminAuthenticated, getStoredAdmin, isAuthenticated, getStoredUser } from '../services/api';
import { Shield, AlertTriangle } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const Admin: React.FC = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegularUserLoggedIn, setIsRegularUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    const checkAuth = () => {
      const adminAuthenticated = isAdminAuthenticated();
      const admin = getStoredAdmin();
      const regularUserAuth = isAuthenticated();
      const regularUser = getStoredUser();
      
      setIsAdminAuth(adminAuthenticated && !!admin);
      setIsRegularUserLoggedIn(regularUserAuth && !!regularUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminAuth(true);
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow p-8 w-96">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If a regular user is logged in, show access denied message
  if (isRegularUserLoggedIn) {
    const user = getStoredUser();
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            You are currently logged in as a regular user ({user?.name}). 
            Admin panel access is not available while logged in as a client.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>To access admin panel:</strong><br />
              Please log out from your current account first, then access the admin panel.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdminAuth ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default Admin;