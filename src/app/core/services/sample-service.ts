import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SampleResponse } from '../models/sample-response.model';
import { CreateSampleRequest } from '../models/sample-create-request.model';
import { UpdateSampleRequest } from '../models/sample-update-request.model';

@Injectable({
  providedIn: 'root',
})
export class SampleService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // Get list of samples for a specific project by project ID
  getSamples(projectId: number): Observable<SampleResponse[]> {
    return this.http.get<SampleResponse[]>(`${this.apiUrl}/${projectId}/samples`);
  }

  // Get single sample by ID
  getSampleById(id: number): Observable<SampleResponse> {
    return this.http.get<SampleResponse>(`${environment.apiUrl}/samples/${id}`);
  }

  // Create a new sample for a project
  createSample(projectId: number, sampleData: CreateSampleRequest): Observable<SampleResponse> {
    return this.http.post<SampleResponse>(`${this.apiUrl}/${projectId}/samples`, sampleData);
  }

  // Partial update (PATCH) for a sample
  patchSample(id: number, sampleData: UpdateSampleRequest): Observable<SampleResponse> {
    return this.http.patch<SampleResponse>(`${environment.apiUrl}/samples/${id}`, sampleData);
  }

  // Full update (PUT) for a sample
  updateSample(id: number, sampleData: UpdateSampleRequest): Observable<SampleResponse> {
    return this.http.put<SampleResponse>(`${environment.apiUrl}/samples/${id}`, sampleData);
  }
}
