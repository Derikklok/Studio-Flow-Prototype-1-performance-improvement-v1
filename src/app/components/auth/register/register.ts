import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { RegisterRequest } from '../../../core/models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected userDetails: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    role: 'Producer'
  };

  protected errorMessage = signal<string | null>(null);
  protected isLoading = signal(false);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.userDetails).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
