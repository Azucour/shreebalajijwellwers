import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sbj_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sbj_token');
      localStorage.removeItem('sbj_admin');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Products ────────────────────────────────────────────────
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getAdminProducts = (params) => api.get('/products/admin/all', { params });
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ── Upload ───────────────────────────────────────────────────
export const uploadImages = (formData) =>
  api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteImage = (publicId) => api.delete(`/upload/image/${encodeURIComponent(publicId)}`);

// ── Auth ─────────────────────────────────────────────────────
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
export const seedAdmin = () => api.post('/auth/seed');

// ── Admin Stats ──────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats');

export default api;
