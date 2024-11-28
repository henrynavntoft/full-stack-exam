// src/api/artworksApi.ts
import axiosInstance from './axiosInstance';
import { Artwork } from '../types';

// Fetch all artworks
interface Filters {
  searchQuery?: string;
  artist?: string;
  period?: string;
}

export const fetchArtworks = async (page = 1, filters: Filters = {}) => {
  const { searchQuery, artist, period } = filters;

  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(searchQuery && { search: searchQuery }), 
    ...(artist && { artist }), 
    ...(period && { period }), 
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

// Like an artwork
export const likeArtwork = async (id: number, userId: number): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post<{ success: boolean }>(`/api/artworks/${id}/like`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to like artwork:', error);
    throw error;
  }
};

// Unlike an artwork
export const deleteLikeArtwork = async (id: number, userId: number): Promise<{ success: boolean }> => {
  try {
    const queryParams = new URLSearchParams({ userId: userId.toString() }).toString();
    const response = await axiosInstance.delete<{ success: boolean }>(
      `/api/artworks/${id}/like?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to unlike artwork:', error);
    throw error;
  }
};

// ADMIN FUNCTIONS

// delete an artwork
export const deleteArtwork = async (id: number) => {
  const response = await axiosInstance.delete(`/api/artworks/${id}`);
  return response.data;
}
