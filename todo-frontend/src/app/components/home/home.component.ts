import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../modules/material/material.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [  MaterialModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
