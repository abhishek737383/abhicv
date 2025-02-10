import axios from 'axios';

// Create an axios instance with a base URL for the backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor to include the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set Authorization header if token is available
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
