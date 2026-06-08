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
    GET_BY_EMAIL: (email) => `${API_BASE_URL}/api/users/by-email/${encodeURIComponent(email)}`,
    UPDATE_PLAN: (email) => `${API_BASE_URL}/api/users/by-email/${encodeURIComponent(email)}/plan`,
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
    SUMMARY: `${API_BASE_URL}/api/dashboard/summary`,
    OVERVIEW: `${API_BASE_URL}/api/dashboard/overview`,
    SALES: `${API_BASE_URL}/api/dashboard/sales`,
    PROFIT: `${API_BASE_URL}/api/dashboard/profit`,
    ORDERS: (limit = 6) => `${API_BASE_URL}/api/dashboard/orders/${limit}`
  },
};

/**
 * API Helper Functions
 * Provides reusable methods for API calls with Firebase auth
 */

export const apiCall = async (url, options = {}) => {
  try {
    const { skipAuth = false, timeout = 15000, ...fetchOptions } = options;
    const user = auth.currentUser;
    let token = null;
    if (!skipAuth && user) {
      // Avoid hanging if Firebase token retrieval stalls — timeout after 3s
      try {
        token = await Promise.race([
          user.getIdToken(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Token timeout')), 3000)),
        ]).catch(() => null);
      } catch (e) {
        console.warn('Token retrieval failed or timed out:', e);
        token = null;
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: API is taking too long to respond');
      }
      
      // Handle network errors with better message
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to API (${new URL(url).hostname}:${new URL(url).port || 'default'}). Make sure the backend server is running.`);
      }
      
      throw error;
    }
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
    const url = addBusinessIdToUrl(API_ENDPOINTS.PRODUCTS.CREATE, businessId);
    return apiCall(url, {
      method: 'POST',
      body: JSON.stringify(productData),
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
  getSummary: async (businessId, limit = 4) => {
    let url = `${API_ENDPOINTS.DASHBOARD.SUMMARY}?limit=${limit}`;
    url = addBusinessIdToUrl(url, businessId);
    return apiCall(url, { skipAuth: true });
  },

  getOverview: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.OVERVIEW, businessId);
    return apiCall(url, { skipAuth: true });
  },

  getSales: async (range = 'weekly', businessId) => {
    let url = `${API_ENDPOINTS.DASHBOARD.SALES}?range=${range}`;
    url = addBusinessIdToUrl(url, businessId);
    return apiCall(url, { skipAuth: true });
  },

  getProfit: async (businessId) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.PROFIT, businessId);
    return apiCall(url, { skipAuth: true });
  },

  getOrders: async (businessId, limit = 6) => {
    const url = addBusinessIdToUrl(API_ENDPOINTS.DASHBOARD.ORDERS(limit), businessId);
    return apiCall(url, { skipAuth: true });
  }
};

/**
 * Users API Methods
 */
export const usersAPI = {
  /**
   * Create a user record on your own API during onboarding.
   * business_id is sent inside the request body (not as a query param).
   */
  create: async (userData) => {
    return apiCall(API_ENDPOINTS.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getByEmail: async (email) => {
    return apiCall(API_ENDPOINTS.USERS.GET_BY_EMAIL(email), { skipAuth: true });
  },

  updatePlan: async (email, plan) => {
    return apiCall(API_ENDPOINTS.USERS.UPDATE_PLAN(email), {
      method: 'PATCH',
      body: JSON.stringify({ plan }),
    });
  },

  getAll: async () => {
    return apiCall(API_ENDPOINTS.USERS.GET_ALL);
  }
}

export default API_ENDPOINTS;
