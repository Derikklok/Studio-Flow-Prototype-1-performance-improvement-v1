import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectResponse } from '../models/project-response.model';
import { CreateProjectRequest } from '../models/project-create-request.model';
import { UpdateProjectRequest, PatchProjectRequest } from '../models/project-update-request.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // Get list of projects
  getProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.apiUrl);
  }

  // Get project by ID
  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${id}`);
  }

  // Create a new project
  createProject(projectData: CreateProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, projectData);
  }

  // Full update (PUT)
  updateProject(id: number, projectData: UpdateProjectRequest): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.apiUrl}/${id}`, projectData);
  }

  // Partial update (PATCH)
  patchProject(id: number, projectData: PatchProjectRequest): Observable<ProjectResponse> {
    return this.http.patch<ProjectResponse>(`${this.apiUrl}/${id}`, projectData);
  }
}
