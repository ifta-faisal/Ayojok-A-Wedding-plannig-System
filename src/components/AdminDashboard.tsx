import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  Shield,
  FileText
} from 'lucide-react';
import { adminAPI, getStoredAdmin, removeStoredAdmin } from '../services/api';
import AdminStats from './AdminStats';
import AdminBookings from './AdminBookings';
import AdminVendors from './AdminVendors';
import AdminMessages from './AdminMessages';
import AdminVendorApplications from './AdminVendorApplications';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [admin, setAdmin] = useState(getStoredAdmin());

  const handleLogout = () => {
    adminAPI.logout();
    removeStoredAdmin();
    onLogout();
  };

  const tabs = [
    { id: 'stats', name: 'Dashboard', icon: BarChart3 },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'vendors', name: 'Vendors', icon: Package },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'applications', name: 'Applications', icon: FileText },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats onNavigate={handleNavigate} />;
      case 'bookings':
        return <AdminBookings />;
      case 'vendors':
        return <AdminVendors />;
      case 'messages':
        return <AdminMessages />;
      case 'applications':
        return <AdminVendorApplications />;
      default:
        return <AdminStats onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Wedding Planning Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;