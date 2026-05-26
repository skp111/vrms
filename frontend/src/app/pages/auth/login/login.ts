import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  error = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        // Fetch user details to get role and verify
        this.authService.fetchUserDetails(res.userId).subscribe({
          next: (user) => {
            this.isLoading = false;
            if (user.role && user.role.toUpperCase() === 'ADMIN') {
              this.router.navigate(['/admin/home']);
            } else {
              this.router.navigate(['/user/home']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.error = 'Failed to load user details';
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Invalid email or password';
        console.error(err);
      }
    });
  }
}
