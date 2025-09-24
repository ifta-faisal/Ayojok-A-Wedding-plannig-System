import React, { useState, useEffect } from 'react';
import { Users, Calendar, Package, MessageSquare, TrendingUp, Activity, FileText } from 'lucide-react';
import { adminAPI } from '../services/api';

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalVendors: number;
  unreadMessages: number;
  pendingApplications: number;
}

interface AdminStatsProps {
  onNavigate?: (tab: string) => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    totalVendors: 0,
    unreadMessages: 0,
    pendingApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
        <button
          onClick={fetchStats}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600 mt-1">Monitor and manage your wedding planning platform</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate && onNavigate('bookings')}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Navigate to Bookings section"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Manage Users</h4>
                <p className="text-sm text-blue-600">View user accounts via bookings</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate && onNavigate('bookings')}
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:from-green-100 hover:to-green-200 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Navigate to Bookings section"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-green-900">Process Bookings</h4>
                <p className="text-sm text-green-600">Review and approve bookings</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate && onNavigate('vendors')}
            className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            title="Navigate to Vendors section"
          >
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="font-medium text-purple-900">Add Vendors</h4>
                <p className="text-sm text-purple-600">Expand vendor directory</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate && onNavigate('messages')}
            className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200 hover:from-red-100 hover:to-red-200 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            title="Navigate to Messages section"
          >
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h4 className="font-medium text-red-900">View Messages</h4>
                <p className="text-sm text-red-600">
                  {stats.unreadMessages > 0 
                    ? `${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? 's' : ''}`
                    : 'No unread messages'
                  }
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Platform Status</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Online
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Database Status</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Last Updated</span>
            <span className="text-gray-900 text-sm">
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;