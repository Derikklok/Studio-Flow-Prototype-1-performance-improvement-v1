export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string; // Enum-like value from backend, e.g., 'Admin', 'User'
}