export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER"; // Matches the UserRole enum in your schema
  createdAt: string; // ISO date string
}