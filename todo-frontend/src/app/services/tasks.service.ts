// src/app/services/tasks.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';
import { WebSocketService } from './web-socket.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private baseUrl = `${environment.API_BASE_URL}/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private ws: WebSocketService, private authService: AuthService) {
    this.listenToWebSocketUpdates();
  }


/**
 * Listen to WebSocket updates for real-time task updates.
 */
private listenToWebSocketUpdates() {
  this.ws.listen<Task>('taskCreated').subscribe(task => this.addTaskToLocal(task));
  this.ws.listen<Task>('taskUpdated').subscribe(updatedTask => this.updateLocalTask(updatedTask));
  this.ws.listen<{ _id: string }>('taskDeleted').subscribe(({ _id }) => this.removeTaskFromLocal(_id));
  this.ws.listen<Task>('taskLocked').subscribe(task => this.updateLocalTask(task));
  this.ws.listen<Task>('taskUnlocked').subscribe(task => this.updateLocalTask(task));
}


  /**
   * Fetch all tasks from the API.
   */
  getAllTasks(): void {
    this.http.get<Task[]>(`${this.baseUrl}`).subscribe(tasks => this.tasksSubject.next(tasks));
  }

// Update the addTask method in TasksService
addTask(task: { title: string; priority: 'High' | 'Medium' | 'Low'; dueDate: Date | null }): Observable<Task> {
  return new Observable(observer => {
    this.http.post<Task>(`${this.baseUrl}`, task).subscribe({
      next: (newTask) => {
        this.ws.emit('createTask', newTask);
        observer.next(newTask);
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}
  /**
   * Update a task (REST + WebSocket).
   */
  editTask(id: string, updates: Partial<Task>): Observable<Task> {
    return new Observable(observer => {
      this.http.put<Task>(`${this.baseUrl}/${id}`, updates).subscribe({
        next: (updatedTask) => {
          console.log('Server responded with:', updatedTask);
          this.ws.emit('updateTask', updatedTask);
          observer.next(updatedTask);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  /**
   * Delete a task (REST + WebSocket).
   */
  deleteTask(id: string): Observable<void> {
    return new Observable(observer => {
      this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
        next: () => {
          this.ws.emit('deleteTask', { _id: id });
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Lock a task for editing.
   */
  lockTaskForEdit(id: string) {
    const userId = this.authService.getUserId(); // Get user ID from AuthService
    return new Observable(observer => {
      this.http.put<Task>(`${this.baseUrl}/${id}/lock`, { userId }).subscribe({
        next: (lockedTask) => {
          this.ws.emit('taskLocked', lockedTask);
          observer.next(lockedTask);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Unlock a task after editing.
   */
  unlockTask(id: string): Observable<Task> {
    const userId = this.authService.getUserId(); // Get user ID from AuthService
    return new Observable(observer => {
      this.http.put<Task>(`${this.baseUrl}/${id}/release`, { userId }).subscribe({
        next: (unlockedTask) => {
          this.ws.emit('taskUnlocked', unlockedTask);
          observer.next(unlockedTask);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Release a task from editing.
   */
  releaseTaskFromEdit(id: string) {
    this.http.put<Task>(`${this.baseUrl}/${id}/release`, {}).subscribe(task => {
      this.ws.emit('releaseTask', task);
    });
  }

  private addTaskToLocal(task: Task) {
    this.tasksSubject.next([...this.tasksSubject.value, task]);
  }

  private updateLocalTask(updatedTask: Task) {
    const tasks = this.tasksSubject.value.map(task => task._id === updatedTask._id ? updatedTask : task);
    this.tasksSubject.next(tasks);
  }

  private removeTaskFromLocal(taskId: string) {
    this.tasksSubject.next(this.tasksSubject.value.filter(task => task._id !== taskId));
  }
}
