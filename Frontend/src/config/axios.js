import axios from 'axios';

// Get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies with CORS
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Add token to cookie header for backend
      config.headers.Authorization = `Bearer ${token}`;
      // Also set it as a cookie for the backend to read
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=None`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // If we get a new token, update it
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear it and redirect to login
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
