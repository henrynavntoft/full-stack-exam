// src/api/artworksApi.ts
import axiosInstance from './axiosInstance';
import { Artwork } from '../types';

// Fetch all artworks
export const fetchArtworks = async (): Promise<Artwork[]> => {
  const response = await axiosInstance.get<Artwork[]>('/api/artworks');
  return response.data;
};

// Fetch a single artwork by ID
export const fetchArtwork = async (id: number): Promise<Artwork> => {
  const response = await axiosInstance.get<Artwork>(`/api/artworks/${id}`);
  return response.data;
};