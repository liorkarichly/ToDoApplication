import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, TaskListComponent, AddTaskComponent, MatCardModule],
  template: `
    <mat-card class="task-page-container">
      <mat-card-title class="task-page-title">Task Management</mat-card-title>
      <app-add-task></app-add-task>
      <app-task-list></app-task-list>
    </mat-card>
  `
})
export class TaskPageComponent {}
