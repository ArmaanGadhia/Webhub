const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('webhub_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An unexpected error occurred.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getUsers: () => request('/auth/users'),
  toggleUserStatus: (id) => request(`/auth/users/${id}/status`, { method: 'PUT' }),

  // Categories
  getCategories: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/categories${query ? `?${query}` : ''}`);
  },
  getCategoryBySlug: (slug) => request(`/categories/${slug}`),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Businesses
  getBusinesses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/businesses${query ? `?${query}` : ''}`);
  },
  getBusiness: (idOrSlug) => request(`/businesses/${idOrSlug}`),
  getMyBusiness: () => request('/businesses/my/business'),
  createBusiness: (data) => request('/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateBusiness: (id, data) => request(`/businesses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBusiness: (id) => request(`/businesses/${id}`, { method: 'DELETE' }),
  updateBusinessStatus: (id, data) => request(`/businesses/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Websites
  getWebsites: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/websites${query ? `?${query}` : ''}`);
  },
  getWebsite: (id) => request(`/websites/${id}`),
  getPublicWebsite: (slug) => request(`/websites/public/${slug}`),
  createWebsite: (data) => request('/websites', { method: 'POST', body: JSON.stringify(data) }),
  updateWebsite: (id, data) => request(`/websites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  publishWebsite: (id) => request(`/websites/${id}/publish`, { method: 'POST' }),
  unpublishWebsite: (id) => request(`/websites/${id}/unpublish`, { method: 'POST' }),
  deleteWebsite: (id) => request(`/websites/${id}`, { method: 'DELETE' }),

  // Templates
  getTemplates: () => request('/templates'),
  getTemplate: (id) => request(`/templates/${id}`),

  // Enquiries
  getEnquiries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/enquiries${query ? `?${query}` : ''}`);
  },
  submitEnquiry: (data) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateEnquiryStatus: (id, status) => request(`/enquiries/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteEnquiry: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),

  // Analytics
  trackEvent: (data) => request('/analytics/track', { method: 'POST', body: JSON.stringify(data) }),
  getWebsiteAnalytics: (id) => request(`/analytics/website/${id}`),
  getDashboardStats: () => request('/analytics/dashboard'),
  getAdminStats: () => request('/analytics/admin-stats'),
};
