import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request when logged in
api.interceptors.request.use((cfg) => {
  try {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* ignore bad storage */
  }
  return cfg;
});

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
export default api;
