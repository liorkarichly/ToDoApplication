import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../modules/material/material.module';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [MaterialModule,FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}
  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (res) => {
        this.successMsg = 'Registered successfully! You can now log in.';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.message || 'Registration failed';
      }
    });
  }
}
