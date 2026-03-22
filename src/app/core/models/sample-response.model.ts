export interface SampleResponse {
  id: number;
  projectId: number;
  title: string;
  sourceArtist?: string;
  sourceTrack?: string;
  rightsHolder?: string;
  status: string; // Enum-like value from backend (e.g., 'Available', 'Not Available')
  createdAt: Date;
  updatedAt?: Date;
}