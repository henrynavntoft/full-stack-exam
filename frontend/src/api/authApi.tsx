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
    return response.data;
  } catch (error) {
    const axiosError = error as import('axios').AxiosError;
    if (axiosError.response?.status === 401) {
      // Gracefully handle unauthorized response
      console.warn('User is not logged in');
      return null; // Return null when unauthorized
    }
    console.error('Error fetching user details:', axiosError.message);
    throw error; // Rethrow other errors
  }
};

export const logoutUser = async () => {
  await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
};
