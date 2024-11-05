import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<string> => {
  const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
  return response.data.token; // Assuming the backend response contains `{ token: '...' }`
};