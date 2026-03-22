import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SampleService } from '../../core/services/sample-service';
import { SampleResponse } from '../../core/models/sample-response.model';
import { AddSampleDialog } from './add-sample-dialog/add-sample-dialog';

@Component({
  selector: 'app-samples-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, AddSampleDialog],
  templateUrl: './samples-dashboard.html',
  styleUrl: './samples-dashboard.css',
})
export class SamplesDashboard implements OnInit {
  private sampleService = inject(SampleService);
  private route = inject(ActivatedRoute);

  protected projectId = signal<number | null>(null);
  protected samples = signal<SampleResponse[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected showAddDialog = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['projectId'];
      if (id) {
        this.projectId.set(+id);
        this.loadSamples(+id);
      } else {
        this.errorMessage.set('No project ID provided');
        this.isLoading.set(false);
      }
    });
  }

  loadSamples(projectId: number) {
    this.isLoading.set(true);
    this.sampleService.getSamples(projectId).subscribe({
      next: (data) => {
        this.samples.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load samples for this project');
        this.isLoading.set(false);
      }
    });
  }

  onSampleAdded() {
    const id = this.projectId();
    if (id) this.loadSamples(id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'CLEARED': return 'bg-success';
      case 'DENIED': return 'bg-danger';
      case 'Available': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
