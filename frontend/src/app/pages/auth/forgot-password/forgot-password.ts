import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  formData = {
    email: '',
    mobile: '',
    newPassword: '',
    confirmPassword: ''
  };

  loading = false;
  error = '';
  success = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  private extractErrorMessage(err: any): string {
    if (err.error && typeof err.error === 'string') {
      try {
        const parsed = JSON.parse(err.error);
        if (parsed.message) return parsed.message;
        if (parsed.error) return parsed.error;
      } catch (e) {
        return err.error;
      }
    }
    return err.error?.message || err.message || 'Password reset failed.';
  }

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.formData.email || !this.formData.mobile || !this.formData.newPassword || !this.formData.confirmPassword) {
      this.error = 'All fields are mandatory';
      return;
    }

    if (this.formData.newPassword !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.formData.newPassword)) {
      this.error = 'Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword({
      email: this.formData.email.trim(),
      mobile: this.formData.mobile.trim(),
      newPassword: this.formData.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err);
      }
    });
  }
}
