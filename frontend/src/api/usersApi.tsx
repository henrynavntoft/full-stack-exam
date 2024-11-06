// src/api/usersApi.ts
import axiosInstance from './axiosInstance';
import { User } from '../types';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API functions

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/users');
  return response.data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: CreateUserPayload): Promise<User> => {
  const response = await axiosInstance.post<User>('/users', user);
  return response.data;
};

export const updateUser = async (user: Partial<User> & { id: number }): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};