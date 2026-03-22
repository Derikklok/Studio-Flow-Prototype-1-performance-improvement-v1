export interface UpdateProjectRequest {
  title: string;
  artistName: string;
  description?: string;
  deadline?: Date;
  targetReleaseDate?: Date;
  status?: string; // Enum-like value (e.g., 'PRE_PRODUCTION', 'IN_PROGRESS', 'COMPLETED')
}

export interface PatchProjectRequest {
  title?: string;
  artistName?: string;
  description?: string;
  deadline?: Date;
  targetReleaseDate?: Date;
  status?: string;
}
