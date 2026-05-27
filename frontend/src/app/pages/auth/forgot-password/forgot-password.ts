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

    this.formData.email = this.formData.email.trim();
    if (!this.formData.email) {
      this.error = 'Write your email address';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.error = 'Enter a valid email';
      return;
    }

    this.formData.mobile = this.formData.mobile.trim();
    if (!this.formData.mobile) {
      this.error = 'Write your mobile number';
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(this.formData.mobile)) {
      this.error = 'Mobile number must be exactly 10 digits.';
      return;
    }

    if (!this.formData.newPassword) {
      this.error = 'Write your password';
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.formData.newPassword)) {
      this.error = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
      return;
    }

    if (!this.formData.confirmPassword) {
      this.error = 'Write your confirm password';
      return;
    }
    if (this.formData.newPassword !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
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
