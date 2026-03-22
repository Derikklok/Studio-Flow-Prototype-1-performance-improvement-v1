import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { SampleService } from '../../../core/services/sample-service';
import { SampleResponse } from '../../../core/models/sample-response.model';
import { EditSampleDialog } from '../edit-sample-dialog/edit-sample-dialog';

@Component({
  selector: 'app-sample-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, EditSampleDialog],
  template: `
    <div class="samples-page pt-4">
      <nav class="action-navbar fixed-top">
        <div class="container d-flex align-items-center justify-content-between h-100">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-link p-0 text-muted hover-light text-decoration-none d-flex align-items-center border-0 bg-transparent" (click)="goBack()">
              <i class="bi bi-arrow-left fs-5 me-2"></i>
              <span>Return to Dashboard</span>
            </button>
            <div class="vr bg-secondary opacity-25 mx-2" style="height: 24px;"></div>
            <h5 class="mb-0 text-white fw-semibold">Sample Inspection</h5>
          </div>
          
          <div class="d-flex align-items-center gap-3">
            <span class="badge-modern bg-primary-glow text-primary-custom px-3 py-2 border border-primary border-opacity-10">
              <i class="bi bi-shield-lock me-2"></i>SECURE METADATA
            </span>
          </div>
        </div>
      </nav>

      <div class="container mt-5 pt-4 pb-5">
        @if (isLoading()) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3 small italic">Accessing encrypted archives...</p>
          </div>
        } @else if (errorMessage()) {
          <div class="alert alert-danger border-0 rounded-4 py-3 px-4 shadow-lg mb-4">
             <i class="bi bi-exclamation-octagon fs-4 me-3"></i>{{ errorMessage() }}
          </div>
        } @else if (sample(); as s) {
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="card-custom p-5 border border-white border-opacity-10 rounded-4 shadow-app hover-border">
                
                <div class="d-flex justify-content-between align-items-center mb-5 pb-4 border-bottom border-white border-opacity-10">
                  <div class="d-flex align-items-center gap-4 text-truncate">
                    <div class="sample-icon-box flex-shrink-0">
                      <i class="bi bi-music-note-beamed text-primary-custom"></i>
                    </div>
                    <div class="text-truncate">
                      <h2 class="fw-bold mb-1 text-white text-truncate">{{ s.title }}</h2>
                      <p class="text-muted small uppercase spacing-1 mb-0">Internal Production Resource</p>
                    </div>
                  </div>
                  <span class="badge-modern px-3 py-2 rounded-2 fw-bold flex-shrink-0 ms-3" [ngClass]="getStatusClass(s.status)">
                    {{ s.status }}
                  </span>
                </div>

                <div class="metadata-grid">
                  <div class="meta-row py-3 border-bottom border-white border-opacity-05 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Asset ID</span>
                    <span class="text-white fw-mono bg-dark px-2 py-1 rounded small">#{{ s.id }}</span>
                  </div>
                  
                  <div class="meta-row py-3 border-bottom border-white border-opacity-05 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Project Code</span>
                    <span class="text-primary-custom fw-semibold">PID-{{ s.projectId }}</span>
                  </div>

                  <div class="meta-row py-3 border-bottom border-white border-opacity-05 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Recording Artist</span>
                    <span class="text-white fw-semibold">{{ s.sourceArtist || '-- NOT SPECIFIED --' }}</span>
                  </div>

                  <div class="meta-row py-3 border-bottom border-white border-opacity-05 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Original Master</span>
                    <span class="text-white">{{ s.sourceTrack || '-- SESSION DATA ONLY --' }}</span>
                  </div>

                  <div class="meta-row py-3 border-bottom border-white border-opacity-05 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Rights Clearance</span>
                    <span class="text-white small italic">{{ s.rightsHolder || 'TBD (To Be Determined)' }}</span>
                  </div>

                   <div class="meta-row py-3 d-flex justify-content-between align-items-center">
                    <span class="text-muted uppercase smaller spacing-1">Timestamp</span>
                    <span class="text-white small">{{ s.createdAt | date:'MMMM d, yyyy @ HH:mm:ss' }}</span>
                  </div>
                </div>

                <div class="mt-5 pt-4 d-flex flex-wrap gap-3">
                  <button class="btn btn-primary-custom px-5 flex-grow-1 flex-md-grow-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-cloud-download"></i> Download Original
                  </button>
                  <button class="btn btn-outline-light px-4 d-flex align-items-center justify-content-center gap-2" (click)="openEditDialog()">
                    <i class="bi bi-pencil-square"></i> Modify Manifest
                  </button>
                </div>
              </div>
            </div>
          </div>

          @if (isEditModalOpen()) {
            <app-edit-sample-dialog 
              [sample]="s" 
              (close)="closeEditDialog()"
              (sampleUpdated)="onSampleUpdated()">
            </app-edit-sample-dialog>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .samples-page { background: var(--bg-color); min-height: 100vh; position: relative; }
    .action-navbar { height: 64px; background: rgba(15, 17, 26, 0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); z-index: 1100; }
    .sample-icon-box { width: 56px; height: 56px; background: var(--card-hover); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .shadow-app { box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .hover-border:hover { border-color: var(--primary-dark) !important; transition: border-color 0.3s ease; }
    .fw-mono { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
    .badge-modern { text-transform: uppercase; font-size: 0.75rem; border-radius: 6px; letter-spacing: 0.5px; }
    .border-white.border-opacity-05 { border-color: rgba(255,255,255,0.05) !important; }
    .hover-light:hover { color: var(--text-main) !important; }
  `],
})
export class SampleDetails implements OnInit {
  private sampleService = inject(SampleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sample = signal<SampleResponse | null>(null);
  isLoading = signal(true);
  isEditModalOpen = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadSample(+id);
      } else {
        this.errorMessage.set('No sample identification found in context.');
        this.isLoading.set(false);
      }
    });
  }

  loadSample(id: number) {
    this.isLoading.set(true);
    this.sampleService.getSampleById(id).subscribe({
      next: (data) => {
        this.sample.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Encryption check failed: Unable to fetch metadata for the requested asset.');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    const s = this.sample();
    if (s) {
      this.router.navigate(['/dashboard/samples'], { queryParams: { projectId: s.projectId } });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'DRAFT': return 'bg-warning text-dark';
      case 'PENDING_CLEARANCE': return 'bg-info text-dark';
      case 'APPROVED': return 'bg-success text-white';
      case 'REJECTED': return 'bg-danger text-white';
      case 'CLEARED': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  openEditDialog() {
    this.isEditModalOpen.set(true);
  }

  closeEditDialog() {
    this.isEditModalOpen.set(false);
  }

  onSampleUpdated() {
    this.isEditModalOpen.set(false);
    const currentSample = this.sample();
    if (currentSample) {
      this.loadSample(currentSample.id);
    }
  }
}
