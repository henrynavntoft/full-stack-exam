import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { id: number; name: string; email: string; role: string };
}

// Login user
export const loginUser = async (loginData: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', loginData, {
    withCredentials: true,
  });
  return response.data;
};

// Fetch user details
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

// Logout user
export const logoutUser = async () => {
  try {
    await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('Error logging out:', error);
    throw error; // Rethrow error to allow frontend to handle it
  }
};
