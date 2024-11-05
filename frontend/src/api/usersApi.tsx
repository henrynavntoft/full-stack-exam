// src/api/usersApi.ts
import axios from 'axios';
import { User } from '../types';

// Define the payload type for creating a user
interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle unauthorized errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      alert("You don't have permission to access this resource.");
      // Optionally, redirect to the login page or another page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/users');
  return response.data;
};

// Fetch a specific user by ID
export const fetchUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

// Create a new user (using CreateUserPayload for correct typing)
export const createUser = async (user: CreateUserPayload): Promise<User> => {
  const response = await axiosInstance.post<User>('/users', user);
  return response.data;
};

// Update an existing user
export const updateUser = async (user: Partial<User> & { id: number }): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${user.id}`, user);
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};