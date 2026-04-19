import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create a configured axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercept requests to inject the authorization token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercept responses to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Let the components handle the redirect, or we can force redirect here:
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------
// Service Hooks & API Definitions
// ----------------------------------------------------

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const paymentsApi = {
  getTransactions: async (limit = 10, offset = 0) => {
    const response = await api.get('/payments/my', { params: { limit, offset } });
    return response.data;
  },
  createPayment: async (data: { amount: number; merchantId: string; description?: string }) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  simulateSuccess: async (id: string) => {
    const response = await api.post(`/payments/${id}/simulate-success`);
    return response.data;
  },
};

export const aiApi = {
  getInsights: async () => {
    const response = await api.get('/ai/insights');
    return response.data;
  },
};
