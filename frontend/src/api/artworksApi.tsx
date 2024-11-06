// src/api/artworksApi.ts
import axios from 'axios';
import { Artwork } from '../types';

// Create a simple axios instance with just the base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all artworks
export const fetchArtworks = async (): Promise<Artwork[]> => {
  const response = await axiosInstance.get<Artwork[]>('/artworks');
  return response.data;
};

