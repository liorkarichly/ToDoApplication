import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TasksService } from '../../../../services/tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  standalone: true,
  imports:[CommonModule, MaterialModule, FormsModule],
})
export class AddTaskComponent {
  newTitle = '';
  newPriority: 'High' | 'Medium' | 'Low' = 'Medium'; // Default priority
  priorityOptions: string[] = ['High', 'Medium', 'Low'];

  newDueDate: Date | null = new Date(); // Default empty due date
  minDate: Date = new Date();
  constructor(private tasksService: TasksService) {}

  addTask() {
    if (this.newTitle.trim()) {
      const newTask = {
        title: this.newTitle.trim(),
        priority: this.newPriority,
        dueDate: this.newDueDate
      };

      this.tasksService.addTask(newTask).subscribe({
        next: (createdTask) => {
          console.log('Task created:', createdTask);
          this.newTitle = ''; // Reset input field
          this.newPriority = 'Medium'; // Reset priority
          this.newDueDate = null; // Reset due date
        },
        error: (err) => console.error('Failed to create task', err)
      });
    }
  }
}
