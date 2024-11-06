import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

export const loginUser = async (loginData: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
  return response.data;
};