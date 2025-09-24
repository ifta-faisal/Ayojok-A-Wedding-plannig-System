import React, { useState, useEffect } from 'react';
import { vendorsAPI, authAPI, isAuthenticated } from '../services/api';

const DatabaseTest: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    setAuthStatus(isAuthenticated());
  }, []);

  const testVendorsAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vendorsAPI.getVendors();
      setVendors(data);
      console.log('Vendors loaded:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAuthAPI = async () => {
    setLoading(true);
    setError('');
    try {
      // Test registration
      const registerResponse = await authAPI.register({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      });
      console.log('Registration successful:', registerResponse);
      
      // Test login
      const loginResponse = await authAPI.login({
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      });
      console.log('Login successful:', loginResponse);
      
      setAuthStatus(isAuthenticated());
    } catch (err: any) {
      setError(err.message);
      console.error('Error testing auth:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Database Connection Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">API Status</h3>
          <div className="space-y-2">
            <p><strong>Authentication Status:</strong> {authStatus ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
            <p><strong>Backend URL:</strong> http://localhost:5000</p>
            <p><strong>Database:</strong> SQLite (server/database.sqlite)</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Test Functions</h3>
          <div className="space-y-3">
            <button
              onClick={testVendorsAPI}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Loading...' : 'Test Vendors API'}
            </button>
            
            <button
              onClick={testAuthAPI}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? 'Testing...' : 'Test Auth API'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Vendors Display */}
      {vendors.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Vendors from Database ({vendors.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="border p-4 rounded">
                <h4 className="font-semibold">{vendor.name}</h4>
                <p className="text-sm text-gray-600">{vendor.category}</p>
                <p className="text-sm text-gray-500">{vendor.price_range}</p>
                <p className="text-sm text-gray-500">Rating: {vendor.rating}⭐</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Info */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Database Information</h3>
        <div className="text-sm space-y-2">
          <p><strong>Database Type:</strong> SQLite</p>
          <p><strong>Location:</strong> server/database.sqlite</p>
          <p><strong>Tables Created:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>users - User accounts and authentication</li>
            <li>wedding_events - Wedding event management</li>
            <li>vendors - Vendor directory with categories</li>
            <li>vendor_bookings - User bookings for vendors</li>
          </ul>
          <p><strong>Sample Data:</strong> 8 vendors seeded with categories: Photography, Venue, Florist, Entertainment, Catering, Beauty, Transportation</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 