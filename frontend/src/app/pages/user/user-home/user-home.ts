import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../../shared/components/footer/footer';
import { AuthService } from '../../../core/services/auth.service';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { User } from '../../../models/models';

@Component({
  selector: 'app-user-home',
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome implements OnInit {
  authService = inject(AuthService);
  user: User | null = null;
  loading = true;

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (currentUser?.userId) {
      this.authService.fetchUserDetails(currentUser.userId).subscribe({
        next: (u) => {
          this.user = u;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }
}
