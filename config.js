/**
 * Micro Business API Configuration
 * Centralized API endpoints and base URL
 */

import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Helper to add businessId query parameter to URLs
 */
const addBusinessIdToUrl = (url, businessId) => {
  const separator = url.includes('?') ? '&' : '?';
  return businessId ? `${url}${separator}business_id=${businessId}` : url;
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },

  // Users & Roles endpoints
  USERS: {
    BASE: `${API_BASE_URL}/api/users`,
    CREATE: `${API_BASE_URL}/api/users`,
    GET_ALL: `${API_BASE_URL}/api/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE_ROLE: (id) => `${API_BASE_URL}/api/users/${id}/role`,
    DELETE: (id) => `${API_BASE_URL}/api/users/${id}`,
  },

  // Orders endpoints
  ORDERS: {
    BASE: `${API_BASE_URL}/api/orders`,
    GET_ALL: `${API_BASE_URL}/api/orders`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
    CREATE: `${API_BASE_URL}/api/orders`,
    UPDATE: (id) => `${API_BASE_URL}/api/orders/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/orders/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/orders/${id}`,
  },

  // Customers endpoints
  CUSTOMERS: {
    BASE: `${API_BASE_URL}/api/customers`,
    GET_ALL: `${API_BASE_URL}/api/customers`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,
    CREATE: `${API_BASE_URL}/api/customers`,
    UPDATE: (id) => `${API_BASE_URL}/api/customers/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/customers/${id}`,
  },

  // Products endpoints
  PRODUCTS: {
    BASE: `${API_BASE_URL}/api/products`,
    GET_ALL: `${API_BASE_URL}/api/products`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
    CREATE: `${API_BASE_URL}/api/products`,
    UPDATE: (id) => `${API_BASE_URL}/api/products/${id}`,
    UPDATE_STOCK: (id) => `${API_BASE_URL}/api/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/products/${id}`,
  },

  // Dashboard/Analytics endpoints
  DASHBOARD: {
    OVERVIEW: `${API_BASE_URL}/api/dashboard/overview`,
    SALES: `${API_BASE_URL}/api/dashboard/sales`,
    PROFIT: `${API_BASE_URL}/api/dashboard/profit`,
    ORDERS: `${API_BASE_URL}/api/dashboard/orders/6`
  },
};

/**
 * API Helper Functions
 * Provides reusable methods for API calls with Firebase auth
 */

export const apiCall = async (url, options = {}) => {
  try {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

/**
 * Orders API Methods
 */
export const ordersAPI = {
  getAll: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.ORDERS.GET_ALL, businessId);
    return apiCall(url);
  },

  getById: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.ORDERS.GET_BY_ID(id), businessId);
    return apiCall(url);
  },

  create: async (orderData, businessId) => {
    return apiCall(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ ...orderData, business_id: businessId }),
    });
  },

  update: async (id, orderData, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.ORDERS.UPDATE(id), businessId);
    return apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  updateStatus: async (id, status, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), businessId);
    return apiCall(url, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.ORDERS.DELETE(id), businessId);
    return apiCall(url, {
      method: 'DELETE',
    });
  },
};

/**
 * Products API Methods
 */
export const productsAPI = {
  getAll: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.GET_ALL, businessId);
    return apiCall(url);
  },

  getById: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id), businessId);
    return apiCall(url);
  },

  create: async (productData, businessId) => {
    return apiCall(API_ENDPOINTS.PRODUCTS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ ...productData, business_id: businessId }),
    });
  },

  update: async (id, productData, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.UPDATE(id), businessId);
    return apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  updateStock: async (id, stock, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.UPDATE_STOCK(id), businessId);
    return apiCall(url, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  delete: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.DELETE(id), businessId);
    return apiCall(url, {
      method: 'DELETE',
    });
  },
};

/**
 * Customers API Methods
 */
export const customersAPI = {
  getAll: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.CUSTOMERS.GET_ALL, businessId);
    return apiCall(url);
  },

  getById: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id), businessId);
    return apiCall(url);
  },

  create: async (customerData, businessId) => {
    return apiCall(API_ENDPOINTS.CUSTOMERS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ ...customerData, business_id: businessId }),
    });
  },

  update: async (id, customerData, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.CUSTOMERS.UPDATE(id), businessId);
    return apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  delete: async (id, businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.CUSTOMERS.DELETE(id), businessId);
    return apiCall(url, {
      method: 'DELETE',
    });
  },
};

/**
 * Dashboard API Methods
 */
export const dashboardAPI = {
  getOverview: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.OVERVIEW, businessId);
    return apiCall(url);
  },

  getSales: async (range = 'weekly', businessId) => {
    let url = `${API_ENDPOINTS.DASHBOARD.SALES}?range=${range}`;
    url = addBusinessIdToUrl(url, businessId);
    return apiCall(url);
  },

  getProfit: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.PROFIT, businessId);
    return apiCall(url);
  },

  getOrders: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.ORDERS, businessId);
    return apiCall(url);
  }
};

export default API_ENDPOINTS;
