import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add interceptors for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 403) alert("You don't have permission to access this resource.");
      if (status === 401) console.warn('Unauthorized: Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;