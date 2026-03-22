export interface CreateProjectRequest {
  title: string;
  artistName: string;
  description?: string;
  deadline?: Date;
  targetReleaseDate?: Date;
  createdBy: number; // Assuming user ID
}