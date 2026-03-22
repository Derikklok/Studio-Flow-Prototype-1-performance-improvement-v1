import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../core/models/login-response.model';
import { TaskList } from './task-list/task-list';
import { CreateTaskDialog } from './create-task-dialog/create-task-dialog';
import { ViewProjectDialog } from './view-project-dialog/view-project-dialog';
import { EditProjectDialog } from './edit-project-dialog/edit-project-dialog';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog';
import { ProjectResponse } from '../../core/models/project-response.model';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, TaskList, CreateTaskDialog, ViewProjectDialog, EditProjectDialog, ConfirmDeleteDialog],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
})
export class TaskDashboard implements OnInit {
  protected user = signal<LoginResponse | null>(null);
  protected showCreateDialog = signal(false);
  protected selectedProjectId = signal<number | null>(null);
  protected editProjectId = signal<number | null>(null);
  protected deleteProjectData = signal<ProjectResponse | null>(null);

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  onProjectCreated(taskList: TaskList) {
    taskList.loadProjects();
  }

  onProjectUpdated(taskList: TaskList) {
    taskList.loadProjects();
  }

  onViewProject(id: number) {
    this.selectedProjectId.set(id);
  }

  onEditProject(id: number) {
    this.editProjectId.set(id);
  }

  onDeleteProject(project: ProjectResponse) {
    this.deleteProjectData.set(project);
  }

  onProjectDeleted(taskList: TaskList) {
    taskList.loadProjects();
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
