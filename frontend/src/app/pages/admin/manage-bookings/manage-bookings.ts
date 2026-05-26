import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manage-bookings',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './manage-bookings.html',
  styleUrl: './manage-bookings.css'
})
export class ManageBookings implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';
  
  private http = inject(HttpClient);
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.loading = true;
    const adminId = this.authService.currentUser()?.userId;
    if (!adminId) return;
    
    this.http.get<Booking[]>(`/api/bookings/admin/${adminId}`).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load bookings. Please ensure the backend is running.';
      }
    });
  }

  approveBooking(bookingId: string) {
    if (confirm('Are you sure you want to approve this booking? All other overlapping requests for this vehicle will be rejected.')) {
      this.adminService.approveBooking(bookingId).subscribe({
        next: () => {
          this.loadAllBookings(); // Reload to see the rejected ones and the approved one
        },
        error: (err) => {
          alert('Failed to approve booking. ' + (err.error?.message || ''));
        }
      });
    }
  }

  rejectBooking(bookingId: string) {
    if (confirm('Are you sure you want to reject this booking?')) {
      this.adminService.rejectBooking(bookingId).subscribe({
        next: () => {
          this.loadAllBookings();
        },
        error: (err) => {
          alert('Failed to reject booking. ' + (err.error?.message || ''));
        }
      });
    }
  }
}
