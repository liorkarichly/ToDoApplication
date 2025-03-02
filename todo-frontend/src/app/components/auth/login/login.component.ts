import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../modules/material/material.module';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // Save token locally
        console.log(res);
        this.authService.saveToken(res.token);
        // Navigate to tasks page
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.message || 'Login failed';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
