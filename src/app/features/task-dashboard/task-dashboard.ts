import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../core/models/login-response.model';
import { TaskList } from './task-list/task-list';
import { CreateTaskDialog } from './create-task-dialog/create-task-dialog';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, TaskList, CreateTaskDialog],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
})
export class TaskDashboard implements OnInit {
  protected user = signal<LoginResponse | null>(null);
  protected showCreateDialog = signal(false);

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  onProjectCreated(taskList: TaskList) {
    taskList.loadProjects();
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
