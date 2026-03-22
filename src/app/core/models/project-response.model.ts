export interface ProjectResponse {
  id: number;
  title: string;
  artistName: string;
  description?: string;
  deadline?: Date;
  targetReleaseDate?: Date;
  status: string; // Enum-like value from backend (e.g., 'InProgress', 'Completed')
  createdBy: number;
  createdAt: Date;
  updatedAt?: Date;
}