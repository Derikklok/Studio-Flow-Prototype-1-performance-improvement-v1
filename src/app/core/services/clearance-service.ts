import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ClearanceResponse, CreateClearanceRequest, UpdateClearanceRequest } from '../models/clearance.model';

@Injectable({
  providedIn: 'root',
})
export class ClearanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clearances`;

  getClearances(): Observable<ClearanceResponse[]> {
    return this.http.get<ClearanceResponse[]>(this.apiUrl);
  }

  getClearanceById(id: number): Observable<ClearanceResponse> {
    return this.http.get<ClearanceResponse>(`${this.apiUrl}/${id}`);
  }

  createClearance(data: CreateClearanceRequest): Observable<ClearanceResponse> {
    return this.http.post<ClearanceResponse>(this.apiUrl, data);
  }

  approveClearance(id: number): Observable<ClearanceResponse> {
    return this.http.put<ClearanceResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  patchClearance(id: number, data: UpdateClearanceRequest): Observable<ClearanceResponse> {
    return this.http.patch<ClearanceResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteClearance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
