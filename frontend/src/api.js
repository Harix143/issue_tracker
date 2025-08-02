// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  // use a relative path so calls always hit the same domain+port
  baseURL: '/api/',              
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach the JWT if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
