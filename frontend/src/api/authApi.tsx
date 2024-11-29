import axiosInstance from './axiosInstance';
import { AuthResponse, LoginPayload } from '../types';

// Login user
export const loginUser = async (loginData: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', loginData, {
    withCredentials: true,
  });
  return response.data;
};

// Fetch current user details
export const fetchUserDetails = async (): Promise<AuthResponse | null> => {
  try {
    const response = await axiosInstance.get<AuthResponse>('/api/auth/me', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as import('axios').AxiosError;
    if (axiosError.response?.status === 401) return null; // Guest user
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
};