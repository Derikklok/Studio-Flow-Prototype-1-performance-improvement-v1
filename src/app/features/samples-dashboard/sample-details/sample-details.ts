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
    <div class="samples-page pb-5">
      <!-- Top Navigation -->
      <nav class="action-navbar fixed-top">
        <div class="container d-flex align-items-center justify-content-between h-100">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-back-pill d-flex align-items-center px-3 py-1 rounded-pill" (click)="goBack()">
              <i class="bi bi-chevron-left me-1"></i>
              <span class="small fw-bold uppercase tracking-wider">Asset Library</span>
            </button>
            <div class="vr bg-white opacity-10 mx-2" style="height: 20px;"></div>
            <h5 class="mb-0 text-white fw-bold tracking-tight">Technical Inspection</h5>
          </div>
          
          <div class="d-flex align-items-center gap-3">
            <div class="secure-tag px-3 py-1 rounded-pill bg-glass border border-primary border-opacity-10 d-none d-md-flex align-items-center">
              <span class="badge-status-pulse me-2"></span>
              <span class="text-primary-custom small uppercase fw-bold spacing-1">Secure Metadata</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mt-5 pt-5">
        @if (isLoading()) {
          <div class="text-center py-5 animate-fade-in">
            <div class="spinner-box mx-auto mb-3">
              <div class="spinner-inner"></div>
            </div>
            <p class="text-muted small uppercase tracking-widest mt-2">Accessing Archives...</p>
          </div>
        } @else if (errorMessage()) {
          <div class="alert-glass p-4 rounded-4 border border-danger border-opacity-20 bg-danger bg-opacity-05 d-flex align-items-center gap-3 mb-5">
            <div class="alert-icon-box bg-danger text-white rounded-circle"><i class="bi bi-x-lg"></i></div>
            <div>
              <h6 class="text-danger fw-bold mb-1">Retrieval Error</h6>
              <p class="text-danger opacity-75 small mb-0">{{ errorMessage() }}</p>
            </div>
          </div>
        } @else if (sample(); as s) {
          <div class="row justify-content-center animate-slide-up">
            <div class="col-lg-10">
              <div class="inspection-card p-4 p-md-5 rounded-4 bg-glass border border-white border-opacity-10 shadow-app overflow-hidden position-relative">
                <div class="card-glow-top"></div>
                
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-4 border-bottom border-white border-opacity-05 position-relative">
                  <div class="d-flex align-items-center gap-4">
                    <div class="asset-hero-icon flex-shrink-0">
                      <i class="bi bi-vinyl-fill spin-slow text-primary-custom"></i>
                    </div>
                    <div>
                      <h1 class="fw-bold mb-1 text-white">{{ s.title }}</h1>
                      <div class="d-flex align-items-center gap-2">
                        <span class="text-primary-custom small fw-bold uppercase">Archive Reference</span>
                        <span class="text-muted small">•</span>
                        <span class="text-muted small italic">ID-{{ s.id.toString().padStart(8, '0') }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="status-box mt-3 mt-md-0">
                    <span class="badge-status-modern px-4 py-2" [ngClass]="getStatusClass(s.status)">
                      {{ s.status.replace('_', ' ') }}
                    </span>
                  </div>
                </div>

                <div class="row g-5">
                  <!-- Main Specs -->
                  <div class="col-md-7">
                    <h6 class="text-muted-custom small uppercase fw-bold spacing-2 mb-4">Core Metadata</h6>
                    <div class="metadata-grid-premium">
                      <div class="meta-item-modern mb-4 p-4 rounded-4 bg-glass border border-white border-opacity-05">
                        <div class="d-flex align-items-center gap-3 mb-3">
                          <div class="meta-icon bg-blue-glow"><i class="bi bi-person-badge"></i></div>
                          <span class="text-muted small uppercase fw-bold">Principal Artist</span>
                        </div>
                        <h4 class="text-white fw-bold mb-0 ps-5">{{ s.sourceArtist || '-- NOT SPECIFIED --' }}</h4>
                      </div>

                      <div class="meta-item-modern mb-4 p-4 rounded-4 bg-glass border border-white border-opacity-05">
                        <div class="d-flex align-items-center gap-3 mb-3">
                          <div class="meta-icon bg-purple-glow"><i class="bi bi-soundwave"></i></div>
                          <span class="text-muted small uppercase fw-bold">Recording Session / Master</span>
                        </div>
                        <h4 class="text-white fw-bold mb-0 ps-5">{{ s.sourceTrack || '-- SESSION RECORDING --' }}</h4>
                      </div>
                    </div>
                  </div>

                  <!-- Side Panel -->
                  <div class="col-md-5">
                    <h6 class="text-muted-custom small uppercase fw-bold spacing-2 mb-4">Legal & Lifecycle</h6>
                    <div class="p-4 rounded-4 bg-glass-dark border border-white border-opacity-05">
                      <div class="side-info mb-4">
                        <label class="text-muted small uppercase fw-bold mb-2 d-block">Clearance Holder</label>
                        <div class="text-white-50 leading-relaxed p-3 rounded-3 bg-white bg-opacity-05">
                          <i class="bi bi-file-earmark-check me-2 text-success opacity-75"></i>
                          {{ s.rightsHolder || 'To Be Determined (TBD)' }}
                        </div>
                      </div>

                      <div class="side-info mb-4">
                        <label class="text-muted small uppercase fw-bold mb-2 d-block">Project Association</label>
                        <div class="text-primary-custom h5 fw-bold mb-0">
                          <i class="bi bi-folder2-open me-2 opacity-75"></i>PID-{{ s.projectId }}
                        </div>
                      </div>

                      <div class="side-info pt-3 border-top border-white border-opacity-05">
                        <label class="text-muted small uppercase fw-bold mb-2 d-block">Log Entry</label>
                        <div class="text-muted smaller">
                          Registered: {{ s.createdAt | date:'long' }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 d-flex gap-2">
                       <button class="btn btn-primary-glow-action flex-grow-1 py-3 rounded-pill" (click)="openEditDialog()">
                        <i class="bi bi-pencil-square me-2"></i>Edit Metadata
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-5 pt-4 d-flex justify-content-between align-items-center border-top border-white border-opacity-05">
                   <button class="btn btn-icon-glass text-muted d-flex align-items-center gap-2 px-4 shadow-sm" (click)="goBack()">
                    <i class="bi bi-arrow-left"></i> Exit Inspection
                  </button>
                  <div class="d-flex gap-2">
                    <button class="btn btn-icon-glass-circle" title="System Logs"><i class="bi bi-terminal"></i></button>
                    <button class="btn btn-icon-glass-circle" title="Download Master"><i class="bi bi-download"></i></button>
                    <button class="btn btn-icon-glass-circle btn-delete-danger" title="Purge Asset"><i class="bi bi-trash3"></i></button>
                  </div>
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
    .samples-page { min-height: 100vh; background: radial-gradient(circle at top right, rgba(29, 78, 216, 0.05), transparent 600px); }
    .action-navbar { height: 70px; background: rgba(15, 17, 26, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); z-index: 1050; }
    
    .btn-back-pill { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; transition: all 0.3s ease; border:0; }
    .btn-back-pill:hover { background: rgba(255, 255, 255, 0.1); color: white; transform: translateX(-3px); }

    .inspection-card { transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .card-glow-top { position: absolute; top:0; left:0; right:0; height: 1px; background: linear-gradient(90deg, transparent, rgba(29, 78, 216, 0.3), transparent); }
    
    .asset-hero-icon { width: 80px; height: 80px; background: rgba(255, 255, 255, 0.03); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
    .status-box .badge-status-modern { font-size: 0.8rem; letter-spacing: 1px; }

    .meta-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .bg-blue-glow { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .bg-purple-glow { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

    .text-muted-custom { color: #64748b; letter-spacing: 1.5px; }
    .leading-relaxed { line-height: 1.7; }

    .btn-icon-glass { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; transition: all 0.3s ease; }
    .btn-icon-glass:hover { background: rgba(255, 255, 255, 0.08); color: white; border-color: rgba(255, 255, 255, 0.2); }
    
    .btn-icon-glass-circle { width: 42px; height: 42px; border-radius: 50%; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .btn-icon-glass-circle:hover { background: rgba(255, 255, 255, 0.1); color: white; transform: scale(1.1); }
    .btn-delete-danger:hover { background: #ef4444 !important; border-color: #ef4444 !important; }

    .btn-primary-glow-action { 
      background: linear-gradient(135deg, var(--primary-custom), #1e40af); 
      color: white; border: none; font-weight: 600; transition: all 0.4s ease; 
      box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
    }
    .btn-primary-glow-action:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(29, 78, 216, 0.4); }

    .badge-status-pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .spinner-box { width: 40px; height: 40px; }
    .spinner-inner { width: 100%; height: 100%; border: 3px solid rgba(255, 255, 255, 0.05); border-top-color: var(--primary-custom); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .badge-status-modern { font-size: 0.65rem; font-weight: 700; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ST-DRAFT { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
    .ST-PENDING_CLEARANCE { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.2); }
    .ST-APPROVED, .ST-CLEARED { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .ST-REJECTED { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
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
