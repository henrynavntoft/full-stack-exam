// src/api/artworksApi.ts
import axiosInstance from './axiosInstance';
import { Artwork } from '../types';

// Fetch all artworks
export const fetchArtworks = async (page = 1, filters = {}) => {
  const { searchQuery, artist } = filters;

  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(searchQuery && { search: searchQuery }), 
    ...(artist && { artist }), 
  }).toString();

  const response = await axiosInstance.get(`/api/artworks?${queryParams}`);
  
  const [artworks, totalArtworks] = response.data;

  return { artworks, totalArtworks };

};

// Fetch a single artwork by ID
export const fetchArtwork = async (id: number): Promise<Artwork> => {
  const response = await axiosInstance.get<Artwork>(`/api/artworks/${id}`);
  return response.data;
};

// Like
export const likeArtwork = async (id: number, userId) => {
  const response = await axiosInstance.post(`/api/artworks/${id}/like`, { userId });
  return response.data;
}

// Unlike
export const deleteLikeArtwork = async (id: number, userId) => {
  const response = await axiosInstance.delete(`/api/artworks/${id}/like`, { userId });
  return response.data;
}
