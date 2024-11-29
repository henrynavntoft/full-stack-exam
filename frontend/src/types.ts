export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER"; // Matches the UserRole enum in your schema
  createdAt: string; // ISO date string
}

export interface Artwork {
  id: number;
  title: string;
  description?: string;
  createdAt: string; // ISO date string

  // The image URL from the API (e.g., thumbnail URL)
  imageUrl?: string;

  // Relation to the artist(s) who created the artwork
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
    creatorRole?: string; // Role of the artist in the creation, if applicable
  }[];

  // Color data associated with the artwork
  colors: {
    id: number;
    color: string; // Hex color code
  }[];

  // Production period (if applicable)
  period?: {
    id: number;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    periodName?: string;
  };

   likedByUser?: boolean;
}