// Shared User type
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string; // ISO date string
}

// Shared Artwork type
export interface Artwork {
  id: number;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  imageUrl?: string;
  artistProductions: {
    artist: {
      id: number;
      name: string;
      bio?: string;
      birthDate?: string;
      deathDate?: string;
      nationality?: string;
      gender?: string;
    };
    creatorRole?: string;
  }[];
  colors: { id: number; color: string }[];
  period?: {
    id: number;
    startDate: string;
    endDate: string;
    periodName?: string;
  };
  likedByUser: boolean;
}

// Filters for fetching artworks
export interface Filters {
  searchQuery?: string;
  artist?: string;
  period?: string;
}

// Payload for creating a new user
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Response from authentication endpoints
export interface AuthResponse {
  user: User;
}

// Example response for liking/unliking artworks
export interface ArtworkActionResponse {
  success: boolean;
}

// Payload for logging in a user
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload for resetting password
export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
