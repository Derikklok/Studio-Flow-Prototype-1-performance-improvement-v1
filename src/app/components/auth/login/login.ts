import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { LoginRequest } from '../../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected credentials: LoginRequest = {
    email: '',
    password: ''
  };

  protected errorMessage = signal<string | null>(null);
  protected isLoading = signal(false);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Save user info to state (demonstration)
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid email or password');
        this.isLoading.set(false);
      }
    });
  }
}
