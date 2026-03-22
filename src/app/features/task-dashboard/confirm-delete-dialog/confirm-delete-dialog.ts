import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project-service';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop-custom d-flex align-items-center justify-content-center px-3">
      <div class="card-custom shadow-lg w-100 modal-container border-danger-subtle" style="max-width: 400px;">
        <div class="text-center mb-4">
          <div class="delete-icon-wrapper mb-3">
            <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
          </div>
          <h4 class="mb-2">Delete Project?</h4>
          <p class="text-muted small">
            Are you sure you want to delete <strong>"{{ projectTitle }}"</strong>? 
            This action cannot be undone and will remove all associated data.
          </p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger py-2 small mb-3 text-center">
            {{ errorMessage() }}
          </div>
        }

        <div class="d-flex gap-2 justify-content-center">
          <button type="button" class="btn btn-outline-light px-4" (click)="close.emit()" [disabled]="isLoading()">
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-danger px-4" 
            (click)="onConfirm()"
            [disabled]="isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner-border spinner-border-sm me-2"></span>
            }
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      background: #1a1d2b;
      border: 1px solid rgba(220, 53, 69, 0.2);
    }
    .delete-icon-wrapper {
      width: 64px;
      height: 64px;
      background: rgba(220, 53, 69, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmDeleteDialog {
  private projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: number;
  @Input({ required: true }) projectTitle: string = '';
  @Output() deleted = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  onConfirm() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.projectService.deleteProject(this.projectId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.deleted.emit();
        this.close.emit();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to delete project. Please try again.');
      }
    });
  }
}
