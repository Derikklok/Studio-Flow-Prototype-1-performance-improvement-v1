import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SampleResponse } from '../models/sample-response.model';

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
}
