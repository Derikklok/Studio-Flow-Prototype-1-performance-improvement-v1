import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../core/models/login-response.model';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
})
export class TaskDashboard implements OnInit {
  protected user = signal<LoginResponse | null>(null);

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
