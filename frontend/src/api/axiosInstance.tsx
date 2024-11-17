// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Remove token handling since cookies are used
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      alert("You don't have permission to access this resource.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;