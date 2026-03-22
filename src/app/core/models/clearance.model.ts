export interface CreateClearanceRequest {
  sampleId: number;
  rightsOwner: string;
  licenseType?: string;
  notes?: string;
}

export interface ClearanceResponse {
  id: number;
  sampleId: number;
  rightsOwner: string;
  licenseType?: string;
  isApproved: boolean;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
}

export interface UpdateClearanceRequest {
  rightsOwner?: string;
  licenseType?: string;
  notes?: string;
}
