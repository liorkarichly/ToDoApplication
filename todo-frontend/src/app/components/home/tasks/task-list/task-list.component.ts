import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Task } from '../../../../models/task';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TasksService } from '../../../../services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'actions'];
  priorityOptions: string[] = ['High', 'Medium', 'Low'];
  tasks$: Observable<Task[]> = new Observable<Task[]>();
  dataSource: Task[] = [];
  editingTaskId: string | null = null;
  minDate: Date = new Date();

  constructor(private tasksService: TasksService, private dialog: MatDialog) {
    this.tasks$ = this.tasksService.tasks$;
  }

  ngOnInit() {
    this.tasksService.getAllTasks();
    this.tasks$.subscribe(tasks => {
      this.dataSource = tasks ?? [];
    });
  }

  /**
   * Toggles task completion status via dropdown.
   */
  updateTaskStatus(task: Task, event: any) {
    console.log(event);
    const updatedStatus = event.value === 'completed';
    this.tasksService.editTask(task._id!, { isCompleted: updatedStatus }).subscribe({
      next: () => {
        task.isCompleted = updatedStatus;
        console.log(`Task ${task._id} completion status updated to:`, updatedStatus);
      },
      error: (err) => console.error('Failed to update task completion status:', err)
    });
  }

  /**
   * Opens confirmation dialog before deleting a task.
   */
  confirmDelete(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.deleteTask(task._id!).subscribe();
      }
    });
  }
/**
  * Saves the edited task.
  */
 saveEdit(task: Task) {
   this.tasksService.editTask(task._id!, { title: task.title }).subscribe(() => {
     task.isEditing = false;
   });
 }

 /**
  * Cancels editing mode.
  */
 cancelEdit(task: Task) {
   task.isEditing = false;
 }

    /**
   * Locks a task for editing.
   */
    startEditing(task: Task) {
      this.tasksService.lockTaskForEdit(task._id!).subscribe(() => {
        this.editingTaskId = task._id!;
        console.log('Task locked:', task._id!);
      });
    }

   /**
   * Unlocks a task after editing is completed.
   */
   finishEditing(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Finish editing "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.editTask(task._id!, { title: task.title, isCompleted: task.isCompleted, priority: task.priority, dueDate: task.dueDate }).subscribe({
          next: (updatedTask) => {
            this.editingTaskId = null;
            console.log('Task updated:', updatedTask);
            this.tasksService.unlockTask(task._id!).subscribe(() => {
            });
          },
          error: (err) => console.error('Failed to update task:', err)
        });
      }
    });
  }

   /**
   * Deletes a task after confirmation.
   */
   deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.deleteTask(task._id!).subscribe({
          next: () => console.log('Task deleted:', task._id),
          error: (err) => console.error('Failed to delete task:', err)
        });
      }
    });
  }

  /**
   * Cancels editing mode and unlocks the task.
   */
  cancelEditing(task: Task) {
    this.editingTaskId = null;
    this.tasksService.unlockTask(task._id!).subscribe(() => {
      console.log('Task edit canceled and unlocked:', task._id);
    });
  }

   /**
   * Toggles task completion status.
   */
   toggleTaskCompletion(task: Task) {
    const updatedStatus = !task.isCompleted;
    this.tasksService.editTask(task._id!, { isCompleted: updatedStatus }).subscribe({
      next: () => {
        task.isCompleted = updatedStatus;
        console.log(`Task ${task._id} completion status updated to:`, updatedStatus);
      },
      error: (err) => console.error('Failed to update task completion status:', err)
    });
  }

  /**
   * Checks if the row should be disabled when another task is being edited.
   */
  isRowDisabled(task: Task): boolean {
    return !!this.editingTaskId && this.editingTaskId !== task._id;
  }
  

  /**
   * Updates task priority.
   */
  updateTaskPriority(task: Task, event: any) {
    const updatedPriority = event.value;
    this.tasksService.editTask(task._id!, { priority: updatedPriority }).subscribe({
      next: () => {
        task.priority = updatedPriority;
        console.log(`Task ${task._id} priority updated to:`, updatedPriority);
      },
      error: (err) => console.error('Failed to update task priority:', err)
    });
  }

  /**
   * Updates task due date.
   */
  updateTaskDueDate(task: Task, event: any) {
    const updatedDueDate = event.value;
    this.tasksService.editTask(task._id!, { dueDate: updatedDueDate }).subscribe({
      next: () => {
        task.dueDate = updatedDueDate;
        console.log(`Task ${task._id} due date updated to:`, updatedDueDate);
      },
      error: (err) => console.error('Failed to update task due date:', err)
    });
  }
}
