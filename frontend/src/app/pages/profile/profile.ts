import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';

  private authService = inject(AuthService);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const authUser = this.authService.currentUser();
    if (!authUser || !authUser.userId) {
      this.error = 'Not logged in';
      this.loading = false;
      return;
    }

    const userId = authUser.userId;
    this.authService.fetchUserDetails(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile details.';
        this.loading = false;
      }
    });
  }
}
