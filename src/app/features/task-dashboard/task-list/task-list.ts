import { Component, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project-service';
import { ProjectResponse } from '../../../core/models/project-response.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  outputs: ['viewProject', 'editProject', 'deleteProject']
})
export class TaskList implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  
  viewProject = new EventEmitter<number>();
  editProject = new EventEmitter<number>();
  deleteProject = new EventEmitter<ProjectResponse>();
  
  protected projects = signal<ProjectResponse[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load projects');
        this.isLoading.set(false);
      }
    });
  }

  navigateToSamples(projectId: number) {
    this.router.navigate(['/dashboard/samples'], { queryParams: { projectId } });
  }

  protected getStatusClass(status: string): string {
    return 'ST-' + status;
  }
}

