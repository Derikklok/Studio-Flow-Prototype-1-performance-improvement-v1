import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project-service';
import { CreateProjectRequest } from '../../../core/models/project-create-request.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task-dialog.html',
  styleUrl: './create-task-dialog.css',
})
export class CreateTaskDialog {
  private projectService = inject(ProjectService);

  @Output() projectCreated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected projectData: CreateProjectRequest = {
    title: '',
    artistName: '',
    description: '',
    deadline: undefined,
    targetReleaseDate: undefined,
    createdBy: 0 // In a real app, this would come from auth service
  };

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.projectData.createdBy = user.id;
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.projectService.createProject(this.projectData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.projectCreated.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to create project');
      }
    });
  }
}
