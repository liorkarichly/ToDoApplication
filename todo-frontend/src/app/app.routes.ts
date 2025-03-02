import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { TaskPageComponent } from './components/home/tasks/task-page/task-page.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
      },
      {
        path: 'auth',
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent }
        ]
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'tasks', pathMatch: 'full' },
          { path: 'tasks', component: TaskPageComponent },
        ]
      },
      { path: '**', redirectTo: 'auth/login' }
];
