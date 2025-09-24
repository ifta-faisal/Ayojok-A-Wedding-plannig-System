import React, { useState, useEffect } from 'react';
import { isAuthenticated, getStoredUser, authAPI, removeStoredUser } from '../services/api';

const AuthTest: React.FC = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated();
    const currentUser = getStoredUser();
    setAuthStatus(authenticated);
    setUser(currentUser);
  };

  const handleLogout = () => {
    removeStoredUser();
    authAPI.logout();
    setMessage('Logged out successfully!');
    checkAuthStatus();
  };

  const testLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Try to login with the existing user from database
      const response = await authAPI.login({
        email: 'iftafaisal759@gmail.com',
        password: 'testpassword123' // You'll need to use the actual password
      });
      setMessage('Login successful! Check the console for details.');
      console.log('Login response:', response);
      checkAuthStatus();
    } catch (error: any) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Authentication Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>
          <div className="space-y-2">
            <p><strong>Status:</strong> {authStatus ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
            {user && (
              <div>
                <p><strong>User:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Test Actions</h3>
          <div className="space-y-3">
            <button
              onClick={checkAuthStatus}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Refresh Status
            </button>
            
            {authStatus ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={testLogin}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-400"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">How to Test Authentication</h3>
        <div className="text-sm space-y-2">
          <p><strong>1. Registration:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Click "Sign In" in the header</li>
            <li>Click "Sign up" to switch to registration mode</li>
            <li>Fill in your details and create an account</li>
          </ul>
          
          <p><strong>2. Login:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Use the "Sign In" button in the header</li>
            <li>Enter your email and password</li>
            <li>You should see a success message</li>
          </ul>
          
          <p><strong>3. Existing User:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Email: iftafaisal759@gmail.com</li>
            <li>Password: (use the password you registered with)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthTest; 