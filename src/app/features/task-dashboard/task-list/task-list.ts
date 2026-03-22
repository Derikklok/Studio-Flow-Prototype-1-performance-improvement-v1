import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project-service';
import { ProjectResponse } from '../../../core/models/project-response.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  private projectService = inject(ProjectService);
  
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
      error: (err) => {
        this.errorMessage.set('Failed to load projects');
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'InProgress': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }
}
