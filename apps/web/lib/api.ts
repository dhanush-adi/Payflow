import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.patch('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

export const paymentsApi = {
  create: (data: any) => api.post('/payments', data),
  getAll: (params?: any) => api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  update: (id: string, data: any) => api.patch(`/payments/${id}`, data),
  cancel: (id: string) => api.delete(`/payments/${id}`),
  verifyUPI: (upiId: string) => api.get(`/payments/verify-upi/${upiId}`),
};

export const aiApi = {
  chat: (message: string) => api.post('/ai/chat', { message }),
  insights: () => api.get('/ai/insights'),
  suggest: (context: string) => api.post('/ai/suggest', { context }),
};

export const cryptoApi = {
  getBalance: (address: string) => api.get(`/blockchain/balance/${address}`),
  getTransactions: (address: string) => api.get(`/blockchain/transactions/${address}`),
  send: (data: any) => api.post('/blockchain/send', data),
  swap: (data: any) => api.post('/blockchain/swap', data),
};

export default api;