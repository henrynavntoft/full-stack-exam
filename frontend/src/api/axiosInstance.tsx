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
    // Cookies handle authentication, so no token handling needed
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
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized: Please log in again.');
      // Optionally, redirect to login or handle logout here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;