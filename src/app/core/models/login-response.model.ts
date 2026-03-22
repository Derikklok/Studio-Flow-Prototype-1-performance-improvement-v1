export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: string; // Enum-like value from backend, e.g., 'Admin', 'User'
  isActive: boolean;
  message: string;
}