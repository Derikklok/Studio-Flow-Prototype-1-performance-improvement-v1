import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClearanceService } from '../../../core/services/clearance-service';
import { CreateClearanceRequest } from '../../../core/models/clearance.model';

@Component({
  selector: 'app-initiate-clearance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop-custom d-flex align-items-center justify-content-center px-3 animate-fade-in">
      <div class="modal-container-premium shadow-app w-100 p-4 p-md-5 position-relative overflow-hidden" 
           style="max-width: 580px; border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 17, 26, 0.95); backdrop-filter: blur(20px); border-radius: 28px;">
        
        <div class="card-glow-top"></div>

        <div class="d-flex justify-content-between align-items-center mb-5 position-relative">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 rounded-4 bg-glass border border-white border-opacity-10 shadow-sm">
              <i class="bi bi-shield-check text-primary-custom fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 text-white fw-bold tracking-tight">Initiate Rights</h3>
              <p class="text-muted small mb-0 uppercase tracking-widest spacing-1 opacity-75">Legal Onboarding</p>
            </div>
          </div>
          <button class="btn-icon-glass-circle border-0 text-muted hover-white transition-all shadow-sm" (click)="close.emit()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #clearanceForm="ngForm" class="animate-slide-up">
          <div class="row g-4">
            <div class="col-12">
              <div class="form-group-premium">
                <label class="form-label text-muted-custom small uppercase fw-bold spacing-1 mb-2">Rights Owner</label>
                <div class="input-glass-container d-flex align-items-center px-3 rounded-3">
                  <i class="bi bi-person-badge-fill me-2 opacity-50"></i>
                  <input 
                    type="text" 
                    class="form-control" 
                    name="rightsOwner" 
                    [(ngModel)]="request.rightsOwner"
                    placeholder="Legal Entity or Individual"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="col-md-12">
              <div class="form-group-premium">
                <label class="form-label text-muted-custom small uppercase fw-bold spacing-1 mb-2">License Type</label>
                <div class="input-glass-container d-flex align-items-center px-3 rounded-3">
                  <i class="bi bi-file-earmark-text me-2 opacity-50"></i>
                  <input 
                    type="text" 
                    class="form-control" 
                    name="licenseType" 
                    [(ngModel)]="request.licenseType"
                    placeholder="e.g. Master Sync, Performance"
                  >
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group-premium">
                <label class="form-label text-muted-custom small uppercase fw-bold spacing-1 mb-2">Legal Notes</label>
                <div class="input-glass-container d-flex align-items-start px-3 rounded-3">
                  <i class="bi bi-sticky me-2 opacity-50 mt-3"></i>
                  <textarea 
                    class="form-control" 
                    name="notes" 
                    [(ngModel)]="request.notes"
                    placeholder="Specify restrictions or special clauses..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 justify-content-end mt-5 pt-4 border-top border-white border-opacity-05">
            <button type="button" class="btn btn-icon-glass px-4 py-2 rounded-pill text-muted fw-bold small uppercase" (click)="close.emit()">Cancel</button>
            <button 
              type="submit" 
              class="btn btn-primary-glow-action px-5 py-2 rounded-pill d-flex align-items-center gap-2"
              [disabled]="!clearanceForm.form.valid || isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm"></span>
              } @else {
                <i class="bi bi-upload"></i>
                Submit Request
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Using shared styles, but ensuring local overrides for modal depth if needed */
  `]
})
export class InitiateClearanceDialog {
  private clearanceService = inject(ClearanceService);

  @Input({ required: true }) sampleId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() clearanceInitiated = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected request: CreateClearanceRequest = {
    sampleId: 0,
    rightsOwner: '',
    licenseType: '',
    notes: ''
  };

  onSubmit() {
    this.isLoading.set(true);
    this.request.sampleId = this.sampleId;
    this.clearanceService.createClearance(this.request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.clearanceInitiated.emit();
        this.close.emit();
      },
      error: () => this.isLoading.set(false)
    });
  }
}
