import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AddTaskComponent } from './components/home/tasks/add-task/add-task.component';
import { TaskListComponent } from './components/home/tasks/task-list/task-list.component';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  imports: [
    MaterialModule,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-frontend';
}
