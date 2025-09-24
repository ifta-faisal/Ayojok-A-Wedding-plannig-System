const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper functions for admin token management
const getAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

const setAdminToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

const removeAdminToken = (): void => {
  localStorage.removeItem('adminToken');
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Admin API request function
const adminApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getProfile: async () => {
    return await apiRequest('/user/profile');
  },
};

// Events API
export const eventsAPI = {
  createEvent: async (eventData: {
    event_name: string;
    event_date: string;
    event_time?: string;
    location?: string;
    description?: string;
  }) => {
    return await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  updateEvent: async (eventId: number, eventData: {
    event_name: string;
    event_date: string;
    event_time?: string;
    location?: string;
    description?: string;
  }) => {
    return await apiRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  deleteEvent: async (eventId: number) => {
    return await apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },

  cancelEvent: async (eventId: number) => {
    return await apiRequest(`/events/${eventId}/cancel`, {
      method: 'PUT',
    });
  },

  getEvents: async () => {
    return await apiRequest('/events');
  },
};

// Vendors API
export const vendorsAPI = {
  getVendors: async (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return await apiRequest(`/vendors${query}`);
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData: {
    vendor_id: number;
    booking_date: string;
    notes?: string;
  }) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getBookings: async () => {
    return await apiRequest('/bookings');
  },
};

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem('user');
};

// Contact/Messages API
export const contactAPI = {
  sendMessage: async (messageData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Vendor Application API
export const vendorApplicationAPI = {
  submitApplication: async (applicationData: {
    name: string;
    email: string;
    phone?: string;
    category: string;
    business_name: string;
    description?: string;
    experience_years?: number;
    portfolio_url?: string;
  }) => {
    return await apiRequest('/vendor-application', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },
};

// Admin API
export const adminAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeAdminToken();
    localStorage.removeItem('adminUser');
  },

  getStats: async () => {
    return await adminApiRequest('/admin/stats');
  },

  // Bookings management
  getBookings: async () => {
    return await adminApiRequest('/admin/bookings');
  },

  updateBookingStatus: async (bookingId: number, status: string) => {
    return await adminApiRequest(`/admin/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Vendors management
  getVendors: async () => {
    return await adminApiRequest('/admin/vendors');
  },

  addVendor: async (vendorData: {
    name: string;
    category: string;
    contact_info?: string;
    price_range?: string;
    rating?: number;
  }) => {
    return await adminApiRequest('/admin/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  updateVendor: async (vendorId: number, vendorData: {
    name: string;
    category: string;
    contact_info?: string;
    price_range?: string;
    rating?: number;
  }) => {
    return await adminApiRequest(`/admin/vendors/${vendorId}`, {
      method: 'PATCH',
      body: JSON.stringify(vendorData),
    });
  },

  deleteVendor: async (vendorId: number) => {
    return await adminApiRequest(`/admin/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },

  // Messages management
  getMessages: async () => {
    return await adminApiRequest('/admin/messages');
  },

  updateMessageStatus: async (messageId: number, status: string) => {
    return await adminApiRequest(`/admin/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Vendor applications management
  getVendorApplications: async () => {
    return await adminApiRequest('/admin/vendor-applications');
  },

  updateVendorApplicationStatus: async (applicationId: number, status: string, admin_notes?: string) => {
    return await adminApiRequest(`/admin/vendor-applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_notes }),
    });
  },

  approveVendorApplication: async (applicationId: number, admin_notes?: string) => {
    return await adminApiRequest(`/admin/vendor-applications/${applicationId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ admin_notes }),
    });
  },
};

// Admin utility functions
export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken();
};

export const getStoredAdmin = () => {
  const adminStr = localStorage.getItem('adminUser');
  return adminStr ? JSON.parse(adminStr) : null;
};

export const setStoredAdmin = (admin: any) => {
  localStorage.setItem('adminUser', JSON.stringify(admin));
};

export const removeStoredAdmin = () => {
  localStorage.removeItem('adminUser');
}; 