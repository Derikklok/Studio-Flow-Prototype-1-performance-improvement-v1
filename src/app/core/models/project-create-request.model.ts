export interface CreateProjectRequest {
  title: string;
  artistName: string;
  description?: string;
  deadline?: Date;
  targetReleaseDate?: Date;
  status?: string;
  createdBy: number; // Assuming user ID
}