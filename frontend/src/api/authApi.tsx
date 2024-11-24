import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { id: number; name: string; email: string; role: string };
}

export const loginUser = async (loginData: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', loginData, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchUserDetails = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get('/api/auth/me', {
    withCredentials: true,
  });
  return response.data;
};

