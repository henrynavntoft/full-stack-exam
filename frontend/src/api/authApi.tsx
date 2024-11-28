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

export const fetchUserDetails = async (): Promise<AuthResponse | null> => {
  try {
    const response = await axiosInstance.get<AuthResponse>('/api/auth/me', {
      withCredentials: true,
    });
    console.log('Raw /me response:', response.data); // Log the response
    return response.data; // Ensure this contains the `user` object
  } catch (error) {
    const axiosError = error as import('axios').AxiosError;
    if (axiosError.response?.status === 401) {
      console.warn('User is not logged in');
      return null;
    }
    console.error('Error fetching user details:', axiosError.message);
    throw error;
  }
};

export const logoutUser = async () => {
  await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
};
