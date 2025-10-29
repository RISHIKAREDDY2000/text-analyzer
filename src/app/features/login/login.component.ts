import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.login(this.username(), this.password());
      this.router.navigateByUrl('/analyzer');
    } catch (e: any) {
      this.error.set(e.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }
}
