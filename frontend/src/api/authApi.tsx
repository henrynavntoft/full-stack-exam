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
    return response.data; // Return the user object if authenticated
  } catch (error) {
    const axiosError = error as import('axios').AxiosError;
    if (axiosError.response?.status === 401) {
      // Gracefully handle unauthenticated users as guests
      return null; // Return `null` for guest users
    }
    console.error('Error fetching user details:', axiosError.message);
    throw error; // Rethrow other unexpected errors
  }
};

export const logoutUser = async () => {
  await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
};
