import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project-service';
import { ProjectResponse } from '../../../core/models/project-response.model';
import { UpdateProjectRequest } from '../../../core/models/project-update-request.model';

@Component({
  selector: 'app-edit-project-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-project-dialog.html',
  styleUrl: './edit-project-dialog.css',
})
export class EditProjectDialog implements OnInit {
  private projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: number;
  @Output() projectUpdated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected isFetching = signal(true);
  protected errorMessage = signal<string | null>(null);

  protected projectData: UpdateProjectRequest = {
    title: '',
    artistName: '',
    description: '',
    deadline: undefined,
    targetReleaseDate: undefined,
    status: 'PRE_PRODUCTION'
  };

  protected statusOptions = [
    { label: 'Pre-Production', value: 'PRE_PRODUCTION' },
    { label: 'Recording', value: 'RECORDING' },
    { label: 'Mixing', value: 'MIXING' },
    { label: 'Mastering', value: 'MASTERING' },
    { label: 'Ready for Review', value: 'READY_FOR_REVIEW' },
    { label: 'Released', value: 'RELEASED' },
    { label: 'Archived', value: 'ARCHIVED' }
  ];

  ngOnInit() {
    this.fetchProject();
  }

  private fetchProject() {
    this.isFetching.set(true);
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project: ProjectResponse) => {
        this.projectData = {
          title: project.title,
          artistName: project.artistName,
          description: project.description || '',
          deadline: project.deadline ? new Date(project.deadline) : undefined,
          targetReleaseDate: project.targetReleaseDate ? new Date(project.targetReleaseDate) : undefined,
          status: project.status
        };
        this.isFetching.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to fetch project details');
        this.isFetching.set(false);
      }
    });
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.projectService.updateProject(this.projectId, this.projectData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.projectUpdated.emit();
        this.close.emit();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to update project');
      }
    });
  }
}
