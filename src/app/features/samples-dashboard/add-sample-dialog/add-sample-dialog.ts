import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleService } from '../../../core/services/sample-service';
import { CreateSampleRequest } from '../../../core/models/sample-create-request.model';

@Component({
  selector: 'app-add-sample-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sample-dialog.html',
  styleUrl: './add-sample-dialog.css',
})
export class AddSampleDialog {
  private sampleService = inject(SampleService);

  @Input({ required: true }) projectId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() sampleAdded = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected sampleData: CreateSampleRequest = {
    title: '',
    sourceArtist: '',
    sourceTrack: '',
    rightsHolder: ''
  };

  onSubmit() {
    if (!this.sampleData.title) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sampleService.createSample(this.projectId, this.sampleData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.sampleAdded.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to register media asset. High-priority system error.');
      }
    });
  }
}
