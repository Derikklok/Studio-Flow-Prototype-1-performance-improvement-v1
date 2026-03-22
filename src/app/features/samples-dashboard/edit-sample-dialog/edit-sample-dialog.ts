import { Component, EventEmitter, Input, Output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleService } from '../../../core/services/sample-service';
import { SampleResponse } from '../../../core/models/sample-response.model';
import { UpdateSampleRequest } from '../../../core/models/sample-update-request.model';

@Component({
  selector: 'app-edit-sample-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-sample-dialog.html',
  styleUrl: './edit-sample-dialog.css',
})
export class EditSampleDialog implements OnInit {
  private sampleService = inject(SampleService);

  @Input({ required: true }) sample!: SampleResponse;
  @Output() close = new EventEmitter<void>();
  @Output() sampleUpdated = new EventEmitter<void>();

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected editData: UpdateSampleRequest = {
    title: '',
    sourceArtist: '',
    sourceTrack: '',
    rightsHolder: '',
    status: ''
  };

  ngOnInit() {
    this.editData = {
      title: this.sample.title,
      sourceArtist: this.sample.sourceArtist,
      sourceTrack: this.sample.sourceTrack,
      rightsHolder: this.sample.rightsHolder,
      status: this.sample.status
    };
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sampleService.patchSample(this.sample.id, this.editData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.sampleUpdated.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to synchronize manifest changes.');
      }
    });
  }
}
