// src/api/artworksApi.ts
import axiosInstance from './axiosInstance';
import { Artwork } from '../types';

// Fetch all artworks
export const fetchArtworks = async (page = 1) => {
  const response = await axiosInstance.get(`/api/artworks?page=${page}`);
  
  const [artworks, totalArtworks] = response.data;

  return { artworks, totalArtworks };

};

// Fetch a single artwork by ID
export const fetchArtwork = async (id: number): Promise<Artwork> => {
  const response = await axiosInstance.get<Artwork>(`/api/artworks/${id}`);
  return response.data;
};