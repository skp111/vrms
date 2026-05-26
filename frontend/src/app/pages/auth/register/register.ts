import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  mobile = '';
  address = '';
  licenseNumber = '';
  role = 'USER';
  
  isLoading = false;
  error = '';
  success = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.name = this.name.trim();
    if (!this.name) {
      this.error = 'Write your name';
      return;
    }
    if (this.name.length < 3) {
      this.error = 'Name must be at least 3 characters long';
      return;
    }

    if (!this.email) {
      this.error = 'Write your email address';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Enter a valid email';
      return;
    }

    if (!this.password) {
      this.error = 'Write your password';
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.error = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
      return;
    }

    if (!this.confirmPassword) {
      this.error = 'Write your confirm password';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!this.mobile) {
      this.error = 'Write your mobile number';
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(this.mobile)) {
      this.error = 'Mobile number must be exactly 10 digits.';
      return;
    }

    this.address = this.address.trim();
    if (!this.address) {
      this.error = 'Write your address';
      return;
    }
    if (this.address.length < 12) {
      this.error = 'Address must be at least 12 characters long';
      return;
    }

    if (!this.licenseNumber) {
      this.error = 'Write your driving license number';
      return;
    }
    this.licenseNumber = this.licenseNumber.toUpperCase();
    const licenseRegex = /^[A-Z]{2}-\d{2}-\d{4}-\d{7}$/;
    if (!licenseRegex.test(this.licenseNumber)) {
      this.error = 'Driving License must follow the format SS-RR-YYYY-NNNNNNN (2 letters followed by numbers).';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const req = { 
      name: this.name, 
      email: this.email, 
      password: this.password,
      mobile: this.mobile,
      address: this.address,
      licenseNumber: this.licenseNumber,
      role: this.role
    };
    this.authService.register(req).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        let backendMsg = '';
        try {
          if (typeof err.error === 'string') {
            const parsed = JSON.parse(err.error);
            backendMsg = parsed.message || parsed.error;
          } else {
            backendMsg = err.error?.message || err.error?.error;
          }
        } catch (e) {
          backendMsg = err.error; // Not JSON, use raw string
        }
        
        this.error = backendMsg || err.message || 'Registration failed. Please try again.';
        console.error(err);
      }
    });
  }
}
