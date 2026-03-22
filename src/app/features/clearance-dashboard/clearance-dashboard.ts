import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClearanceService } from '../../core/services/clearance-service';
import { ClearanceResponse } from '../../core/models/clearance.model';
import { EditClearanceDialog } from './edit-clearance-dialog/edit-clearance-dialog';
import { InitiateClearanceDialog } from '../samples-dashboard/initiate-clearance-dialog/initiate-clearance-dialog';

@Component({
  selector: 'app-clearance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EditClearanceDialog, InitiateClearanceDialog],
  templateUrl: './clearance-dashboard.html',
  styleUrl: './clearance-dashboard.css',
})
export class ClearanceDashboard implements OnInit {
  private clearanceService = inject(ClearanceService);

  protected clearances = signal<ClearanceResponse[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected selectedClearanceId = signal<number | null>(null);
  protected showEditDialog = signal(false);
  protected showInitiateDialog = signal(false);

  ngOnInit() {
    this.loadClearances();
  }

  loadClearances() {
    this.isLoading.set(true);
    this.clearanceService.getClearances().subscribe({
      next: (data) => {
        this.clearances.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to synchronize clearance records.');
        this.isLoading.set(false);
      }
    });
  }

  approveClearance(id: number) {
    this.clearanceService.approveClearance(id).subscribe({
      next: () => this.loadClearances(),
      error: () => this.errorMessage.set('Authorization failed for this asset.')
    });
  }

  editClearance(id: number) {
    this.selectedClearanceId.set(id);
    this.showEditDialog.set(true);
  }

  deleteClearance(id: number) {
    if (confirm('Purge this clearance record from the secure archive?')) {
      this.clearanceService.deleteClearance(id).subscribe({
        next: () => this.loadClearances(),
        error: () => this.errorMessage.set('Failed to purge record.')
      });
    }
  }

  getStatusClass(isApproved: boolean): string {
    return isApproved ? 'ST-CLEARED' : 'ST-PENDING_CLEARANCE';
  }
}
