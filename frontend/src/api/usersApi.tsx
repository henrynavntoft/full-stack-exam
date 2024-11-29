import axiosInstance from './axiosInstance';
import { User, CreateUserPayload } from '../types';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/api/users');
  return response.data;
};

// Fetch a single user by ID
export const fetchUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/api/users/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (user: CreateUserPayload): Promise<User> => {
  const response = await axiosInstance.post<User>('/api/users', user);
  return response.data;
};

// Update a user
export const updateUser = async (user: Partial<User> & { id: number }): Promise<User> => {
  const response = await axiosInstance.put<User>(`/api/users/${user.id}`, user);
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/users/${id}`);
};