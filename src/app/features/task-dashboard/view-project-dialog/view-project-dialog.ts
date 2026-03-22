import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project-service';
import { ProjectResponse } from '../../../core/models/project-response.model';

@Component({
  selector: 'app-view-project-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-project-dialog.html',
  styleUrl: './view-project-dialog.css',
})
export class ViewProjectDialog implements OnInit {
  private projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: number;
  @Output() close = new EventEmitter<void>();

  protected project = signal<ProjectResponse | null>(null);
  protected isLoading = signal(true);
  protected errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadProject();
  }

  private loadProject() {
    this.isLoading.set(true);
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (data) => {
        this.project.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load project details');
        this.isLoading.set(false);
      }
    });
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'PRE_PRODUCTION': return 'bg-info text-dark';
      case 'RECORDING': return 'bg-primary';
      case 'MIXING': return 'bg-warning text-dark';
      case 'MASTERING': return 'bg-accent';
      case 'READY_FOR_REVIEW': return 'bg-success';
      case 'RELEASED': return 'bg-success glow-success';
      case 'ARCHIVED': return 'bg-secondary opacity-75';
      default: return 'bg-secondary';
    }
  }
}
